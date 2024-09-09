# Geen Gedoe | Google Ads AI

## Voorbereiding

### OpenAI API opzetten en gereed maken

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
   Maak in de hoofdmap van je project een nieuw bestand aan genaamd `.env`. Voeg hierin je OpenAI API-sleutel toe als volgt:

   ```bash
   OPENAI_API_KEY="<jouw_api_sleutel>"
   ```

Nu is het project succesvol vanuit GitHub naar je computer geïmporteerd en klaar voor gebruik.

### Eenvoudig data ophalen van alle campagnes

Om snel data van alle campagnes binnen een account op te halen, kun je mijn Google Ads script instellen. Volg hiervoor de onderstaande stappen.

1. **Kopieer het script**  
   Het benodigde script vind je in `script/script.js`. Kopieer de volledige code naar je klembord.

2. **Voeg het script toe aan Google Ads**  
   Ga naar Google Ads en navigeer naar **Tools** > **Bulkacties** > **Scripts**. Maak een nieuw script aan en plak de gekopieerde code erin.

Je Google Ads-omgeving is nu klaar om eenvoudig data op te halen.

## Gebruik
