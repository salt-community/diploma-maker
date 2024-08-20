using DiplomaMakerApi.Dtos.UserFont;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class UserFontService(DiplomaMakingContext context)
    {
        private readonly DiplomaMakingContext _context = context;
        public async Task<List<UserFont>> GetUserFonts(){
            return await _context.UserFonts
                .ToListAsync();
        }
    }
}