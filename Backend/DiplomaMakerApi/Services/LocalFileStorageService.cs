namespace DiplomaMakerApi.Services
{
    public class LocalFileStorageService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/DiplomaPdfs");

        public LocalFileStorageService()
        {
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
        }

        public string SaveFile(IFormFile file, string templateName)
        {
            var fileExtension = Path.GetExtension(file.FileName);

            if (!templateName.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
            {
                templateName += fileExtension;
            }

            var filePath = Path.Combine(_storagePath, templateName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return filePath;
        }

        public string GetFilePath(string templateName)
        {
            var filePath = Path.Combine(_storagePath, templateName);
            if (File.Exists(filePath))
            {
                return filePath;
            }
            return null;
        }

        public bool DeleteFile(string templateName)
        {
            if(templateName == "Default"){
                throw new InvalidOperationException("The default template cannot be deleted.");
            }

            var filePath = Path.Combine(_storagePath, templateName);
            
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }
    }
}