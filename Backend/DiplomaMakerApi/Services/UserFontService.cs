using DiplomaMakerApi.Dtos.UserFont;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class UserFontService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService, IConfiguration configuration, GoogleCloudStorageService googleCloudStorageService)
    {
        private readonly DiplomaMakingContext _context = context;
        private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
        private readonly GoogleCloudStorageService _googleCloudStorageService = googleCloudStorageService;
        private readonly bool _useBlobStorage = bool.Parse(configuration["Blob:UseBlobStorage"]);
        public async Task<List<UserFont>> GetUserFonts(){
            return await _context.UserFonts
                .ToListAsync();
        }

        public async Task<List<UserFont>> PostUserFonts(UserFontRequestsDto userFontRequestsDto)
        {   
            var firstFontRequest = userFontRequestsDto.UserFontRequests[0];
            var newFonts = new List<UserFont>();

            if(firstFontRequest.File is null){
                throw new ArgumentException("Normal Font Missing.");
            }

            foreach (var userFont in userFontRequestsDto.UserFontRequests)
            {
                if(userFont.File != null)
                {
                    await ((!_useBlobStorage)
                        ? _localFileStorageService.SaveFile(userFont.File, userFont.FileName, $"UserFonts/{userFont.Name}")
                        : _googleCloudStorageService.SaveFile(userFont.File, userFont.FileName, $"UserFonts/{userFont.Name}"));
                        
                    newFonts.Add(new UserFont(){
                        Name = userFont.Name,
                        FontType = userFont.FontType,
                    });
                }
            }

            await _context.UserFonts.AddRangeAsync(newFonts);
            await _context.SaveChangesAsync();

            return newFonts;
        }
    }
}