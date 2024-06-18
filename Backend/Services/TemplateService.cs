using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class TemplateService
{
    private readonly DiplomaMakingContext _context;


    public TemplateService(DiplomaMakingContext context)
    {
        _context = context;
    }

    public async Task<List<Template>> GetDiplomas(){
        return await _context.Template
            .ToListAsync();
    }
}