using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi.Data;
using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public class TemplateService
(
    DiplomaMakingContext _context,
    IStorageService _storageService
)
{
    public async Task<List<DiplomaTemplate>> GetTemplates()
    {
        return await _context.DiplomaTemplates
            .Include(t => t.IntroStyling)
            .Include(t => t.MainStyling)
            .Include(t => t.FooterStyling)
            .Include(t => t.LinkStyling)
            .ToListAsync();
    }
    public async Task<DiplomaTemplate?> GetTemplate(int id) => await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
    public async Task<DiplomaTemplate> PostTemplate(TemplatePostRequestDto templateRequest)
    {
        var newTemplate = new DiplomaTemplate()
        {
            Name = templateRequest.templateName,
        };

        await _storageService.InitFileFromNewTemplate(templateRequest.templateName, "DiplomaPdfs");

        await _context.DiplomaTemplates.AddAsync(newTemplate);
        await _context.SaveChangesAsync();
        return newTemplate;
    }

    public async Task<DiplomaTemplate> PutTemplate(int id, TemplateRequestDto templateRequest)
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null)
        {
            throw new NotFoundByIdException("Template", id);
        }

        template.Name = templateRequest.templateName;
        template.Footer = templateRequest.footer;
        template.FooterStyling = templateRequest.footerStyling;
        template.Intro = templateRequest.intro;
        template.IntroStyling = templateRequest.introStyling;
        template.Main = templateRequest.main;
        template.MainStyling = templateRequest.mainStyling;
        template.Link = templateRequest.Link;
        template.LinkStyling = templateRequest.LinkStyling;
        // template.BasePdf = templateRequest.basePdf;
        template.LastUpdated = DateTime.UtcNow;
        template.PdfBackgroundLastUpdated = templateRequest.PdfBackgroundLastUpdated;

        IFormFile file = ConvertBase64ToIFormFile(templateRequest.basePdf, templateRequest.templateName);

        await _storageService.SaveFile(file, templateRequest.templateName);

        _context.DiplomaTemplates.Update(template);
        await _context.SaveChangesAsync();

        return template;
    }

    public async Task<DiplomaTemplate> DeleteTemplate(int id)
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null)
        {
            throw new NotFoundByIdException("Template", id);
        }

        await _storageService.DeleteFile(template.Name);

        _context.DiplomaTemplates.Remove(template);
        await _context.SaveChangesAsync();

        return template;
    }
    private static IFormFile ConvertBase64ToIFormFile(string base64String, string fileName)
    {
        var base64Data = base64String.Contains(",") ? base64String.Split(',')[1] : base64String;

        byte[] byteArray = Convert.FromBase64String(base64Data);
        var stream = new MemoryStream(byteArray);
        return new FormFile(stream, 0, byteArray.Length, fileName, $"{fileName}.pdf")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/pdf"
        };
    }
}