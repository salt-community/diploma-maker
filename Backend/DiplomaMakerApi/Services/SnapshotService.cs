using Microsoft.EntityFrameworkCore;
using AutoMapper;

using DiplomaMakerApi.Data;
using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public class SnapshotService
(
    DiplomaMakingContext _context,
    IStorageService _storageService,
    IMapper _mapper,
    FileUtilityService _fileUtilityService
)
{
    public async Task CreateSnapshotFromBootcamp(BootcampRequestUpdateDto requestDto, Bootcamp bootcampUsed)
    {
        var templateUsed = await _context.DiplomaTemplates
            .Include(d => d.IntroStyling)
            .Include(d => d.MainStyling)
            .Include(d => d.FooterStyling)
            .Include(d => d.LinkStyling)
            .FirstOrDefaultAsync(t => t.Id == requestDto.TemplateId);

        var lastSnapshots = await _context.DiplomaSnapshots
            .Where(d => d.BootcampGuidId == bootcampUsed.GuidId)
            .OrderByDescending(d => d.GeneratedAt)
            .ToListAsync();

        var lastSnapshot = lastSnapshots.FirstOrDefault();

        if (templateUsed == null)
            return;

        var templateBackgroundLocation = string.Empty;

        if (lastSnapshot == null)
        {
            templateBackgroundLocation = await GetFileLocation(templateUsed.Name + ".v1.pdf")
            ?? (await _storageService.CreateBackup(templateUsed.Name)).Replace("/DiplomaPdfs", "");
        }
        else if (templateUsed.PdfBackgroundLastUpdated != null && templateUsed.PdfBackgroundLastUpdated != lastSnapshot.BasePdfBackgroundLastUpdated)
        {
            templateBackgroundLocation = await _storageService.CreateBackup(templateUsed.Name);
        }
        else
        {
            templateBackgroundLocation = await GetFileLocation(lastSnapshot.BasePdf);
        }

        var timeUtcNow = DateTime.UtcNow;

        if (lastSnapshot != null)
        {
            foreach (var snapshot in lastSnapshots)
            {
                snapshot.Active = false;
                _context.DiplomaSnapshots.Update(snapshot);
            }

            await _context.SaveChangesAsync();
        }

        foreach (var student in requestDto.Students)
        {
            var studentSnapshot = _mapper.Map<DiplomaSnapshot>(student, opt =>
            {
                opt.Items["bootcampUsed"] = bootcampUsed;
                opt.Items["templateUsed"] = templateUsed;
                opt.Items["templateBackgroundLocation"] = "Blob/" + templateBackgroundLocation!.Replace('\\', '/');
                opt.Items["lastSnapshot"] = lastSnapshot;
                opt.Items["lastSnapshots"] = lastSnapshots;
                opt.Items["timeUtcNow"] = timeUtcNow;
            });

            studentSnapshot.GeneratedAt = timeUtcNow;
            studentSnapshot.Active = true;
            _context.DiplomaSnapshots.Add(studentSnapshot);

            await _context.SaveChangesAsync();
        }
    }

    private async Task<string?> GetFileLocation(string fileName)
    {
        var fileLocationResponse = await _storageService.GetFilePath(Path.GetFileName(fileName));

        if (fileLocationResponse != null)
            fileLocationResponse = await _fileUtilityService.GetRelativePathAsync(fileLocationResponse, "DiplomaPdfs");

        return fileLocationResponse;
    }

    public async Task<List<DiplomaSnapshot>> GetSnapshots()
    {
        return await _context.DiplomaSnapshots
            .Include(d => d.FooterStyling)
            .Include(d => d.IntroStyling)
            .Include(d => d.MainStyling)
            .Include(d => d.LinkStyling)
            .ToListAsync();
    }

    public async Task<List<DiplomaSnapshot>> GetSnapshotsByVerificationCode(string verificationCode)
    {
        var historySnapshots = await _context.DiplomaSnapshots
            .Where(d => d.VerificationCode == verificationCode)
            .Include(d => d.FooterStyling)
            .Include(d => d.IntroStyling)
            .Include(d => d.MainStyling)
            .Include(d => d.LinkStyling)
            .ToListAsync();

        if (historySnapshots.Count == 0)
            throw new NotFoundByIdException($"Student with verification code '{verificationCode}' not found.");

        return historySnapshots;
    }

    public async Task<List<DiplomaSnapshot>> MakeSnapshotActive(MakeActiveSnapshotRequestDto makeActiveSnapshotRequestDto)
    {
        var studentGuidIdsList = makeActiveSnapshotRequestDto.StudentGuidIds!.ToList();
        var idsList = makeActiveSnapshotRequestDto.Ids.ToList();

        var historySnapshots = await _context.DiplomaSnapshots
            .Where(h => h.Active && h.StudentGuidId.HasValue && studentGuidIdsList.Contains(h.StudentGuidId.Value))
            .ToListAsync();

        var makeActiveSnapShot = await _context.DiplomaSnapshots
            .Where(h => makeActiveSnapshotRequestDto.Ids.Contains(h.Id))
            .ToListAsync()
            ?? throw new NotFoundByIdException($"Snapshots not found.");

        foreach (var snapshot in historySnapshots)
        {
            snapshot.Active = false;
            _context.DiplomaSnapshots.Update(snapshot);
        }

        foreach (var snapshot in makeActiveSnapShot)
        {
            snapshot.Active = true;
            _context.DiplomaSnapshots.Update(snapshot);
        }

        await _context.SaveChangesAsync();

        return makeActiveSnapShot;
    }
}