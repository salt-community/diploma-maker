
using Microsoft.EntityFrameworkCore;

namespace DiplomaMakerApi.Services
{
    public class DatabasePokeService : IHostedService, IDisposable
    {
        private Timer _timer = null!;
        private readonly IServiceProvider _serviceProvider;

        public DatabasePokeService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(PokeDatabase, null, TimeSpan.Zero, TimeSpan.FromHours(1));
            return Task.CompletedTask;
        }

        private void PokeDatabase(object? state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<DiplomaMakingContext>();

                try
                {
                    var connectionString = Environment.GetEnvironmentVariable("PostgreConnection");
                    if (string.IsNullOrEmpty(connectionString))
                    {
                        Console.WriteLine("Connection string not found.");
                        return;
                    }

                    context.Database.SetConnectionString(connectionString);

                    var result = context.Database.CanConnect();
                    Console.WriteLine(result ? "Database Poke Complete." : "Failed to connect and poke database.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while poking the database: {ex.Message}");
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}