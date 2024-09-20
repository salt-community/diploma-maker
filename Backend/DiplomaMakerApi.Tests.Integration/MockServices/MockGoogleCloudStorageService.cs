using Microsoft.AspNetCore.Http;
using DiplomaMakerApi.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;

namespace DiplomaMakerApi.Tests.Integration
{
    public class MockGoogleCloudStorageService : GoogleCloudStorageService
    {
        public MockGoogleCloudStorageService(
            DiplomaMakingContext context, 
            IConfiguration configuration, 
            FileUtilityService fileUtilityService, 
            IWebHostEnvironment env
        ) : base(context, configuration, fileUtilityService, env)
        {
        }

        public override Task<string?> GetFilePath(string templateName, string subDirectory = "DiplomaPdfs")
        {
            return Task.FromResult<string?>(null);
        }

        public override Task<(byte[] FileBytes, string ContentType)> GetFileFromFilePath(string templateName, string subDirectory = "DiplomaPdfs")
        {
            return Task.FromResult((new byte[0], "application/pdf"));
        }

        public override Task<string> SaveFile(IFormFile file, string templateName, string subDirectory = "DiplomaPdfs")
        {
            return Task.FromResult("mock/path/to/savedfile.pdf");
        }

        public override Task<bool> DeleteFile(string templateName, string subDirectory = "DiplomaPdfs")
        {
            return Task.FromResult(true);
        }
    }
}
