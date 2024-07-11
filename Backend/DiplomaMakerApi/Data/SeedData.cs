using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;

public static class SeedData 
{
    public static void Initialize (IServiceProvider serviceProvider)
    {
        using (var _context = new DiplomaMakingContext(serviceProvider.GetRequiredService<DbContextOptions<DiplomaMakingContext>>()))
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
            
            DiplomaTemplate diploma = new DiplomaTemplate { Name = "Default" };

            // Bootcamps
            var dotnetBootcamp1 = new Bootcamp
            {
                Name = ".Net Fullstack Winter 2024",
                GraduationDate = new DateTime(2024,2,5, 0, 0, 0, DateTimeKind.Utc),
                DiplomaTemplate = diploma 
            };
            var dotnetBootcamp2 = new Bootcamp
            {
                Name = ".Net Fullstack Autumn 2023",
                GraduationDate = new DateTime(2024,11,5, 0, 0, 0, DateTimeKind.Utc),
                DiplomaTemplate = diploma 
             
                
            };
            var JavaBootcamp = new Bootcamp
            {
                Name = "Java Fullstack Winter 2024",
                GraduationDate = new DateTime(2024,1,5, 0, 0, 0, DateTimeKind.Utc),
                DiplomaTemplate = diploma 
              
            };

            var bootcamps = new List<Bootcamp>{dotnetBootcamp1, dotnetBootcamp2, JavaBootcamp};
            _context.AddRange(bootcamps);
            _context.SaveChanges();

            // Diplomas
            var student1 = new Student 
            { 
                Name = "Xinnan Luo", 
                Email = "william.f.lindberg@hotmail.com",
                Bootcamp = dotnetBootcamp1 
            };
            var student2 = new Student 
            { 
                Name = "Zerophymyr Falk", 
                Email = "Zzer0ph@gmail.com",
                Bootcamp = dotnetBootcamp1 
            };
            var student3 = new Student 
            { 
                Name = "William F Lindberg", 
                Email = "lindberg.f.william@gmail.com",
                Bootcamp = dotnetBootcamp1 
            };
            var student4 = new Student 
            { 
                Name = "Silvia Dominguez", 
                Bootcamp = dotnetBootcamp2 
            };
            var students = new List<Student>{student1, student2, student3, student4};
            _context.AddRange(students);
            _context.SaveChanges();


 
        }
    }
}