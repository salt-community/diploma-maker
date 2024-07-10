namespace DiplomaMakerApi.Services
{
    public class FileStorageService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/Pdfs");

        public FileStorageService()
        {
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public string SaveFile(IFormFile file, string templateName)
        {
            var filePath = Path.Combine(_storagePath, $"{templateName}");
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return filePath;
        }
    }
}