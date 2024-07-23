using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class LocalFileStorageService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "Blob/DiplomaPdfs");
        private readonly DiplomaMakingContext _context;

        public LocalFileStorageService(DiplomaMakingContext context)
        {
            if (!Directory.Exists(_storagePath))
            {
                Directory.CreateDirectory(_storagePath);
            }
            _context = context;
        }

        public async Task<string> SaveFile(IFormFile file, string templateName)
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

        //The templateName should be something like Default.v2.pdf
        public async Task<string> GetFilePath(string templateName)
        {
            var filePath = Path.Combine(_storagePath, templateName);
            if (File.Exists(filePath))
            {
                return filePath;
            }

            var templateNameNoExtension = Path.GetFileNameWithoutExtension(templateName);
            var templateExists = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Name == templateNameNoExtension);

            if(templateExists != null){
                await InitFileFromNewTemplate(Path.GetFileNameWithoutExtension(templateName));
                return Path.Combine(_storagePath, templateName);
            }
            return null;
        }

        public async Task<bool> DeleteFile(string templateName)
        {
            if(templateName == "Default"){
                throw new InvalidOperationException("The default template cannot be deleted.");
            }

            var filePath = Path.Combine(_storagePath, templateName + ".pdf");

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }
        // This Copies Default.pdf and renames it to new templateName.pdf
        public async Task InitFileFromNewTemplate(string templateName)
        {
            var sourceFilePath = Path.Combine(_storagePath, "Default.pdf");
            var destinationFilePath = Path.Combine(_storagePath, templateName + ".pdf");

            if (!File.Exists(sourceFilePath))
            {
                throw new FileNotFoundException("The default template file does not exist.");
            }

            File.Copy(sourceFilePath, destinationFilePath, overwrite: true);
        }

        public async Task<string> CreateBackup(string fileName)
        {
            var filePath = Path.Combine(_storagePath, fileName + ".pdf");
            
            int version = 1;
            string newFileName;
            string newFilePath;

            do
            {
                newFileName = $"{fileName}.v{version}.pdf";
                newFilePath = Path.Combine(_storagePath, newFileName);
                version++;
            } 
            while (File.Exists(newFilePath));

            File.Copy(filePath, newFilePath);

            var relativePath = Path.Combine("Blob/", newFileName);

            return relativePath;
        }
    }
}