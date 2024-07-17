using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class HistorySnapshotService(DiplomaMakingContext context, LocalFileStorageService localFileStorageService)
    {
        private readonly DiplomaMakingContext _context = context;
        private readonly LocalFileStorageService _localFileStorageService = localFileStorageService;

        public async Task createHistorySnapshotFromBootcamp(BootcampRequestUpdateDto requestDto, Bootcamp bootcampUsed) 
        {
            var templateUsed = await _context.DiplomaTemplates
                .Include(d => d.IntroStyling)
                .Include(d => d.MainStyling)
                .Include(d => d.FooterStyling)
                .Include(d => d.LinkStyling)
                .FirstOrDefaultAsync(t => t.Id == requestDto.templateId);

            if(templateUsed != null)
            {
                var templateBackgroundBackupLocation = await _localFileStorageService.createBackup(templateUsed.Name);
                foreach(var student in requestDto.students){
                    var studentSnapshot = new DiplomaGenerationLog(){
                        GeneratedAt = DateTime.UtcNow,
                        BootcampName = bootcampUsed.Name,
                        BootcampGraduationDate = bootcampUsed.GraduationDate,
                        StudentGuidId = student.GuidId,
                        StudentName = student.Name,
                        VerificationCode = student.VerificationCode,
                        TemplateName = templateUsed.Name,
                        Footer = templateUsed.Footer,
                        FooterStyling = templateUsed.FooterStyling,
                        Intro = templateUsed.Intro,
                        IntroStyling = templateUsed.IntroStyling,
                        Main = templateUsed.Main,
                        MainStyling = templateUsed.MainStyling,
                        Link = templateUsed.Link,
                        LinkStyling = templateUsed.LinkStyling,
                        BasePdf = templateBackgroundBackupLocation,
                        TemplateLastUpdated = templateUsed.LastUpdated,
                    };
                    _context.DiplomaGenerationLogs.Add(studentSnapshot);
                    await _context.SaveChangesAsync();
                }
            }
            
            
        }
    }
}