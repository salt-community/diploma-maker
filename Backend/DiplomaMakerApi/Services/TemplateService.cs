using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services;

public class TemplateService
{
    private readonly DiplomaMakingContext _context;
    private readonly LocalFileStorageService _localFileStorageService;

    public TemplateService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService)
    {
        _context = context;
        _localFileStorageService = localFileStorageService;
    }

    public async Task<List<DiplomaTemplate>> GetTemplates(){
        return await _context.DiplomaTemplates
            .Include(t => t.IntroStyling)
            .Include(t => t.MainStyling)
            .Include(t => t.FooterStyling)
            .ToListAsync();
    }

    public async Task<DiplomaTemplate?> GetTemplate(int id)
    {
        return await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<DiplomaTemplate> PostTemplate(TemplateRequestDto templateRequest)
    {
        var newTemplate = new DiplomaTemplate()
        {
            Name = templateRequest.templateName,
            // footer = templateRequest.footer,
            // intro = templateRequest.intro,
            // studentName = templateRequest.studentName,
            // basePdf = templateRequest.basePdf,
        };
        try{
            await _context.DiplomaTemplates.AddAsync(newTemplate);
            await _context.SaveChangesAsync();
        }
        catch(Exception ex){
            throw new Exception(ex.ToString());
        }
        
        return newTemplate;
    }

    public async Task<DiplomaTemplate> PutTemplate(int id, TemplateRequestDto templateRequest)
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null)
        {
            throw new KeyNotFoundException("DiplomaTemplate not found.");
        }

        template.Name = templateRequest.templateName;
        template.Footer = templateRequest.footer;
        template.FooterStyling = templateRequest.footerStyling;
        template.Intro = templateRequest.intro;
        template.IntroStyling = templateRequest.introStyling;
        template.Main = templateRequest.main;
        template.MainStyling = templateRequest.mainStyling;
        // template.BasePdf = templateRequest.basePdf;

        try
        {
            _context.DiplomaTemplates.Update(template);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.ToString());
        }

        return template;
    }

    public async Task<DiplomaTemplate> DeleteTemplate(int id)
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null)
        {
            throw new KeyNotFoundException("DiplomaTemplate not found.");
        }

        try
        {
            _context.DiplomaTemplates.Remove(template);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(ex.ToString());
        }

        return template;
    }
}