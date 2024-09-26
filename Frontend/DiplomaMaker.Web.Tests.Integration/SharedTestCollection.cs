using Xunit;

namespace DiplomaMaker.Web.Tests.Integration
{
    [CollectionDefinition("Tests DiplomaMaker.Web")]
    public class SharedTestCollection : ICollectionFixture<SharedTestContext>
    {

    }
}