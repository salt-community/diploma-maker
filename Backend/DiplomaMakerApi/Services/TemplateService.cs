using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services;

public class TemplateService
(
    DiplomaMakingContext context, 
    LocalFileStorageService localFileStorageService, 
    GoogleCloudStorageService googleCloudStorageService,
    IWebHostEnvironment env
)
{
    private readonly DiplomaMakingContext _context = context;
    private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
    private readonly GoogleCloudStorageService _googleCloudStorageService = googleCloudStorageService;
    private readonly IWebHostEnvironment _env = env;

    public async Task<List<DiplomaTemplate>> GetTemplates(){
        return await _context.DiplomaTemplates
            .Include(t => t.IntroStyling)
            .Include(t => t.MainStyling)
            .Include(t => t.FooterStyling)
            .Include(t => t.LinkStyling)
            .ToListAsync();
    }

    public async Task<DiplomaTemplate> GetTemplate(int id)
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(t => t.Id == id);
        return template ?? throw new NotFoundByIdException("Template", id);
    }

    public async Task<DiplomaTemplate> PostTemplate(TemplatePostRequestDto templateRequest)
    {
        var newTemplate = new DiplomaTemplate()
        {
            Name = templateRequest.templateName,
        };

        await (!_env.IsDevelopment()
            ? _localFileStorageService.InitFileFromNewTemplate(templateRequest.templateName)
            : _googleCloudStorageService.InitFileFromNewTemplate(templateRequest.templateName));

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

        await (!_env.IsDevelopment()
            ? _localFileStorageService.SaveFile(file, templateRequest.templateName)
            : _googleCloudStorageService.SaveFile(file, templateRequest.templateName));

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

        await (_env.IsDevelopment() 
            ? _localFileStorageService.DeleteFile(template.Name)
            : _googleCloudStorageService.DeleteFile(template.Name));

        _context.DiplomaTemplates.Remove(template);
        await _context.SaveChangesAsync();

        return template;
    }
    private IFormFile ConvertBase64ToIFormFile(string base64String, string fileName)
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