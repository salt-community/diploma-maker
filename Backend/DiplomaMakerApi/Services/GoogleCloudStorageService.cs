using Google.Cloud.Storage.V1;
namespace DiplomaMakerApi.Services
{
    public class GoogleCloudStorageService
    {
        private readonly string _bucketName;
        private readonly DiplomaMakingContext _context;
        private readonly StorageClient _storageClient;

        public GoogleCloudStorageService(DiplomaMakingContext context, IConfiguration configuration)
        {
            _storageClient = StorageClient.Create();
            _context = context;
            _bucketName = configuration["GoogleCloud:BucketName"];
        }

        public async Task<string> SaveFile(IFormFile file, string templateName)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            if (!templateName.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
            {
                templateName += fileExtension;
            }

            using (var stream = file.OpenReadStream())
            {
                await _storageClient.UploadObjectAsync(_bucketName, templateName, file.ContentType, stream);
            }
            return templateName;
        }
    }
}
