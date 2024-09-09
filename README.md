# Geen Gedoe | Google Ads AI

## Voorbereiding

### Benodigde Software Installeren

Om deze Chrome-extensie te gebruiken, dien je eerst enkele (gratis) tools te installeren:

- [Node.js](https://nodejs.org/en/download/package-manager)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code (optioneel maar aanbevolen)](https://code.visualstudio.com/download)

### Verbinden met OpenAI API

Volg deze stappen om verbinding te maken met de OpenAI API:

1. **OpenAI API-account aanmaken**  
   Ga naar [OpenAI API](https://openai.com/index/openai-api/) en registreer een account.

2. **API-sleutel genereren**  
   In je dashboard, ga naar "User API Keys" en maak een nieuwe API-sleutel aan. Sla deze sleutel veilig op.

3. **Tegoed toevoegen**  
   Voeg in de "Billing"-sectie van je profiel tegoed toe (meestal volstaat €5 - €10).

### Chrome-extensie Installeren

Om de extensie lokaal te gebruiken, volg je deze stappen:

1. **Map aanmaken**  
   Creëer een nieuwe map, bijvoorbeeld "Google Ads AI".

2. **Terminal openen**  
   Ga in de terminal naar je nieuw aangemaakte map.

3. **Git-repository initialiseren**  
   Voer het volgende commando uit:

   ```bash
   git init
   ```

4. **Koppel de GitHub-repository**

   ```bash
   git remote add origin https://github.com/gijsvdbeuken/google-ads-ai.git
   ```

5. **Project downloaden**

   ```bash
   git pull origin main
   ```

6. **OpenAI API-sleutel toevoegen**  
   Maak in de hoofdmap een `.env`-bestand aan en voeg je OpenAI-sleutel toe:

   ```bash
   OPENAI_API_KEY="jouw_api_sleutel"
   ```

7. **Extensie in Chrome laden**  
   Ga naar **Chrome** > **Extensies beheren**, schakel "Ontwikkelaarsmodus" in, klik op "Uitgepakte extensie laden" en selecteer de "dist"-map.

### Google Ads Script Configureren

1. **Kopieer het script**  
   Kopieer de code uit `script/script.js`.

2. **Voeg script toe aan Google Ads**  
   In Google Ads, ga naar **Tools** > **Bulkacties** > **Scripts** en plak de code.

## Gebruik

1. **Data ophalen**  
   Pas de specificaties aan in het Google Ads script, voer het uit en ontvang de data per e-mail.

   ```javascript
   var emailReceiver = "example@gmail.com";
   var startDate = new Date("2024-09-01");
   var endDate = new Date("2024-09-14");
   ```

2. **Server starten**  
   In de terminal, voer dit commando uit:

   ```bash
   node server/server.js
   ```

3. **Chrome-extensie gebruiken**  
   Open de extensie, voer de bedrijfsnaam en CSV-data in, klik op "Analyze uitvoeren" en ontvang een rapport na 15-60 seconden.
