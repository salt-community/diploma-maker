using Xunit;

namespace DiplomaMaker.Web.Tests.Integration
{
    [CollectionDefinition("Tests DiplomaMaker.Web.Tests.Integration")]
    public class SharedTestCollection : ICollectionFixture<SharedTestContext>
    {

    }
}