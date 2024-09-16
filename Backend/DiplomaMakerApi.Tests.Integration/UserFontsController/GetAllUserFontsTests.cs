using Xunit;

namespace DiplomaMakerApi.Tests.Integration.UserFontsController
{
    public class GetAllUserFontsTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;

        public GetAllUserFontsTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _testBlobFolder = apiFactory.TestBlobFolder;
        }

        // [Fact]
        // public void GetUserFonts_ReturnsUserFonts_WhenUserFontExists()
        // {
        //     // Arrange

        //     // Act

        //     // Assert
        // }
    }
}