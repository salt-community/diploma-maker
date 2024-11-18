using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Clerk.Net.DependencyInjection;

using DiplomaMakerApi.Database;
using DiplomaMakerApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string connectionString = (builder.Environment.IsDevelopment()
    ? builder.Configuration["PostgreSQLConnectionLocal"]
    : Environment.GetEnvironmentVariable("PostgreConnection"))
        ?? throw new InvalidOperationException("Connection string 'DiplomaMakerContext' not found.");

builder.Services.AddDbContext<DiplomaMakerContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddTransient<EmailService>();

builder.Services.AddClerkApiClient(config =>
{
    config.SecretKey = builder.Environment.IsDevelopment()
        ? builder.Configuration["Clerk:SecretKey"]!
        : Environment.GetEnvironmentVariable("Clerk:SecretKey")!;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Environment.IsDevelopment()
            ? builder.Configuration["Clerk:Authority"]
            : Environment.GetEnvironmentVariable("Clerk:Authority")!;

        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();

        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateAudience = false,
            NameClaimType = ClaimTypes.NameIdentifier
        };

        options.Events = new JwtBearerEvents()
        {
            OnTokenValidated = context =>
            {
                var azp = context.Principal?.FindFirstValue("azp");

                if (string.IsNullOrEmpty(azp) || !azp.Equals(builder.Environment.IsDevelopment()
                        ? builder.Configuration["Clerk:AuthorizedParty"]
                        : Environment.GetEnvironmentVariable("Clerk:AuthorizedParty")!))
                    context.Fail("AZP Claim is invalid or missing");

                return Task.CompletedTask;
            }
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
