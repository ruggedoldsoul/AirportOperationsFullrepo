FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["AirportOperations.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build "AirportOperations.csproj" -c Release -o /app/build
RUN dotnet publish "AirportOperations.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "AirportOperations.dll"] 