namespace DiplomaMakerApi.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using DiplomaMakerApi.Services;
    using DiplomaMakerApi.Models;
    using Microsoft.AspNetCore.Authorization;
    using System.Security.Claims;
    using Microsoft.Extensions.Configuration; // Ensure this namespace is included

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly ClerkService _clerkService;
        private readonly IConfiguration _configuration;

        public EmailController(EmailService emailService, ClerkService clerkService, IConfiguration configuration)
        {
            _emailService = emailService;
            _clerkService = clerkService;
            _configuration = configuration; 
        }

        [HttpPost("email-student/{guidID}")]
        public async Task<IActionResult> SendEmailToStudent(Guid guidID, SendEmailRequest req)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                {
                    throw new Exception("The user does not exist");
                }

                var googleToken = await _clerkService.GetGoogleOAuthTokenAsync(userId, _configuration["Clerk:SecretKey"]!);

                await _emailService.SendEmailWithAttachmentAsync(guidID, req.File, googleToken, req.Title, req.Description);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok("The Diploma has been successfully sent to your email");
        }
    }
}
