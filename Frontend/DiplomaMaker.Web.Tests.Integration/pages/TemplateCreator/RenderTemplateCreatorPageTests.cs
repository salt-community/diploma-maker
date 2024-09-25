using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.TemplateCreator
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderTemplateCreatorPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderTemplateCreatorPageTests(SharedTestContext testContext)
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
        public async Task TemplateCreatorPage_ShouldHavePdfPreviewDiv()
        {
            // Arrange
            await _page.GotoAsync("/template-creator");

            // Act
            var pdfPreviewDiv = await _page.QuerySelectorAsync(".pdfpreview div div div div div div div div:nth-of-type(2)");

            // Assert
            pdfPreviewDiv.Should().NotBeNull();
        }
    }
}