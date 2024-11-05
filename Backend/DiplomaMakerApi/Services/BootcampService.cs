using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Dtos.Diploma;

namespace DiplomaMakerApi.Services;

public class BootcampService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService, GoogleCloudStorageService googleCloudStorageService, FileUtilityService fileUtilityService, IConfiguration configuration)
{
    private readonly DiplomaMakingContext _context = context;
    private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
    private readonly GoogleCloudStorageService _googleCloudStorageService = googleCloudStorageService;
    private readonly FileUtilityService _fileUtilityService = fileUtilityService;
    private readonly bool _useBlobStorage = bool.Parse(configuration["Blob:UseBlobStorage"]
        ?? throw new InvalidOperationException("Blob:UseBlobStorage configuration is missing"));

    public async Task<Bootcamp> PostBootcamp( BootcampRequestDto requestDto )
    {
        var template = await _context.DiplomaTemplates.FirstOrDefaultAsync(d => d.Name == "Default") ?? throw new Exception("Default template does not exist");
        var track = await _context.Tracks.FindAsync(requestDto.TrackId);
        if(track == null)
        {
            throw new NotFoundByIdException("Track", requestDto.TrackId);
        }            

        var bootcamp = new Bootcamp{
            DiplomaTemplate = template,
            GraduationDate = requestDto.GraduationDate,
            Track = track
        };

        _context.Bootcamps.Add(bootcamp);
        await _context.SaveChangesAsync();
        return bootcamp;
    }

    public async Task<List<Bootcamp>> GetBootcamps() =>
            await _context.Bootcamps
            .Include(b => b.Students)
            .Include(b => b.Track)
            .Include(b => b.DiplomaTemplate)
            .ToListAsync();

    public async Task<Bootcamp?> GetBootcampByGuidId(Guid guidId) =>
            await _context.Bootcamps
            .Include(b => b.Students)
            .Include(b => b.Track)
            .Include(b => b.DiplomaTemplate)
            .FirstOrDefaultAsync(b => b.GuidId == guidId);

    public async Task<Bootcamp> DeleteBootcampByGuidId(Guid guidId)
    {
        var bootcamp = await _context.Bootcamps.FirstOrDefaultAsync(b => b.GuidId == guidId);
        if (bootcamp == null)
        {
            throw new NotFoundByGuidException("Bootcamp", guidId);
        }
        _context.Remove(bootcamp);
        await _context.SaveChangesAsync();

        return bootcamp;
    }

    public async Task<int> UpdateBootcampTemplate(Guid guidId, int templateId)
    {
        var bootcamp = await _context.Bootcamps.FirstOrDefaultAsync(b => b.GuidId == guidId);
        if (bootcamp == null)
        {
            throw new NotFoundByGuidException("Bootcamp", guidId);
        }

        var newDiplomaTemplate = await _context.DiplomaTemplates.FirstOrDefaultAsync(dt => dt.Id == templateId);
        if (newDiplomaTemplate == null)
        {
            throw new NotFoundByIdException("Template", templateId);
        }

        bootcamp.DiplomaTemplate = newDiplomaTemplate;
        return await _context.SaveChangesAsync();
    }



    public async Task<Bootcamp> PutBootcampAsync(Guid GuidID, BootcampRequestDto requestDto)
    {

            var bootcamp = await _context.Bootcamps
                .Include(b => b.Students)
                .Include(b => b.Track)
                .Include(b => b.DiplomaTemplate)
                .FirstOrDefaultAsync(b => b.GuidId == GuidID) ?? throw new NotFoundByGuidException("Template", GuidID);

            var track = await _context.Tracks
                .FirstOrDefaultAsync(t => t.Id == requestDto.TrackId);

            if (track == null)
            {
                throw new NotFoundByIdException("Track", requestDto.TrackId);
            }

            bootcamp.GraduationDate = requestDto.GraduationDate;
            bootcamp.Track = track;

            await _context.SaveChangesAsync();
            return bootcamp;
    }

    public async Task<List<Student>> PutDiplomas(List<DiplomaPutRequestDto> diplomaPutRequests)
    {
        var studentsUpdated = new List<Student>();
        foreach(var diplomaPutRequest in diplomaPutRequests)
        {
            var studentResponse = await PutDiploma(diplomaPutRequest);
            studentsUpdated.Add(studentResponse);
        }

        return studentsUpdated;
    }

    public async Task<Student> PutDiploma(DiplomaPutRequestDto diplomaPutRequest)
    {
        if (!_fileUtilityService.IsValidBase64Pdf(diplomaPutRequest.ImageData))
        {
            throw new InvalidDataException("The provided image is not a valid Base64 PDF string.");
        }
        var student = await _context.Students.FirstOrDefaultAsync(t => t.GuidId == diplomaPutRequest.StudentGuidId);
        if(student == null)
        {
            throw new NotFoundByGuidException("Student", diplomaPutRequest.StudentGuidId);
        }
        var pdfImage = await _fileUtilityService.ConvertPdfToPng(diplomaPutRequest.ImageData, diplomaPutRequest.StudentGuidId.ToString());
        
        var HQFile = await _fileUtilityService.ConvertPngToWebP(pdfImage, diplomaPutRequest.StudentGuidId.ToString());
        var LQFile = await _fileUtilityService.ConvertPngToWebP(pdfImage, diplomaPutRequest.StudentGuidId.ToString(), true);

        var HQFilePath = await SaveFileAsync(HQFile, diplomaPutRequest.StudentGuidId.ToString(), "ImagePreview");
        var LQFilePath = await SaveFileAsync(LQFile, diplomaPutRequest.StudentGuidId.ToString(), "ImagePreviewLQIP");

        student.PreviewImageUrl = await _fileUtilityService.GetRelativePathAsync(HQFilePath, "ImagePreview");
        student.PreviewImageLQIPUrl = await _fileUtilityService.GetRelativePathAsync(LQFilePath, "ImagePreviewLQIP");

        await _context.SaveChangesAsync();

        return student;
    }

    private async Task<string> SaveFileAsync(IFormFile file, string studentGuidId, string folderName)
    {
        return !_useBlobStorage 
            ? await _localFileStorageService.SaveFile(file, studentGuidId, folderName) 
            : await _googleCloudStorageService.SaveFile(file, studentGuidId, folderName);
    }

}