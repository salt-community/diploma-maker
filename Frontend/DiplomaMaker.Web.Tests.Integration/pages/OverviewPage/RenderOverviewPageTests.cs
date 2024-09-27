using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.OverviewPage
{
    [Collection("Tests DiplomaMaker.Web.Tests.Integration")]
    public class RenderOverviewPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderOverviewPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task OverviewPage_ShouldHaveMoreThanOneListModuleItem()
        {
            // Arrange
            await _page.GotoAsync("/overview");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var buttons = await _page.QuerySelectorAllAsync("button.list-module__item");

            // Assert
            buttons.Should().HaveCountGreaterThan(1);
        }
    }
}