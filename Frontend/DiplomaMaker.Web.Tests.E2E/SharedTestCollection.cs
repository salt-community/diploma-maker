using Xunit;

namespace DiplomaMaker.Web.Tests.Integration
{
    [CollectionDefinition("Tests DiplomaMaker.Web.Tests.E2E")]
    public class SharedTestCollection : ICollectionFixture<SharedTestContext>
    {

    }
}