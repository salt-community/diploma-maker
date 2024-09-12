using System.Net.Http.Headers;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TemplatesController
{
    public class UpdateTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;

        public UpdateTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");
        }
    }
}