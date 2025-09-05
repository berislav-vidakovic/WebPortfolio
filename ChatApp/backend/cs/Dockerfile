# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies first (faster builds)
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the source code
COPY . ./

# Build and publish
RUN dotnet publish -c Release -o out

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Let ASP.NET use the PORT that Render provides
ENV ASPNETCORE_URLS=http://+:$PORT
EXPOSE $PORT

# Start the application
ENTRYPOINT ["dotnet", "cs.dll"]
