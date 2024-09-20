using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Services;
using DiplomaMakerApi.Middleware;
using DiplomaMakerApi.Configuration;
using System.Text.Json.Serialization;
using Clerk.Net.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

/* var logger = LoggerFactory.Create(loggingBuilder => 
{
    loggingBuilder.AddConsole();
}).CreateLogger<Program>();
logger.LogInformation("Connection string: {ConnectionString}", connectionstr); */
if(!builder.Environment.IsDevelopment()) {
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

builder.Services.AddControllers().AddJsonOptions(opt => {
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddClerkApiClient(config =>
{
    config.SecretKey = builder.Environment.IsDevelopment() 
        ? builder.Configuration["Clerk:SecretKey"]! 
        : Environment.GetEnvironmentVariable("Clerk:SecretKey")!;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(x =>
    {
        x.Authority = builder.Environment.IsDevelopment() 
            ? builder.Configuration["Clerk:Authority"] 
            : Environment.GetEnvironmentVariable("Clerk:Authority")!;
            
        x.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateAudience = false,
            NameClaimType = ClaimTypes.NameIdentifier 
        };
        x.Events = new JwtBearerEvents()
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
            new string[] {}
        }
    });
});
builder.Services.AddCors();
builder.Services.AddAutoMapper(typeof(AutomapperConfig));
builder.Services.AddScoped<BootcampService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<TemplateService>();
builder.Services.AddScoped<TrackService>();
builder.Services.AddTransient<LocalFileStorageService>();
builder.Services.AddScoped<HistorySnapshotService>();
builder.Services.AddTransient<FileUtilityService>();
builder.Services.AddScoped<UserFontService>();
builder.Services.AddScoped<ClerkService>();
builder.Services.AddScoped<EmailService>();
if (!builder.Environment.IsEnvironment("Test"))
{
    builder.Services.AddScoped<GoogleCloudStorageService>();
}


builder.Services.AddLogging();

var app = builder.Build();
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{   
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        SeedData.Initialize(services);
    }
  
}

app.UseSwagger();

app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();