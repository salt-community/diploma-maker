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
            
            // Bootcamps
            var dotnetBootcamp1 = new Bootcamp
            {
                Name = "Fullstack .Net Bootcamp Winter 2024",
                StartDate = new DateTime(2024,2,5),
                GraduationDate = new DateTime(2024,5,3)
            };
            var dotnetBootcamp2 = new Bootcamp
            {
                Name = "Fullstack .Net Bootcamp Autumn 2023",
                StartDate = new DateTime(2024,11,5),
                GraduationDate = new DateTime(2024,2,9),
            };
            var JavaBootcamp = new Bootcamp
            {
                Name = "Fullstack Java Bootcamp Winter 2024",
                StartDate = new DateTime(2024,1,5),
                GraduationDate = new DateTime(2024,4,5),
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