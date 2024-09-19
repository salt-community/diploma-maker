using System.Net.Http.Headers;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.HistorySnapshotsController
{
    public class UpdateHistorySnapshotsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public UpdateHistorySnapshotsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }
    }
}