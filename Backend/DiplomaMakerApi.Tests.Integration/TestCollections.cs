using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration
{
    [CollectionDefinition("CustomerApi nonFileWritingTestsCollection")]
    public class nonFileWritingTestsCollection : ICollectionFixture<WebApplicationFactory<IDiplomaApiMarker>>
    {
        
    }
}