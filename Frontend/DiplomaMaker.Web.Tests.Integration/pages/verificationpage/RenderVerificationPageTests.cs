using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.verificationpage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderVerificationPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;
        public RenderVerificationPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;
            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task VerificationPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            var page = await _testContext.Browser!.NewPageAsync(new Microsoft.Playwright.BrowserNewPageOptions{
                BaseURL = SharedTestContext.AppUrl
            });
            await page.GotoAsync("/verify");

            // Act
            var content = await page.TextContentAsync("body");

            // Assert
            content.Should().Contain("Verify");
        }

        [Fact]
        public async Task VerificationIncorrectCheckPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            var page = await _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions{
                BaseURL = SharedTestContext.AppUrl
            });
            await page.GotoAsync($"/verify/{Guid.NewGuid()}");

            // Act
            var content = await page.TextContentAsync("body");

            // Assert
            content.Should().Contain("Veri");
        }
    }
}