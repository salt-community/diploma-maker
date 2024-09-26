
using Ductus.FluentDocker.Builders;
using Ductus.FluentDocker.Model.Common;
using Ductus.FluentDocker.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration;

public class SharedTestContext : IAsyncLifetime
{
    public const string AppUrl = "http://localhost:5173";
    private static readonly string DockerComposeFile = 
        Path.Combine(Directory.GetCurrentDirectory(), (TemplateString)"../../../../docker-compose.integration.yml");
    private readonly ICompositeService _dockerService = new Builder()
        .UseContainer()
        .UseCompose()
        .FromFile(DockerComposeFile)
        .RemoveOrphans()
        .WaitForHttp("diploma-maker-test-frontend", AppUrl)
        .Build();
    private IPlaywright? _playwright;
    public IBrowser? Browser {get; private set;}
    public string? ClerkLoginUser { get; private set; }
    public string? ClerkLoginPassword { get; private set; }
    public async Task InitializeAsync()
    {
        LoadConfiguration();
        _dockerService.Start();
        _playwright = await Playwright.CreateAsync();
        Browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            // Headless = false,
            SlowMo = 1500
        });

        // Login Procedure (So we don't have to do it in every test class)
        var page = await Browser.NewPageAsync(new BrowserNewPageOptions
        {
            BaseURL = AppUrl
        });
        await page.GotoAsync("/sign-in");
        await page.FillAsync("input:nth-of-type(1)", ClerkLoginUser!);
        await page.ClickAsync("button.cl-formButtonPrimary");
        await page.ClickAsync("button.cl-alternativeMethodsBlockButton");
        await page.FillAsync("input[name='password']", ClerkLoginPassword!);
        await page.ClickAsync("span.cl-internal-2iusy0");
        await page.Context.StorageStateAsync(new BrowserContextStorageStateOptions
        {
            Path = "loginState.json"
        });
    }
    public async Task DisposeAsync()
    {
        _dockerService.Dispose();
        await Browser!.DisposeAsync();
        _playwright!.Dispose();
    }

    private void LoadConfiguration()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory() + "../../../../")
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddUserSecrets<SharedTestContext>()
            .Build();

        ClerkLoginUser = configuration["clerk:loginuser"] ?? throw new ArgumentNullException("clerk:loginuser", "Clerk login user is not configured.");
        ClerkLoginPassword = configuration["clerk:loginpassword"] ?? throw new ArgumentNullException("clerk:loginpassword", "Clerk login password is not configured.");
    }
}