# Use the .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory
WORKDIR /app

# Copy the project file and restore dependencies
COPY DiplomaMakerApi.csproj .
RUN dotnet restore

# Copy the source code and build the application
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Set the working directory
WORKDIR /app

# Install libdl and create the symbolic link
RUN apt-get update && apt-get install -y libdl2 \
    && ln -s /usr/lib/x86_64-linux-gnu/libdl.so.2 /usr/lib/x86_64-linux-gnu/libdl.so \
    && rm -rf /var/lib/apt/lists/*

# Copy the published output from the build stage
COPY --from=build /app/out .

RUN mkdir -p /app/Blob/DiplomaPdfs
COPY Blob/DiplomaPdfs/Default.pdf /app/Blob/DiplomaPdfs/Default.pdf

# Start the application
ENTRYPOINT ["dotnet", "DiplomaMakerApi.dll"]
