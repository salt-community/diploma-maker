using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.BootcampManagementPage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderBootcampManagementPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderBootcampManagementPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task BootcampManagementPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            await _page.GotoAsync("/bootcamp-management");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var content = await _page.TextContentAsync("body");

            // Assert
            var inputValues = await _page.EvalOnSelectorAllAsync<string[]>("input", "elements => elements.map(e => e.value)");
            inputValues.Should().Contain(value => value.Contains("jfs"));
        }
    }
}