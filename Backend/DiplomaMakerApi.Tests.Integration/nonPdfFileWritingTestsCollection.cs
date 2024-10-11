using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration
{
    [CollectionDefinition("CustomerApi nonPdfFileWritingTestsCollection")]
    public class nonPdfFileWritingTestsCollection : ICollectionFixture<WebApplicationFactory<IDiplomaApiMarker>>
    {
        
    }
}