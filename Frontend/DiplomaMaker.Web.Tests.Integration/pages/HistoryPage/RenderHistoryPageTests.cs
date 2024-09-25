using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.HistoryPage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderHistoryPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderHistoryPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl
            }).GetAwaiter().GetResult();
            
            _page.GotoAsync("/sign-in").GetAwaiter().GetResult();
            _page.FillAsync("input:nth-of-type(1)", _testContext.ClerkLoginUser!).GetAwaiter().GetResult();
            _page.ClickAsync("button.cl-formButtonPrimary").GetAwaiter().GetResult();
            _page.ClickAsync("button.cl-alternativeMethodsBlockButton").GetAwaiter().GetResult();
            _page.FillAsync("input[name='password']", _testContext.ClerkLoginPassword!).GetAwaiter().GetResult();
            _page.ClickAsync("span.cl-internal-2iusy0").GetAwaiter().GetResult();
        }

        [Fact]
        public async Task HistoryPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            await _page.GotoAsync("/history");

            // Act
            var content = await _page.TextContentAsync("body");

            // Assert
            content.Should().Contain("Status");
        }
    }
}