using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.Integration.pages.ErrorPage
{
    [Collection("Tests DiplomaMaker.Web")]
    public class RenderErrorPageTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public RenderErrorPageTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task ErrorPage_ShouldRenderSuccessfully_WhenNavigating()
        {
            // Arrange
            await _page.GotoAsync($"/{Guid.NewGuid()}");

            // Act
            var content = await _page.TextContentAsync("body");

            // Assert
            content.Should().Contain("404");
        }
    }
}