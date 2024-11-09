namespace DiplomaMakerApi._2.Models;

public abstract class BaseEntity<T>()
{
    public virtual int Id { get; init; }
    public Guid Guid { get; init; } = Guid.NewGuid();

    public void Patch(T patch)
    {
        foreach (var property in typeof(T).GetProperties())
        {
            object? patchValue = property.GetValue(patch);
            property.SetValue(this, patchValue is not null
                ? patchValue
                : property.GetValue(this));
        }
    }
}