using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

public static class SeedData 
{
    public static void Initialize (IServiceProvider serviceProvider)
    {
        using (var _context = new DiplomaMakingContext(serviceProvider.GetRequiredService<DbContextOptions<DiplomaMakingContext>>()))
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
            
            // template 
            
            var baseTemplate = new Template {
                templateName = "defaultTemplate"
            };

            // Bootcamps
            var dotnetBootcamp1 = new Bootcamp
            {
                Name = ".Net Fullstack Winter 2024",
                graduationDate = new DateTime(2024,2,5),
                template = baseTemplate,
                
            };
            var dotnetBootcamp2 = new Bootcamp
            {
                Name = ".Net Fullstack Autumn 2023",
                graduationDate = new DateTime(2024,11,5),
                template = baseTemplate,
                
            };
            var JavaBootcamp = new Bootcamp
            {
                Name = "Java Fullstack Winter 2024",
                graduationDate = new DateTime(2024,1,5),
                template = baseTemplate,
            };

            var bootcamps = new List<Bootcamp>{dotnetBootcamp1, dotnetBootcamp2, JavaBootcamp};
            _context.AddRange(bootcamps);
            _context.SaveChanges();

            // Diplomas
            var diploma1 = new Diploma 
            { 
                StudentName = "Xinnan Luo", 
                Bootcamp = dotnetBootcamp1 
            };
            var diploma2 = new Diploma 
            { 
                StudentName = "Zerophymyr Falk", 
                Bootcamp = dotnetBootcamp1 
            };
            var diploma3 = new Diploma 
            { 
                StudentName = "William F Lindberg", 
                Bootcamp = dotnetBootcamp1 
            };
            var diploma4 = new Diploma 
            { 
                StudentName = "Silvia Dominguez", 
                Bootcamp = dotnetBootcamp2 
            };
            var diplomas = new List<Diploma>{diploma1, diploma2, diploma3, diploma4};
            _context.AddRange(diplomas);
            _context.SaveChanges();


 
        }
    }
}