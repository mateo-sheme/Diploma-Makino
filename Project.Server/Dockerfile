# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
WORKDIR /src

COPY ["Project.Server/Project.Server.csproj", "Project.Server/"]
COPY ["project.client/project.client.esproj", "project.client/"]
RUN dotnet restore "./Project.Server/Project.Server.csproj"
COPY . .
RUN npm install --prefix ./project.client
RUN npm run build --prefix ./project.client
RUN ls -al ./project.client/node_modules/bootswatch/dist/litera/
WORKDIR "/src/Project.Server"
RUN dotnet build "./Project.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=ReleaseWORKDIR /src/Project.Server
RUN dotnet publish "./Project.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Copy React build output to wwwroot
RUN mkdir -p /app/publish/wwwroot
COPY --from=build /src/project.client/dist/* /app/publish/wwwroot/

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Project.Server.dll"]