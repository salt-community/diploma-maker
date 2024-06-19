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
        return await _context.Template.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Template> PostTemplate(TemplateRequestDto templateRequest)
    {
        var newTemplate = new Template()
        {
            templateName = templateRequest.templateName,
            footer = templateRequest.footer,
            intro = templateRequest.intro,
            studentName = templateRequest.studentName,
            basePdf = templateRequest.basePdf,
        };
        try{
            await _context.Template.AddAsync(newTemplate);
            await _context.SaveChangesAsync();
        }
        catch(Exception ex){
            throw new Exception(ex.ToString());
        }
        
        return newTemplate;
    }

    public async Task<Template> PutTemplate(int id, TemplateRequestDto templateRequest)
    {
        var template = await _context.Template.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found.");
        }

        template.templateName = templateRequest.templateName;
        template.footer = templateRequest.footer;
        template.intro = templateRequest.intro;
        template.studentName = templateRequest.studentName;
        template.basePdf = templateRequest.basePdf;

        try
        {
            _context.Template.Update(template);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.ToString());
        }

        return template;
    }

    public async Task<Template> DeleteTemplate(int id)
    {
        var template = await _context.Template.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null)
        {
            throw new KeyNotFoundException("Template not found.");
        }

        try
        {
            _context.Template.Remove(template);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.ToString());
        }

        return template;
    }
}