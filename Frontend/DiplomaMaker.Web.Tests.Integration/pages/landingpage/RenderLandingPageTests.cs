using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.landingpage
{
    [Collection("Tests DiplomaMaker.Web.Tests.Integration")]
    public class RenderLandingPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;
        public RenderLandingPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task LandingPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            await _page.GotoAsync("");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var content = await _page.TextContentAsync("body");

            // Assert
            content.Should().Contain("Welcome");
        }
    }
}