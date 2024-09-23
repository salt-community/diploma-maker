
using Ductus.FluentDocker.Builders;
using Ductus.FluentDocker.Model.Common;
using Ductus.FluentDocker.Services;
using Microsoft.Playwright;

namespace DiplomaMaker.Web.Tests.Integration;

public class SharedTestContext : IAsyncLifetime
{
    public const string AppUrl = "http://localhost:5000";
    private static readonly string DockerComposeFile = 
        Path.Combine(Directory.GetCurrentDirectory(), (TemplateString)"../../../docker-compose.integration.yml");
    private readonly ICompositeService _dockerService = new Builder()
        .UseContainer()
        .UseCompose()
        .FromFile(DockerComposeFile)
        .RemoveOrphans()
        .WaitForHttp("diploma-maker-test-backend", AppUrl)
        .Build();
    private IPlaywright? _playwright;
    public IBrowser? Browser {get; private set;}
    public async Task InitializeAsync()
    {
        _dockerService.Start();
        _playwright = await Playwright.CreateAsync();
        Browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false,
            SlowMo = 1000
        });
    }
    public async Task DisposeAsync()
    {
        _dockerService.Dispose();
        await Browser!.DisposeAsync();
        _playwright!.Dispose();
    }
}