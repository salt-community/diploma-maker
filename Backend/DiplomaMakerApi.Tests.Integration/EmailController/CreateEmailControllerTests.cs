using System.Net.Http.Headers;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.EmailController
{
    public class CreateEmailControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;

        public CreateEmailControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }
    }
}