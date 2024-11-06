using AutoMapper;
using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi.Data;
using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public class TemplateService
(
    DiplomaMakingContext _context,
    IStorageService _storageService,
    IMapper _mapper
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
        var styles = _context.TemplateStyles.ToList();
        var newTemplate = new DiplomaTemplate()
        {
            Name = templateRequest.TemplateName,
            FooterStyling = styles[0],
            IntroStyling = styles[1],
            MainStyling = styles[2],
            LinkStyling = styles[3]
        };

        await _storageService.InitFileFromNewTemplate(templateRequest.TemplateName, "DiplomaPdfs");

        await _context.DiplomaTemplates.AddAsync(newTemplate);
        await _context.SaveChangesAsync();
        return newTemplate;
    }

    public async Task<DiplomaTemplate?> PutTemplate(int id, TemplateRequestDto templateRequest)
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
        if (template == null) return null;

        template.Name = templateRequest.TemplateName;
        template.Footer = templateRequest.Footer;
        template.FooterStyling = _mapper.Map<TemplateStyle>(templateRequest.FooterStyling);
        template.Intro = templateRequest.Intro;
        template.IntroStyling = _mapper.Map<TemplateStyle>(templateRequest.IntroStyling);
        template.Main = templateRequest.Main;
        template.MainStyling = _mapper.Map<TemplateStyle>(templateRequest.MainStyling);
        template.Link = templateRequest.Link;
        template.LinkStyling = _mapper.Map<TemplateStyle>(templateRequest.LinkStyling);
        // template.BasePdf = templateRequest.basePdf;
        template.LastUpdated = DateTime.UtcNow;
        template.PdfBackgroundLastUpdated = templateRequest.PdfBackgroundLastUpdated;

        IFormFile file = ConvertBase64ToIFormFile(templateRequest.BasePdf, templateRequest.TemplateName);

        await _storageService.SaveFile(file, templateRequest.TemplateName);

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
        var base64Data = base64String.Contains(',') ? base64String.Split(',')[1] : base64String;

        byte[] byteArray = Convert.FromBase64String(base64Data);
        var stream = new MemoryStream(byteArray);
        return new FormFile(stream, 0, byteArray.Length, fileName, $"{fileName}.pdf")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/pdf"
        };
    }
}