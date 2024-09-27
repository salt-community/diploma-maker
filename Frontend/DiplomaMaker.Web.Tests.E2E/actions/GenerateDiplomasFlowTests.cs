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
        private readonly string _studentName = "Bob Ryder";

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
            await inputBox!.FillAsync(_studentName);
            await inputBox.PressAsync("Enter");

            // Assert
            var content = await _page.ContentAsync();
            content.Should().Contain(_studentName, $"{_studentName} should be in the nametaginput.");
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
            await inputBox!.FillAsync(_studentName);
            await inputBox.PressAsync("Enter");

            var content = await _page.ContentAsync();
            content.Should().Contain(_studentName, $"{_studentName} should be in the nametaginput.");

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

        [Fact, TestPriority(4)]
        public async Task GeneratedStudent_ShouldExist_OnOverviewPage()
        {
            // Arrange
            await _page!.GotoAsync("/overview");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var buttonWithTestId = await _page.QuerySelectorAsync("button.list-module__item.visible[test-identifier='Bob Ryder']");

            // Assert
            buttonWithTestId.Should().NotBeNull("There should be a button with class 'list-module__item visible' and test-identifier 'Bob Ryder'.");
        }

        [Fact, TestPriority(5)]
        public async Task GeneratedStudent_ShouldExistInHistoryTable_OnHistoryPage()
        {
            // Arrange
            await _page!.GotoAsync("/history");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var rowToClick = await _page.QuerySelectorAsync("tr.historypage__table-row:first-child");
            await rowToClick!.ClickAsync();
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Assert
            var subtableRow = await _page.QuerySelectorAsync($"tr.historypage__subtable-row:has(td:text('Bob Ryder'))");
            subtableRow.Should().NotBeNull("Bob Ryder should be present in the subtable fields.");
        }

        [Fact, TestPriority(6)]
        public async Task GeneratedStudent_ShouldBeVerified_OnVerificationPage()
        {
            // Arrange
            await _page!.GotoAsync("/history");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Act
            var rowToClick = await _page.QuerySelectorAsync("tr.historypage__table-row:first-child");
            await rowToClick!.ClickAsync();
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            var subtableRow = await _page.QuerySelectorAsync("tbody.historypage__subtable-body > tr:has(td:text('Bob Ryder'))");
            subtableRow.Should().NotBeNull("Bob Ryder should be present in the subtable fields.");
            var verificationCodeElement = await subtableRow!.QuerySelectorAsync("td:nth-child(3)");
            var verificationCode = await verificationCodeElement!.InnerTextAsync();

            await _page.GotoAsync($"/verify/{verificationCode}");
            await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Assert
            var pageContent = await _page.ContentAsync();
            pageContent.Should().Contain("authentic", "The verification page should contain the word 'authentic'.");
        }
    }
}