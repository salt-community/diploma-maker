using DiplomaMaker.Web.Tests.Integration;
using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.E2E.actions
{
    [Collection("Tests DiplomaMaker.Web.Tests.E2E")]
    [TestCaseOrderer("DiplomaMaker.Web.Tests.E2E.CustomOrderer", "DiplomaMaker.Web.Tests.E2E")]
    public class GenerateDiplomasFlowTests : IAsyncLifetime
    {
        private readonly SharedTestContext _testContext;
        private IPage? _page;

        public GenerateDiplomasFlowTests(SharedTestContext testContext)
        {
            _testContext = testContext;
        }

        public async Task InitializeAsync()
        {
            _page = await _testContext.Browser!.NewPageAsync(new BrowserNewPageOptions
            {
                BaseURL = SharedTestContext.AppUrl,
                StorageStatePath = "loginState.json"
            });
        }

        public async Task DisposeAsync()
        {
            await _page!.CloseAsync();
        }

        [Fact]
        public async Task EnteredStudentName_ShouldAppearInTagList_AfterSubmission()
        {
            // Arrange
            await _page!.GotoAsync("/pdf-creator");
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
            await _page!.GotoAsync("/pdf-creator");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            await _page!.ClickAsync(".diploma-making-form__submit-button");

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