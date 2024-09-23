using FluentAssertions;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.verificationpage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class LoginSignInPageTests
    {
        private readonly SharedTestContext _testContext;
        public LoginSignInPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;
        }

        [Fact]
        public async Task LoginToSignInPage_ShouldLoginSuccessfully_WhenValidLoginDetails()
        {
            // Arrange
            var page = await _testContext.Browser!.NewPageAsync(new Microsoft.Playwright.BrowserNewPageOptions{
                BaseURL = SharedTestContext.AppUrl
            });
            await page.GotoAsync("/sign-in");

            // Act
            var content = await page.TextContentAsync("body");
            await page.FillAsync("input:nth-of-type(1)", _testContext.ClerkLoginUser!);
            await page.ClickAsync("button.cl-formButtonPrimary");
            await page.ClickAsync("button.cl-alternativeMethodsBlockButton");
            await page.FillAsync("input[name='password']", _testContext.ClerkLoginPassword!);
            await page.ClickAsync("span.cl-internal-2iusy0");

            // Assert
            content.Should().Contain("Welcome");
        }
    }
}