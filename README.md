# Vehicle Service Management Application

Ovaj projekt implementira aplikaciju za evidenciju servisa vozila, klijenata, vozila i servisnih zadataka. Sastoji se od .NET 8 Web API backenda i React TypeScript frontenda.

## Sadržaj

- [Karakteristike](#karakteristike)
- [Tehnologije](#tehnologije)
- [Preduvjeti](#preduvjeti)
- [Postavljanje i pokretanje projekta](#postavljanje-i-pokretanje-projekta)
  - [1. Backend konfiguracija](#1-backend-konfiguracija)
  - [2. Baza podataka (PostgreSQL)](#2-baza-podataka-postgresql)
  - [3. Frontend konfiguracija](#3-frontend-konfiguracija)
  - [4. Pokretanje aplikacija](#4-pokretanje-aplikacija)
- [API Endpoints](#api-endpoints)
- [Korištenje aplikacije](#korištenje-aplikacije)

## Karakteristike

-   **Autentifikacija i Autorizacija:** Korisnici se mogu registrirati i prijaviti.
-   **Upravljanje Klijentima:** Dodavanje, pregled, uređivanje i brisanje podataka o klijentima.
-   **Upravljanje Vozilima:** Dodavanje, pregled, uređivanje i brisanje podataka o vozilima (jedan klijent može imati više vozila).
-   **Upravljanje Servisnim Zadacima:** Dodavanje, pregled, uređivanje i brisanje pojedinih servisnih zadataka (npr. "Promjena ulja", "Provjera kočnica").
-   **Upravljanje Servisnim Zapisima:** Dodavanje, pregled, uređivanje i brisanje zapisa o obavljenim servisima (jedan servis može imati više servisnih zadataka, a jedan zadatak može biti u više servisa - Many-to-Many relacija).

## Tehnologije

### Backend (.NET 8)

-   **ASP.NET Core 8:** Web API
-   **Entity Framework Core:** ORM za rad s bazom podataka
-   **Npgsql:** PostgreSQL provider za EF Core
-   **ASP.NET Core Identity:** Za autentifikaciju i autorizaciju (JWT Bearer tokeni)
-   **FluentValidation:** Za validaciju ulaznih podataka
-   **Minimal APIs:** Za definiranje API endpointa (umjesto kontrolera)
-   **Swagger/OpenAPI:** Za dokumentaciju i testiranje API-ja

### Frontend (React)

-   **React 18+**
-   **TypeScript**
-   **Tailwind CSS:** Za stiliziranje
-   **Fluent UI:** Za UI komponente (v8 ili v9)
-   **React Query (TanStack Query):** Za dohvaćanje i upravljanje podacima s API-ja
-   **React Hook Form:** Za rad s formama
-   **React Router DOM:** Za navigaciju

## Preduvjeti

Prije pokretanja projekta, pobrinite se da imate instalirano sljedeće:

-   [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
-   [Node.js](https://nodejs.org/en/download/) (preporučuje se LTS verzija)
-   [npm](https://www.npmjs.com/get-npm) (obično dolazi s Node.js)
-   [PostgreSQL Database Server](https://www.postgresql.org/download/)
-   Code Editor (preporučuje se [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) za backend i [Visual Studio Code](https://code.visualstudio.com/) za frontend)
-   [Git](https://git-scm.com/downloads)

## Postavljanje i pokretanje projekta

Slijedite ove korake za postavljanje i pokretanje aplikacije:

### 1. Backend konfiguracija

1.  **Klonirajte repozitorij:**
    ```bash
    git clone [https://github.com/tvoje-korisnicko-ime/VehicleServiceApp.git](https://github.com/tvoje-korisnicko-ime/VehicleServiceApp.git)
    cd VehicleServiceApp
    ```
2.  **Navigirajte do backend foldera:**
    ```bash
    cd backend # ili kako ti se zove folder, npr. VehicleServiceApp.API
    ```
3.  **Postavite korisničke tajne (User Secrets):**
    Ovaj projekt koristi ASP.NET Core User Secrets za pohranu osjetljivih podataka kao što su Connection String baze podataka i JWT ključ. Ove tajne se **ne guraju na GitHub**.
    * Desni klik na `.NET` projekt u Visual Studiju -> `Manage User Secrets`.
    * U otvorenu `secrets.json` datoteku dodajte (ili modificirajte) sljedeće:
        ```json
        {
          "ConnectionStrings": {
            "DefaultConnection": "Host=localhost;Port=5432;Database=VehicleServiceDb;Username=your_postgres_username;Password=your_postgres_password"
          },
          "Jwt": {
            "Key": "YourSuperSecretJwtKeyThatIsAtLeast32BytesLongForHS256Encryption", // Zamijeni ovo s dugim, nasumičnim stringom
            "Issuer": "VehicleServiceApp",
            "Audience": "VehicleServiceAppUsers"
          }
        }
        ```
    * **Važno:** Zamijenite `your_postgres_username`, `your_postgres_password` i `YourSuperSecretJwtKey...` s vašim stvarnim podacima.
4.  **Izgradite projekt:**
    ```bash
    dotnet build
    ```

### 2. Baza podataka (PostgreSQL)

1.  **Instalirajte PostgreSQL:** Ako već nemate, instalirajte PostgreSQL server.
2.  **Kreirajte bazu podataka:** Otvorite `pgAdmin` ili koristite `psql` i kreirajte novu bazu podataka s imenom koje ste definirali u `secrets.json` (npr. `VehicleServiceDb`).
3.  **Primijenite Entity Framework Core migracije:**
    Navigirajte do backend foldera (ako niste već):
    ```bash
    cd backend
    ```
    Pokrenite migracije kako biste kreirali tablice u bazi podataka:
    ```bash
    dotnet ef database update
    ```
    Ovo će stvoriti sve potrebne tablice (`AspNetUsers`, `AspNetRoles`, `Clients`, `Vehicles`, `ServiceRecords`, `ServiceTasks`, `ServiceRecordServiceTask` (za many-to-many relaciju)).

### 3. Frontend konfiguracija

1.  **Navigirajte do frontend foldera:**
    ```bash
    cd ../frontend # (ili kako ti se zove frontend folder)
    ```
2.  **Instalirajte Node.js pakete:**
    ```bash
    npm install
    ```
3.  **Kreirajte `.env` datoteku (ako je potrebno):**
    Ako tvoja React aplikacija koristi okolinske varijable (npr. za URL API-ja), kreiraj datoteku pod nazivom `.env` u rootu frontend foldera i dodaj:
    ```
    REACT_APP_API_URL=http://localhost:5001
    ```
    (Zamijeni port ako je tvoj backend na drugom portu). Ovu datoteku `.env` dodaj u `.gitignore` ako već nisi.

### 4. Pokretanje aplikacija

1.  **Pokrenite Backend API:**
    Iz root direktorija backend projekta:
    ```bash
    dotnet run
    ```
    Ovo će pokrenuti backend na `http://localhost:5001` (ili sličnom portu). API dokumentacija (Swagger UI) bit će dostupna na `http://localhost:5001/swagger`.

2.  **Pokrenite Frontend aplikaciju:**
    Otvorite **novi terminal** i navigirajte do root direktorija frontend projekta:
    ```bash
    cd frontend
    npm start
    ```
    Ovo će pokrenuti React development server na `http://localhost:3000`. Aplikacija bi se trebala automatski otvoriti u vašem zadanom web pregledniku.

## API Endpoints

Možete istražiti sve dostupne API endpointe putem Swagger UI-ja na `http://localhost:5001/swagger` kada je backend pokrenut.

## Korištenje aplikacije

1.  Nakon pokretanja frontenda, bit ćete preusmjereni na stranicu za prijavu/registraciju (`/auth`).
2.  **Registrirajte se** kao novi korisnik.
3.  **Prijavite se** s novokreiranim podacima.
4.  Nakon prijave, moći ćete koristiti kartice na početnoj stranici za dodavanje i upravljanje klijentima, vozilima, servisnim zadacima i servisima.

---

### **Važne napomene:**

* **Autentifikacija/Autorizacija:** Objasni u uputama da je za pristup većini funkcionalnosti potrebna prijava.
* **Debugiranje:** Spomeni da mogu koristiti Visual Studio za debugiranje backenda i preglednikove DevTools za debugiranje frontenda.
* **Problemi s portovima:** Upozori ih ako koriste neki drugi softver koji možda zauzima portove 3000 ili 5001.

S ovim detaljnim uputama, svatko bi trebao moći klonirati, postaviti i pokrenuti tvoj projekt bez većih problema! Sretno!
