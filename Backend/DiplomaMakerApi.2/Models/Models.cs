namespace DiplomaMakerApi._2.Models;

public record BaseEntity()
{
    public int Id { get; init; }
    public Guid Guid { get; init; } = Guid.NewGuid();
}

public record Bootcamp(
    List<Student> Students,
    Track Track
) : BaseEntity()
{
    public Bootcamp() : this([], Track.Default) { }
    public static readonly Bootcamp Default = new([], Track.Default);
};

public record Diploma(
    Student Student,
    Bootcamp Bootcamp,
    Template Template
) : BaseEntity()
{
    public Diploma() : this(Default) { }
    public static readonly Diploma Default = new(Student.Default, Bootcamp.Default, Template.Default);
}

public record StringFile(
    string FileType,
    string Content
) : BaseEntity()
{
    public StringFile() : this(Default) { }
    public static readonly StringFile Default = new(string.Empty, string.Empty);
}

public record Student(
    string Name,
    string Email
) : BaseEntity()
{
    public Student() : this(Default) { }
    public static readonly Student Default = new(string.Empty, string.Empty);
}

public record Template(
    Guid? BasePdfGuid
) : BaseEntity()
{
    public Template() : this(Default) { }
    public static readonly Template Default = new(Guid.NewGuid());
}

public record Track(
    string Name
) : BaseEntity()
{
    public Track() : this(Default) { }
    public static readonly Track Default = new(string.Empty);
};
