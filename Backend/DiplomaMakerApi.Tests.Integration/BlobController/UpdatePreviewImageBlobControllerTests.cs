using System.Net.Http.Headers;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class UpdatePreviewImageBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public UpdatePreviewImageBlobControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }
    }
}