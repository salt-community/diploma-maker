using Xunit;

namespace DiplomaMakerApi.Tests.Integration.UserFontsController
{
    public class CreateUserFontsTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;

        public CreateUserFontsTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _testBlobFolder = apiFactory.TestBlobFolder;
        }
    }
}