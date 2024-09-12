using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Logging;

namespace DiplomaMakerApi.Tests.Integration
{
    public class DiplomaMakerApiFactory : WebApplicationFactory<IDiplomaApiMarker>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureLogging(logging => {
                logging.ClearProviders();
            });
        }
    }
}