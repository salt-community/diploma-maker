using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
            builder.UseEnvironment("Test");

            builder.ConfigureLogging(logging => {
                logging.ClearProviders();
            });

            builder.ConfigureAppConfiguration((context, config) =>
            {
                var configuration = new Dictionary<string, string>
                {
                    { "Blob:UseBlobStorage", "false" },
                    { "GoogleCloud:BucketName", "test-bucket" },
                };
                config.AddInMemoryCollection(configuration!);
            });

            builder.ConfigureTestServices(services => {
                services.RemoveAll(typeof(IHostedService));
                services.RemoveAll(typeof(DiplomaMakingContext));
                services.AddDbContext<DiplomaMakingContext>(opt => {
                    opt.UseNpgsql(_dbContainer.GetConnectionString());
                });
                
                services.RemoveAll(typeof(JwtBearerHandler));

                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                })
                .AddScheme<AuthenticationSchemeOptions, MockAuthorization>("Test", options => { });

                services.AddAuthorization(options =>
                {
                    options.AddPolicy("TestPolicy", policy =>
                    {
                        policy.RequireAuthenticatedUser();
                    });
                });
            });
        }
        public async Task InitializeAsync()
        {
            await _dbContainer.StartAsync();
            using (var scope = Server.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                SeedData.Initialize(services);
            }
            cloneDefaultFiles();
        }
        public new async Task DisposeAsync()
        {
            await _dbContainer.DisposeAsync();
            cleanupTestFiles();
        }
        private void cloneDefaultFiles()
        {
            var testProjectBinRoot = Directory.GetCurrentDirectory();
            var solutionRoot = Path.GetFullPath(Path.Combine(testProjectBinRoot, "..", "..", "..", ".."));
            var apiProjectRoot = Path.Combine(solutionRoot, "DiplomaMakerApi");
            var sourceFilePath = Path.Combine(apiProjectRoot, "Blob", "DiplomaPdfs", "Default.pdf");
            var destinationDirectory = Path.Combine(testProjectBinRoot, "Blob", "DiplomaPdfs");

            if (!Directory.Exists(destinationDirectory))
            {
                Directory.CreateDirectory(destinationDirectory);
            }

            var destinationFilePath = Path.Combine(destinationDirectory, "Default.pdf");
            if (File.Exists(sourceFilePath))
            {
                File.Copy(sourceFilePath, destinationFilePath, true);
            }
            else
            {
                throw new FileNotFoundException($"Source file {sourceFilePath} not found.");
            }
        }

        private void cleanupTestFiles()
        {
            var testProjectBinRoot = Directory.GetCurrentDirectory();
            var blobDirectoryPath = Path.Combine(testProjectBinRoot, "Blob");
            Directory.Delete(blobDirectoryPath, true);
        }

    }
}