using Xunit.Abstractions;
using Xunit.Sdk;

namespace DiplomaMaker.Web.Tests.E2E.testUtil
{
    public class CustomOrderer : ITestCaseOrderer
    {
        public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases) where TTestCase : ITestCase
        {
            var sortedMethods = testCases.OrderBy(tc =>
                tc.TestMethod.Method.GetCustomAttributes(typeof(TestPriorityAttribute))
                .FirstOrDefault()?.GetNamedArgument<int>("Priority") ?? 0);

            return sortedMethods;
        }
    }
}