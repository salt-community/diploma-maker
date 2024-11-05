using DiplomaMakerApi.Data;
using Microsoft.EntityFrameworkCore;

public class DatabasePokeService(IServiceProvider _serviceProvider, string _dbConnectionString) : IHostedService, IDisposable
{
    private Timer? _timer;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(PokeDatabase, null, TimeSpan.Zero, TimeSpan.FromHours(1));
        return Task.CompletedTask;
    }
    private async void PokeDatabase(object? state)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DiplomaMakingContext>();

        try
        {
            if (string.IsNullOrEmpty(_dbConnectionString))
            {
                Console.WriteLine("Connection string not found.");
                return;
            }

            context.Database.SetConnectionString(_dbConnectionString);

            var connectionOk = context.Database.CanConnect();
            if (connectionOk)
            {
                var records = await context.Tracks.ToListAsync();
                Console.WriteLine(records != null ? "Database Poke Complete." : "Failed to connect and poke database.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while poking the database: {ex.Message}");
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
