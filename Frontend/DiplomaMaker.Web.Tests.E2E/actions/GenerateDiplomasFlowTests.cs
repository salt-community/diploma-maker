using DiplomaMaker.Web.Tests.E2E.testUtil;
using DiplomaMaker.Web.Tests.Integration;
using FluentAssertions;
using Microsoft.Playwright;
using Xunit;

namespace DiplomaMaker.Web.Tests.E2E.actions
{
    [Collection("Tests DiplomaMaker.Web.Tests.E2E")]
    [TestCaseOrderer("DiplomaMaker.Web.Tests.E2E.testUtil.CustomOrderer", "DiplomaMaker.Web.Tests.E2E")]
    public class GenerateDiplomasFlowTests : IAsyncLifetime
    {
        private readonly SharedTestContext _testContext;
        private IPage? _page;
        private readonly string _currentDate = DateTime.UtcNow.ToString("yyyy-MM-dd");

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

        [Fact, TestPriority(1)]
        public async Task NewBootcamp_ShouldAppearInBootcampTable_AfterAddingBootcamp()
        {
            // Arrange
            await _page!.GotoAsync("/bootcamp-management");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            await _page.FillAsync("div.modal-main-footer input.date-input", _currentDate);
            await _page.SelectOptionAsync("div.modal-main-footer select.normal", "2");
            await _page.ClickAsync("div.modal-main-footer button.add-button--simple");

            bool isDateFound = false;
            int maxAttempts = 10;
            int attempts = 0;

            while (!isDateFound && attempts < maxAttempts)
            {
                var content = await _page.ContentAsync();
                if (content.Contains(_currentDate))
                {
                    isDateFound = true;
                }
                else
                {
                    await Task.Delay(1000);
                    attempts++;
                }
            }

            // Assert
            isDateFound.Should().BeTrue($"The date {_currentDate} should appear on the page.");           
        }

        [Fact, TestPriority(2)]
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

        [Fact, TestPriority(3)]
        public async Task GenerateDiplomas_ShouldOpenNewWindow_AfterGenerating()
        {
            // Arrange
            await _page!.GotoAsync("/pdf-creator");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            await _page.SelectOptionAsync("select[test-identifier='track-selector']", new[] { "1" });
            await _page.SelectOptionAsync("select[test-identifier='bootcamp-selector']", $"jfs-{_currentDate}");

            var inputBox = await _page.QuerySelectorAsync("input.taginputbox");
            await inputBox!.FillAsync("Bob Ryder");
            await inputBox.PressAsync("Enter");

            var content = await _page.ContentAsync();
            content.Should().Contain("Bob Ryder", "Bob Ryder should be in the nametaginput.");

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