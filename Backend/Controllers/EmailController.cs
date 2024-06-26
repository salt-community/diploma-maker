using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;
using AutoMapper;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {   
        private readonly EmailService _emailService;
        private readonly DiplomaMakingContext _context;

        public EmailController(EmailService emailService, DiplomaMakingContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail(IFormFile file, [FromForm] string email)
        {

            // check if email exists
           try
           {
                await _emailService.SendEmailWithAttachmentAsync(email, file);
           }
           catch(Exception ex)
           {
                return BadRequest("Something wrong with the provided file");
           }
           
           return Ok("The Diploma has been successfully sent to your email");
        }
    }
}
