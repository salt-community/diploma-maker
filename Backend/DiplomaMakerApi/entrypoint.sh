#!/bin/sh

# Read secrets from files and export them as environment variables
export Clerk__SecretKey=$(cat /run/secrets/clerk_secretkey)
export Clerk__AuthorizedParty=$(cat /run/secrets/clerk_authorizedparty)
export Clerk__Authority=$(cat /run/secrets/clerk_authority)

# Now, start the dotnet application
dotnet DiplomaMakerApi.dll