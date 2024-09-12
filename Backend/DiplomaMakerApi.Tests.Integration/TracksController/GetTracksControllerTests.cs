using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TracksControllerTests
{
    public class GetTracksControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;

        public GetTracksControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
        }
    }
}