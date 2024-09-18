using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class UpdateBootcampStudentsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public UpdateBootcampStudentsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
        }
    }
}