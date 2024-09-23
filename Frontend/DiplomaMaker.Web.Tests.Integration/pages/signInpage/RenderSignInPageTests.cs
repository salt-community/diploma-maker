using FluentAssertions;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderSignInPageTests
    {
        private readonly SharedTestContext _testContext;
        public RenderSignInPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;
        }

        [Fact]
        public async Task SignInPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            var page = await _testContext.Browser!.NewPageAsync(new Microsoft.Playwright.BrowserNewPageOptions{
                BaseURL = SharedTestContext.AppUrl
            });
            await page.GotoAsync("/sign-in");

            // Act
            var content = await page.TextContentAsync("body");

            // Assert
            content.Should().Contain("DiplomaPro");
        }
    }
}