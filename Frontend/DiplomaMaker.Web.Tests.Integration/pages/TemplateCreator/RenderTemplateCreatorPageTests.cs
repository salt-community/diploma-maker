using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.TemplateCreator
{
    [Collection("Tests DiplomaMaker.Web.Tests.Integration")]
    public class RenderTemplateCreatorPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderTemplateCreatorPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task TemplateCreatorPage_ShouldHavePdfPreviewDiv()
        {
            // Arrange
            await _page.GotoAsync("/template-creator");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            IElementHandle? pdfPreviewDiv = null;
            for (int i = 0; i < 12; i++)
            {
                pdfPreviewDiv = await _page.QuerySelectorAsync(".pdfpreview div div div div div div div div:nth-of-type(2)");
                if (pdfPreviewDiv != null)
                    break;
                await Task.Delay(1000);
            }

            // Assert
            pdfPreviewDiv.Should().NotBeNull();
        }
    }
}