using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Testcontainers.PostgreSql;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration
{
    public class DiplomaMakerApiFactory : WebApplicationFactory<IDiplomaApiMarker>, IAsyncLifetime
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
                services.RemoveAll(typeof(IHostedService));
                services.RemoveAll(typeof(DiplomaMakingContext));
                services.RemoveAll(typeof(DbContext));
                services.AddDbContext<DiplomaMakingContext>(opt => {
                    opt.UseNpgsql(_dbContainer.GetConnectionString());
                });
            });

            builder.UseEnvironment("Test");
        }

        public async Task InitializeAsync()
        {
            await _dbContainer.StartAsync();
            using (var scope = Server.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                SeedData.Initialize(services);
            }
        }

        public new async Task DisposeAsync()
        {
            await _dbContainer.DisposeAsync();
        }
    }
}