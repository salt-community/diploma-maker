
using Ductus.FluentDocker.Builders;
using Ductus.FluentDocker.Model.Common;
using Ductus.FluentDocker.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration;

public class SharedTestContext : IAsyncLifetime
{
    public const string AppUrl = "http://localhost:5173";
    private static readonly string DockerComposeFile = 
        Path.Combine(Directory.GetCurrentDirectory(), (TemplateString)"../../../docker-compose.integration.yml");
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
        cloneDefaultFiles();
        LoadConfiguration();
        _dockerService.Start();
        _playwright = await Playwright.CreateAsync();
        Browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = false,
            SlowMo = 1500
        });
    }
    public async Task DisposeAsync()
    {
        // Console.WriteLine("Press Enter to close the browser...");
        // Console.ReadLine();
        _dockerService.Dispose();
        await Browser!.DisposeAsync();
        _playwright!.Dispose();
        cleanupTestFiles();
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
    private void cloneDefaultFiles()
    {
        var testProjectBinRoot = Directory.GetCurrentDirectory();
        var solutionRoot = Path.GetFullPath(Path.Combine(testProjectBinRoot, "..", "..", "..", ".."));
        var apiProjectRoot = Path.Combine(solutionRoot, "..", "Backend", "DiplomaMakerApi");
        var basePdfTemplateFile = Path.Combine(apiProjectRoot, "Blob", "DiplomaPdfs", "Default.pdf");

        var imagePreviewLQIPDirectory = Path.Combine(testProjectBinRoot, "Blob", "ImagePreviewLQIP");
        var imagePreviewDirectory = Path.Combine(testProjectBinRoot, "Blob", "ImagePreview");
        var userFontsDirectory = Path.Combine(testProjectBinRoot, "Blob", "UserFonts");

        var destinationDirectory = Path.Combine(testProjectBinRoot, "Blob", "DiplomaPdfs");

        if (!Directory.Exists(imagePreviewLQIPDirectory))
        {
            Directory.CreateDirectory(imagePreviewLQIPDirectory);
        }

        if (!Directory.Exists(imagePreviewDirectory))
        {
            Directory.CreateDirectory(imagePreviewDirectory);
        }

        if (!Directory.Exists(userFontsDirectory))
        {
            Directory.CreateDirectory(userFontsDirectory);
        }

        if (!Directory.Exists(destinationDirectory))
        {
            Directory.CreateDirectory(destinationDirectory);
        }

        var destinationFilePath = Path.Combine(destinationDirectory, "Default.pdf");

        if (File.Exists(basePdfTemplateFile))
        {
            File.Copy(basePdfTemplateFile, destinationFilePath, overwrite: true);
        }
        else
        {
            throw new FileNotFoundException($"Basetemplatepdf not found (Blob/DiplomaPdfs/Default.pdf).");
        }
    }
    private void cleanupTestFiles()
    {
        var testProjectBinRoot = Directory.GetCurrentDirectory();
        var blobDirectoryPath = Path.Combine(testProjectBinRoot, "Blob");

        if (Directory.Exists(blobDirectoryPath))
        {
            Directory.Delete(blobDirectoryPath, true);
        }
    }
}