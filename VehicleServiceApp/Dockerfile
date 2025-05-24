# Koristimo SDK za buildanje aplikacije
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["VehicleServiceApp/VehicleServiceApp.csproj", "VehicleServiceApp/"]
RUN dotnet restore "VehicleServiceApp/VehicleServiceApp.csproj"
COPY . .
WORKDIR "/src/VehicleServiceApp"
RUN dotnet build "VehicleServiceApp.csproj" -c Release -o /app/build

# Koristimo ASP.NET runtime za pokretanje aplikacije
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS publish
WORKDIR /app
COPY --from=build /app/build .
ENTRYPOINT ["dotnet", "VehicleServiceApp.dll"]
