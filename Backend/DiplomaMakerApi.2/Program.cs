using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi._2.Database;

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
