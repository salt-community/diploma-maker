using DiplomaMakerApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class HistorySnapshotService(DiplomaMakingContext context)
    {
        private readonly DiplomaMakingContext _context = context;

        public async Task createHistorySnapshotFromBootcamp(BootcampRequestUpdateDto requestDto) 
        {
            var templateUsed = await _context.DiplomaTemplates.FirstAsync(t => t.Id == requestDto.templateId);
            var bootcampUsed = await _context.Bootcamps.FirstOrDefaultAsync(b => 
                requestDto.students.All(s => b.Students.Any(bs => bs.GuidId == s.GuidId))
            );

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
                    BasePdf = templateUsed.BasePdf,
                    TemplateLastUpdated = templateUsed.LastUpdated,
                };
                _context.DiplomaGenerationLogs.Add(studentSnapshot);
                await _context.SaveChangesAsync();
            }
            
            
        }
    }
}