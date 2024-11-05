using AutoMapper;
using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class HistorySnapshotService
    (
        DiplomaMakingContext context,
        LocalFileStorageService localFileStorageService,
        GoogleCloudStorageService googleCloudStorageService,
        IMapper mapper,
        IWebHostEnvironment env,
        IConfiguration configuration,
        FileUtilityService fileUtilityService
    )
    {
        private readonly DiplomaMakingContext _context = context;
        private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;
        private readonly GoogleCloudStorageService _googleCloudStorageService = googleCloudStorageService;
        private readonly IMapper _mapper = mapper;
        private readonly IWebHostEnvironment _env = env;
        private readonly bool _useBlobStorage = bool.Parse(configuration["Blob:UseBlobStorage"]
            ?? throw new InvalidOperationException("Blob:UseBlobStorage configuration is missing"));

        private readonly FileUtilityService _fileUtilityService = fileUtilityService;

        public async Task CreateHistorySnapshotFromBootcamp(BootcampRequestUpdateDto requestDto, Bootcamp bootcampUsed)
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

            if (templateUsed != null)
            {
                var templateBackgroundLocation = string.Empty;

                if (lastSnapshot == null)
                {
                    templateBackgroundLocation = await GetFileLocation(templateUsed.Name + ".v1.pdf")
                    ?? ((!_useBlobStorage)
                        ? await _localFileStorageService.CreateBackup(templateUsed.Name)
                        : await _googleCloudStorageService.CreateBackup(templateUsed.Name)).Replace("/DiplomaPdfs", "");
                }
                else if (templateUsed.PdfBackgroundLastUpdated != null && templateUsed.PdfBackgroundLastUpdated != lastSnapshot.BasePdfBackgroundLastUpdated)
                {
                    templateBackgroundLocation = (!_useBlobStorage)
                        ? await _localFileStorageService.CreateBackup(templateUsed.Name)
                        : await _googleCloudStorageService.CreateBackup(templateUsed.Name);
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
        }

        private async Task<string?> GetFileLocation(string fileName)
        {
            var fileLocationResponse = (!_useBlobStorage)
                ? await _localFileStorageService.GetFilePath(Path.GetFileName(fileName))
                : await _googleCloudStorageService.GetFilePath(Path.GetFileName(fileName));

            if (fileLocationResponse != null)
            {
                fileLocationResponse = await _fileUtilityService.GetRelativePathAsync(fileLocationResponse, "DiplomaPdfs");
            }

            return fileLocationResponse;
        }

        public async Task<List<DiplomaSnapshot>> GetHistorySnapshots()
        {
            return await _context.DiplomaSnapshots
                .Include(d => d.FooterStyling)
                .Include(d => d.IntroStyling)
                .Include(d => d.MainStyling)
                .Include(d => d.LinkStyling)
                .ToListAsync();
        }

        public async Task<List<DiplomaSnapshot>> GetHistorySnapshotsByVerificationCode(string verificationCode)
        {
            var historySnapshots = await _context.DiplomaSnapshots
                .Where(d => d.VerificationCode == verificationCode)
                .Include(d => d.FooterStyling)
                .Include(d => d.IntroStyling)
                .Include(d => d.MainStyling)
                .Include(d => d.LinkStyling)
                .ToListAsync();

            if (!historySnapshots.Any())
            {
                throw new NotFoundByIdException($"Student with verification code '{verificationCode}' not found.");
            }

            return historySnapshots;
        }

        public async Task<List<DiplomaSnapshot>> MakeActiveHistorySnapshot(MakeActiveSnapshotRequestDto makeActiveSnapshotRequestDto)
        {

            var studentGuidIdsList = makeActiveSnapshotRequestDto.StudentGuidIds!.ToList();
            var idsList = makeActiveSnapshotRequestDto.Ids.ToList();

            var historySnapshots = await _context.DiplomaSnapshots
                .Where(h => h.Active && h.StudentGuidId.HasValue && studentGuidIdsList.Contains(h.StudentGuidId.Value))
                .ToListAsync();

            var makeActiveSnapShot = await _context.DiplomaSnapshots
                .Where(h => makeActiveSnapshotRequestDto.Ids.Contains(h.Id))
                .ToListAsync();

            if (makeActiveSnapShot == null)
            {
                throw new NotFoundByIdException($"Snapshots not found.");
            }

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
}