namespace Backend.Services;
using MimeKit;
using MailKit.Net.Smtp;

public class EmailService
{
    public void SendEmailWithAttachment(string recieverEmail, string subject, string htmlMessage)
    {
    
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Your Name", "Zzer0ph@gmail.com" ));
        message.To.Add(new MailboxAddress("Recipient Name", recieverEmail));
        message.Subject = subject;
        message.Body = new TextPart(MimeKit.Text.TextFormat.Html){Text = htmlMessage};


        using (var client = new SmtpClient())
        {
            try
            {
                client.Connect("smpt.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate("Zzer0ph@gmail.com", "Zerophymyr1");
                client.Send(message);
                client.Disconnect(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while sending email: " + ex.Message);
            }
        }
    }
}
