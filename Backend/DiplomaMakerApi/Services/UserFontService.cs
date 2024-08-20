using DiplomaMakerApi.Dtos.UserFont;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class UserFontService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService)
    {
        private readonly DiplomaMakingContext _context = context;
        private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
        public async Task<List<UserFont>> GetUserFonts(){
            return await _context.UserFonts
                .ToListAsync();
        }

        public async Task<List<UserFont>> PostUserFonts(UserFontRequestsDto userFontRequestsDto)
        {   
            var newFonts = new List<UserFont>();
            foreach (var userFont in userFontRequestsDto.UserFontRequests)
            {
                await _localFileStorageService.SaveFile(userFont.File, userFont.FileName, $"UserFonts/{userFont.Name}");
                newFonts.Add(new UserFont(){
                    Name = userFont.Name,
                    FontType = userFont.FontType,
                });
            }
            
            await _context.UserFonts.AddRangeAsync(newFonts);
            await _context.SaveChangesAsync();

            return newFonts;
        }
    }
}