namespace DiplomaMakerApi.Services
{
    public class LocalFileStorageService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/Pdfs");

        public LocalFileStorageService()
        {
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public string SaveFile(IFormFile file, string templateName)
        {
            var filePath = Path.Combine(_storagePath, templateName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return filePath;
        }
    }
}