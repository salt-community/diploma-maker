using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;
using AutoMapper;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {   
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(string[] emails, IFormFile file)
        {
           
           await _emailService.SendEmailWithAttachmentAsync("Zzer0ph@gmail.com", "Salt Diploma", file);
           
           return Ok("An email has been successfully sent to your email");
        }
    }
}
