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

# Copy the published output from the build stage

COPY --from=build-env /app/out .

# Start the application
ENTRYPOINT ["dotnet", "DiplomaMakerApi.dll"]

# Expose the port the application runs on
EXPOSE 8080