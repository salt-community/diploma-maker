using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.diplomaMakingPage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderDiplomaMakingPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderDiplomaMakingPageTests(SharedTestContext testContext)
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
            await _page.GotoAsync("/pdf-creator");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var content = await _page.TextContentAsync("body");

            // Assert
            content.Should().Contain("Generate");
        }
    }
}