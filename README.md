# Geen Gedoe | Google Ads AI

## Voorbereiding

### Afhankelijkheden downloaden

Om deze Chrome extensie te downloaden moeten we eerst enkele (gratis) onderdelen downloaden.

- [Node.js](https://nodejs.org/en/download/package-manager)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code (optoneel maar aanbevolen)](https://nodejs.org/en/download/package-manager)

### Verbinding met OpenAI API maken

Om gebruik te maken van de API moeten we eerst jouw OpenAI API account gereed maken.

1. **Maak een OpenAI API account aan**
   Zorg ervoor dat je een OpenAI API-account hebt. Ga naar [OpenAI API](https://openai.com/index/openai-api/) en maak een account aan. Zodra je bent ingelogd, kom je op het OpenAI API-dashboard.

2. **Maak een API-sleutel aan**  
   In het dashboard ga je naar je profiel en klik je op "User API Keys". Maak hier een nieuwe API-sleutel aan, bijvoorbeeld met de naam "OpenAI API Key". Bewaar de gegenereerde API-sleutel (een lange tekstreeks) op een veilige plek.

3. **Waardeer je tegoed op**
   Via je profiel kun je ook naar "Billing" gaan om tegoed toe te voegen. Meestal is €5 tot €10 voldoende om te beginnen.

### Chrome-extensie lokaal installeren

Om de Chrome-extensie te gebruiken, moet je deze lokaal op je computer hebben. Volg de onderstaande stappen om het project vanuit GitHub te importeren.

1. **Maak een nieuwe map aan**  
   Kies een locatie die voor jou handig is en geef de map een duidelijke naam, bijvoorbeeld "Google Ads AI".

2. **Open de terminal**  
   Navigeer in de terminal naar de locatie van de aangemaakte map.

3. **Initialiseer een Git-repository**  
   Voer het volgende commando in om een nieuwe Git-omgeving te initialiseren:

   ```bash
   git init
   ```

4. **Koppel de GitHub-repository**  
   Verbind de map met de juiste GitHub-repository door het volgende commando uit te voeren:

   ```bash
   git remote add origin https://github.com/gijsvdbeuken/google-ads-ai.git
   ```

5. **Download het project**  
   Haal nu het project op van GitHub met het volgende commando:

   ```bash
   git pull origin main
   ```

6. **Voeg de OpenAI API-sleutel toe aan je project**  
   Maak in de hoofdmap van je project een nieuw bestand aan genaamd `.env`. Dit gaat makkelijker door de folder te openen met Visual Studio Code. Voeg hierin je OpenAI API-sleutel tussen de quotes toe als volgt:

   ```bash
   OPENAI_API_KEY="jouw_api_sleutel"
   ```

7. **Chrome-extensie toevoegen aan Chrome**  
   Ga naar **Chrome** > **Extensies beheren** en schakel "Ontwikkelaarsmodus" in. Klik daarna op "Uitgepakte extensie laden", navigeer naar het project, en importeer nu de "dist" folder.

Nu is het project succesvol vanuit GitHub naar je computer geïmporteerd en klaar voor gebruik.

### Google Ads script instellen

Om snel data van alle campagnes binnen een account op te halen, kun je mijn Google Ads script instellen. Volg hiervoor de onderstaande stappen.

1. **Kopieer het script**  
   Het benodigde script vind je in `script/script.js`. Kopieer de volledige code naar je klembord.

2. **Voeg het script toe aan Google Ads**  
   Ga naar Google Ads en navigeer naar **Tools** > **Bulkacties** > **Scripts**. Maak een nieuw script aan en plak de gekopieerde code erin.

Je Google Ads-omgeving is nu klaar om eenvoudig data op te halen.

## Gebruik

1. **Haal de data op**  
    Eerst haal je de data op via de Google Ads script. begin met het invoeren van de gewenste specificaties bovenaan in het script, en klik daarna op uitvoeren.

   ```javascript
   // Email van ontvanger
   var emailReceiver = "example@gmail.com";
   // Periode van data
   var startDate = new Date("2024-09-01"); // Formaat: JJJJ-MM-DD
   var endDate = new Date("2024-09-14"); // Formaat: JJJJ-MM-DD
   ```

   Na enkele minuten ontvang je de data in CSV formaat in de mail.

2. **Start de server**  
    Navigeer via de terminal naar de map waar je het project hebt opgeslagen. Executeer vervolgens het volgende commando.

   ```bash
   node server/server.js
   ```

   Als het goed is ontvang je de volgende melding in de terminal.

   ```bash
   Server is running on port 3001
   ```
