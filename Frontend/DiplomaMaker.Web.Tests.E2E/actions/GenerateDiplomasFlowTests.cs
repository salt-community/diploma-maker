using DiplomaMaker.Web.Tests.Integration;
using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.E2E.actions
{
    [Collection("Tests DiplomaMaker.Web.Tests.E2E")]
    public class GenerateDiplomasFlowTests
    {
        private readonly SharedTestContext _testContext;
        private readonly IPage _page;

        public GenerateDiplomasFlowTests(SharedTestContext testContext)
        {
            _testContext = testContext;

            _page = _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            }).GetAwaiter().GetResult();
        }

        [Fact]
        public async Task EnteredStudentName_ShouldAppearInTagList_AfterSubmissio()
        {
            // Arrange
            await _page.GotoAsync("/pdf-creator");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var inputBox = await _page.QuerySelectorAsync("input.taginputbox");
            await inputBox!.FillAsync("Bob Ryder");
            await inputBox.PressAsync("Enter");

            // Assert
            var content = await _page.ContentAsync();
            content.Should().Contain("Bob Ryder", "Bob Ryder should be in the nametaginput.");
        }

        [Fact]
        public async Task GenerateDiplomas_ShouldOpenNewWindow_AfterGenerating()
        {
            // Arrange
            await _page.GotoAsync("/pdf-creator");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            await _page.ClickAsync(".diploma-making-form__submit-button");

            // Assert
            IBrowserContext browserContext = _page.Context;
            IPage? newPage = null;

            for (int i = 0; i < 10; i++)
            {
                var pages = browserContext.Pages;
                if (pages.Count > 1)
                {
                    newPage = pages.Last();
                    break;
                }

                await Task.Delay(1000);
            }

            newPage.Should().NotBeNull("New window should open after generating diplomas.");
        }
    }
}