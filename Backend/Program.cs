using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using JokesAPI.Configuration;
using Backend.Models;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<DiplomaMakingContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DiplomaMakingContext") ?? throw new InvalidOperationException("Connection string 'DiplomaMakingContext' not found.")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.AddAutoMapper(typeof(AutomapperConfig));
builder.Services.AddScoped<BootcampService>();
builder.Services.AddScoped<DiplomaService>();
builder.Services.AddScoped<TemplateService>();

var app = builder.Build();
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
