using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.OverviewPage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderOverviewPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderOverviewPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new Microsoft.Playwright.BrowserNewPageOptions
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
        public async Task OverviewPage_ShouldHaveMoreThanOneListModuleItem()
        {
            // Arrange
            await _page.GotoAsync("/overview");

            // Act
            var buttons = await _page.QuerySelectorAllAsync("button.list-module__item");

            // Assert
            buttons.Should().HaveCountGreaterThan(1);
        }
    }
}