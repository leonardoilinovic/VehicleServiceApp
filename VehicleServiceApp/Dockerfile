# Stage 1: Build the application
# Koristi .NET SDK image za buildanje aplikacije
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopiraj .csproj datoteku(e) za vraćanje paketa
# Ovo osigurava da se paketi keširaju ako se .csproj ne mijenja
COPY ["VehicleServiceApp.csproj", "./"]

# Pokreni restore paketa
RUN dotnet restore "VehicleServiceApp.csproj"

# ***** OVO JE NOVA LINIJA KOJU DODAJEMO *****
# Instaliraj dotnet-ef CLI alat globalno. Ovo je potrebno za primjenu migracija.
RUN dotnet tool install --global dotnet-ef --version 8.*

# Kopiraj sav preostali izvorni kod
COPY . .

# Pokreni publish aplikacije za produkciju
# -c Release: Build u Release konfiguraciji
# -o /app/publish: Output putanja za objavljene datoteke
RUN dotnet publish "VehicleServiceApp.csproj" -c Release -o /app/publish

# Stage 2: Create the final runtime image
# Koristi manji ASP.NET runtime image za konačnu aplikaciju
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Kopiraj objavljene datoteke iz "build" stage-a
COPY --from=build /app/publish .

# Definiraj ulaznu točku aplikacije kada se kontejner pokrene
# Ovo pokreće tvoju ASP.NET Core aplikaciju
ENTRYPOINT ["dotnet", "VehicleServiceApp.dll"]

# Expose port na kojem aplikacija sluša unutar kontejnera
EXPOSE 8080