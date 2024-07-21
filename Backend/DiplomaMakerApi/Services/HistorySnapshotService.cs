using DiplomaMakerApi.Exceptions;
using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class HistorySnapshotService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService)
    {
        private readonly DiplomaMakingContext _context = context;
        private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;

        public async Task CreateHistorySnapshotFromBootcamp(BootcampRequestUpdateDto requestDto, Bootcamp bootcampUsed) 
        {
            var templateUsed = await _context.DiplomaTemplates
                .Include(d => d.IntroStyling)
                .Include(d => d.MainStyling)
                .Include(d => d.FooterStyling)
                .Include(d => d.LinkStyling)
                .FirstOrDefaultAsync(t => t.Id == requestDto.templateId);

            var lastSnapshot = await _context.DiplomaSnapshots
                .Where(d => d.BootcampGuidId == bootcampUsed.GuidId)
                .OrderByDescending(d => d.GeneratedAt)
                .FirstOrDefaultAsync();

            if(templateUsed != null)
            {
                var templateBackgroundBackupLocation = string.Empty;
                
                if(
                    lastSnapshot == null || 
                    (templateUsed.PdfBackgroundLastUpdated != null && templateUsed.PdfBackgroundLastUpdated != lastSnapshot.BasePdfBackgroundLastUpdated)
                )
                {
                    templateBackgroundBackupLocation = await _localFileStorageService.createBackup(templateUsed.Name);
                }
                else{
                    var fileLocationResponse = await _localFileStorageService.GetFilePath(Path.GetFileName(lastSnapshot.BasePdf));
                    // Temporary Fix -> when generating again it gives the absolute path for some strange reason. I can't fix it yet.
                    fileLocationResponse = "Blob/" + Path.GetFileName(fileLocationResponse);
                    templateBackgroundBackupLocation = fileLocationResponse;
                }

                var timeUtcNow = DateTime.UtcNow;
                
                foreach(var student in requestDto.students){
                    var studentSnapshot = new DiplomaSnapshot()
                    {
                        GeneratedAt = timeUtcNow,
                        BootcampName = bootcampUsed.Name,
                        BootcampGuidId = bootcampUsed.GuidId,
                        BootcampGraduationDate = bootcampUsed.GraduationDate,
                        StudentGuidId = student.GuidId,
                        StudentName = student.Name,
                        VerificationCode = student.VerificationCode,
                        TemplateName = templateUsed?.Name,
                        Intro = templateUsed?.Intro,
                        IntroStyling = templateUsed?.IntroStyling == null ? null : new TemplateStyle()
                        {
                            XPos = templateUsed.IntroStyling.XPos ?? null,
                            YPos = templateUsed.IntroStyling.YPos ?? null,
                            Width = templateUsed.IntroStyling.Width ?? null,
                            Height = templateUsed.IntroStyling.Height ?? null,
                            FontSize = templateUsed.IntroStyling.FontSize ?? null,
                            FontColor = templateUsed.IntroStyling.FontColor ?? null,
                            FontName = templateUsed.IntroStyling.FontName ?? null,
                            Alignment = templateUsed.IntroStyling.Alignment ?? null,
                        },
                        Main = templateUsed?.Main,
                        MainStyling = templateUsed?.MainStyling == null ? null : new TemplateStyle()
                        {
                            XPos = templateUsed.MainStyling.XPos ?? null,
                            YPos = templateUsed.MainStyling.YPos ?? null,
                            Width = templateUsed.MainStyling.Width ?? null,
                            Height = templateUsed.MainStyling.Height ?? null,
                            FontSize = templateUsed.MainStyling.FontSize ?? null,
                            FontColor = templateUsed.MainStyling.FontColor ?? null,
                            FontName = templateUsed.MainStyling.FontName ?? null,
                            Alignment = templateUsed.MainStyling.Alignment ?? null,
                        },
                        Footer = templateUsed?.Footer,
                        FooterStyling = templateUsed?.FooterStyling == null ? null : new TemplateStyle()
                        {
                            XPos = templateUsed.FooterStyling.XPos ?? null,
                            YPos = templateUsed.FooterStyling.YPos ?? null,
                            Width = templateUsed.FooterStyling.Width ?? null,
                            Height = templateUsed.FooterStyling.Height ?? null,
                            FontSize = templateUsed.FooterStyling.FontSize ?? null,
                            FontColor = templateUsed.FooterStyling.FontColor ?? null,
                            FontName = templateUsed.FooterStyling.FontName ?? null,
                            Alignment = templateUsed.FooterStyling.Alignment ?? null,
                        },
                        Link = templateUsed?.Link,
                        LinkStyling = templateUsed?.LinkStyling == null ? null : new TemplateStyle()
                        {
                            XPos = templateUsed.LinkStyling.XPos ?? null,
                            YPos = templateUsed.LinkStyling.YPos ?? null,
                            Width = templateUsed.LinkStyling.Width ?? null,
                            Height = templateUsed.LinkStyling.Height ?? null,
                            FontSize = templateUsed.LinkStyling.FontSize ?? null,
                            FontColor = templateUsed.LinkStyling.FontColor ?? null,
                            FontName = templateUsed.LinkStyling.FontName ?? null,
                            Alignment = templateUsed.LinkStyling.Alignment ?? null,
                        },
                        BasePdf = templateBackgroundBackupLocation,
                        TemplateLastUpdated = templateUsed?.LastUpdated ?? default(DateTime),
                        BasePdfBackgroundLastUpdated = templateUsed?.PdfBackgroundLastUpdated ?? default(DateTime),
                        Active = lastSnapshot == null
                    };
                    _context.DiplomaSnapshots.Add(studentSnapshot);
                    await _context.SaveChangesAsync();
                }
            }
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
    }
}