using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration
{
    // Using this collection on all tests that do not write/read pdf file from disk actually slows performance? I don't get it.
    [CollectionDefinition("CustomerApi nonPdfFileWritingTestsCollection")]
    public class nonPdfFileWritingTestsCollection : ICollectionFixture<WebApplicationFactory<IDiplomaApiMarker>>
    {
        
    }
}