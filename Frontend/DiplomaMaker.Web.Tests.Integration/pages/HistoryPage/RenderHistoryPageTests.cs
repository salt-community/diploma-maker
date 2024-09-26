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
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task HistoryPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            await _page.GotoAsync("/history");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var content = await _page.TextContentAsync("body");

            // Assert
            content.Should().Contain("Status");
        }
    }
}