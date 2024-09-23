
using Ductus.FluentDocker.Builders;
using Ductus.FluentDocker.Model.Common;
using Ductus.FluentDocker.Services;

namespace DiplomaMaker.Web.Tests.Integration;

public class SharedTestContext : IAsyncLifetime
{
    private static readonly string DockerComposeFile = 
        Path.Combine(Directory.GetCurrentDirectory(), (TemplateString)"../../../docker-compose.integration.yml");

    private readonly ICompositeService _dockerService = new Builder()
        .UseContainer()
        .UseCompose()
        .FromFile(DockerComposeFile)
        .RemoveOrphans()
        .WaitForHttp("diploma-maker-test-backend", "http://localhost:5000")
        .Build();

    public async Task InitializeAsync()
    {
        _dockerService.Start();
    }
    public async Task DisposeAsync()
    {
        _dockerService.Dispose();
    }
}