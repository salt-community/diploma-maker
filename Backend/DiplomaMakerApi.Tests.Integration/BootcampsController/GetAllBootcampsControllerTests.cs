using System.Net.Http.Headers;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class GetAllBootcampsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public GetAllBootcampsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }
    }
}