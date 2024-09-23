using FluentAssertions;

namespace DiplomaMaker.Web.Tests.Integration.pages.verificationpage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderVerificationPageTests
    {
        private readonly SharedTestContext _testContext;
        public RenderVerificationPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;
        }

        [Fact]
        public async Task VerficiationPage_ShouldRenderSuccessfully_WhenNavigating()
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
    }
}