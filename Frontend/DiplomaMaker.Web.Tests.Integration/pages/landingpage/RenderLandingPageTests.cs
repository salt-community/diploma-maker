using FluentAssertions;

namespace DiplomaMaker.Web.Tests.Integration.pages.landingpage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderLandingPageTests
    {
        private readonly SharedTestContext _testContext;
        public RenderLandingPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;
        }

        [Fact]
        public async Task LandingPage_ShouldRenderSuccessfully_WhenNavigatingToRoot()
        {
            // Arrange
            var page = await _testContext.Browser!.NewPageAsync(new Microsoft.Playwright.BrowserNewPageOptions{
                BaseURL = SharedTestContext.AppUrl
            });
            await page.GotoAsync("");

            // Act
            var content = await page.TextContentAsync("body");

            // Assert
            content.Should().NotBeNull();
        }
    }
}