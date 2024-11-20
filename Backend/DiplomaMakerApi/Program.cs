using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Clerk.Net.DependencyInjection;

using DiplomaMakerApi.Database;
using DiplomaMakerApi.Services;
using Microsoft.IdentityModel.Tokens;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var configurationVariables = GetConfigurationVariables(builder);

        builder.Services.AddCors();
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddDbContext<DiplomaMakerContext>(options =>
            options.UseNpgsql(configurationVariables.DBConnectionString)
        );
        builder.Services.AddTransient<EmailService>();
        builder.Services.AddClerkApiClient(options =>
            options.SecretKey = configurationVariables.ClerkSecretKey
        );
        
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = configurationVariables.ClerkAuthority;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateAudience = false
                };
            });

        var app = builder.Build();

        using var scope = app.Services.CreateScope();
        scope.ServiceProvider.GetRequiredService<DiplomaMakerContext>().SeedData();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }

    private record ConfigurationVariables(
        string DBConnectionString,
        string ClerkSecretKey,
        string ClerkAuthority,
        string ClerkOAuthGoogleUrl);

    /*
        Collects all configuration variables together in one object.
        TODO: Make this available through dependency injection to simplify EmailService
    */
    private static ConfigurationVariables GetConfigurationVariables(WebApplicationBuilder builder)
    {
        if (builder.Environment.IsDevelopment())
        {
            Console.WriteLine("Environment: Development");

            return new ConfigurationVariables(
                builder.Configuration["PostgreSQLConnectionLocal"]
                    ?? throw new Exception("PostgreSQLConnectionLocal is not defined"),
                builder.Configuration["Clerk:SecretKey"]
                    ?? throw new Exception("Clerk:SecretKey is not defined"),
                builder.Configuration["Clerk:Authority"]
                    ?? throw new Exception("Clerk:Authority is not defined"),
                builder.Configuration["Clerk:OAuthGoogleUrl"]
                    ?? throw new Exception("Clerk:OAuthGoogleUrl is not defined")
            );
        }

        Console.WriteLine("Environment: Production");

        return new ConfigurationVariables(
            Environment.GetEnvironmentVariable("PostgreConnection")
                ?? throw new Exception("PostgreConnection is not defined"),
            Environment.GetEnvironmentVariable("Clerk:SecretKey")
                ?? throw new Exception("Clerk:SecretKey is not defined"),
            Environment.GetEnvironmentVariable("Clerk:Authority")
                ?? throw new Exception("Clerk:Authority is not defined"),
            ""
        );
    }
}