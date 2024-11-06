using System.Text.Json.Serialization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Clerk.Net.DependencyInjection;

using DiplomaMakerApi.Services;
using DiplomaMakerApi.Middleware;
using DiplomaMakerApi.Configuration;
using DiplomaMakerApi.Data;


var builder = WebApplication.CreateBuilder(args);

var logger = LoggerFactory.Create(loggingBuilder =>
{
    loggingBuilder.AddConsole();
}).CreateLogger<Program>();

if (!builder.Environment.IsDevelopment())
{
    builder.WebHost.UseKestrel(options =>
    {
        var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
        options.ListenAnyIP(int.Parse(port));
    });
}

if (!builder.Environment.IsEnvironment("Test"))
{
    string? connectionstr = builder.Environment.IsDevelopment() ?
                            builder.Configuration.GetConnectionString("PostgreSQLConnectionLocal") :
                            Environment.GetEnvironmentVariable("PostgreConnection");

    builder.Services.AddDbContext<DiplomaMakingContext>(options =>
        options.UseNpgsql(connectionstr
            ?? throw new InvalidOperationException("Connection string 'DiplomaMakingContext' not found.")
        ));

    builder.Services.AddHostedService(service =>
        new DatabasePokeService(service, connectionstr
            ?? throw new InvalidOperationException("Connection string is null")
        ));
}

builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole();
});

builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

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
    }
);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors();
builder.Services.AddAutoMapper(typeof(AutomapperConfig));
builder.Services.AddScoped<BootcampService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<TemplateService>();
builder.Services.AddScoped<TrackService>();
builder.Services.AddScoped<SnapshotService>();
builder.Services.AddTransient<FileUtilityService>();
builder.Services.AddScoped<UserFontService>();
builder.Services.AddScoped<ClerkService>();
builder.Services.AddScoped<EmailService>();

if (bool.Parse(builder.Configuration["Blob:UseBlobStorage"]
    ?? throw new InvalidOperationException("Blob:UseBlobStorage configuration is missing")))
{
    builder.Services.AddScoped<IStorageService, GoogleCloudStorageService>();
}
else
{
    builder.Services.AddScoped<IStorageService, LocalFileStorageService>();
}

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Test"))
{
    logger.LogInformation($"Clerk:Authority: {builder.Configuration["Clerk:Authority"]}");
    logger.LogInformation($"Clerk:AuthorizedParty: {builder.Configuration["Clerk:AuthorizedParty"]}");

    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
}

app.UseSwagger();
app.UseSwaggerUI();

if (!builder.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

app.Run();