using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Testcontainers.PostgreSql;

namespace DiplomaMakerApi.Tests.Integration
{
    public class DiplomaMakerApiFactory : WebApplicationFactory<IDiplomaApiMarker>
    {
        private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
            .WithDatabase("diploma_maker_db")
            .WithUsername("postgres")
            .WithPassword("Password_2_Change_4_Real_Cases_&")
            .Build();
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureLogging(logging => {
                logging.ClearProviders();
            });

            builder.ConfigureTestServices(services => {
                services.RemoveAll(typeof(DiplomaMakingContext));
                services.AddDbContext<DiplomaMakingContext>(opt => {
                    opt.UseNpgsql(_dbContainer.GetConnectionString());
                });
            });
        }
    }
}