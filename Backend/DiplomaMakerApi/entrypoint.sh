#!/bin/bash
# entrypoint.sh

# List the files in the app directory
ls -R /app

# Start the application
exec dotnet DiplomaMakerApi.dll