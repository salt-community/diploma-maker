using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class TemplateService
{
    private readonly DiplomaMakingContext _context;


    public TemplateService(DiplomaMakingContext context)
    {
        _context = context;
    }

    public async Task<List<Template>> GetTemplates(){
        return await _context.Template
            .ToListAsync();
    }

    public async Task<Template> GetTemplate(int id)
    {
       throw new NotImplementedException();
    }

    public async Task<Template> PostTemplate(TemplateRequestDto templateRequest)
    {
        throw new NotImplementedException();
    }

    public async Task<Template> PutTemplate(int id, TemplateRequestDto templateRequest)
    {
        throw new NotImplementedException();
    }
    
    public async Task<Template> DeleteTemplate(int id)
    {
        throw new NotImplementedException();
    }
}