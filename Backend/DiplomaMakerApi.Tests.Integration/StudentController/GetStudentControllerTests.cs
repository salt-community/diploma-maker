using System.Net.Http.Headers;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.StudentController
{
    public class GetStudentControllerTests : IClassFixture<DiplomaMakerApiFactory>
    { 
        private readonly HttpClient _client;
        public GetStudentControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }
    }
}