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
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base

# Install necessary dependencies
RUN apt update -y && apt full-upgrade -y && apt autoremove -y
RUN apt install -y --no-install-recommends \
    nginx nginx-extras apache2-utils \
    ca-certificates \
    libc6 \
    libgcc-s1 \
    libstdc++6 \
    tzdata \
    zlib1g \
    libfontconfig1 \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    libxcb1 \
    libxi6 \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic link for libdl.so
RUN ln -s /usr/lib/x86_64-linux-gnu/libdl.so.2 /usr/lib/x86_64-linux-gnu/libdl.so

# Set the working directory
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/out .

RUN mkdir -p /app/Blob/DiplomaPdfs
COPY Blob/DiplomaPdfs/Default.pdf /app/Blob/DiplomaPdfs/Default.pdf

# Start the application
ENTRYPOINT ["dotnet", "DiplomaMakerApi.dll"]