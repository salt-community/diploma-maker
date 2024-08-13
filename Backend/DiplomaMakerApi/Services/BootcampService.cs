using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Dtos.PreviewImage;

namespace DiplomaMakerApi.Services;

public class BootcampService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService, FileUtilityService fileUtilityService)
{
    private readonly DiplomaMakingContext _context = context;
    private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
    private readonly FileUtilityService _fileUtilityService = fileUtilityService;

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

    public async Task<Student> PutStudentPreviewImage(PreviewImageRequestDto previewImageRequestDto)
    {
        var student = await _context.Students.FirstOrDefaultAsync(t => t.GuidId == previewImageRequestDto.StudentGuidId);
        if(student == null)
        {
            throw new NotFoundByGuidException("Student", previewImageRequestDto.StudentGuidId);
        }
        var compressedFile = await _fileUtilityService.ConvertPngToWebP(previewImageRequestDto.Image, previewImageRequestDto.StudentGuidId.ToString());
        var fullFilePath = await _localFileStorageService.SaveFile(compressedFile, previewImageRequestDto.StudentGuidId.ToString(), "ImagePreview");
        var relativePath = await _fileUtilityService.GetRelativePathAsync(fullFilePath, "ImagePreview");

        student.PreviewImageUrl = relativePath;

        await _context.SaveChangesAsync();

        return student;
    }

}