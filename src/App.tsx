import { useState, useEffect } from "react";
import { rapportGenerator } from "./utilities/RapportGenerator";
import logo from "/logo.png";
import "./App.css";
SVGAnimateTransformElement;

function App() {
  // analyzeLevel moet weer toegevoegd worden
  // userAdditions moeten weer toegevoegd worden

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [currentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dataBatch, setDataBatch] = useState<File[]>([]);
  const [parameterLanguage, setParameterLanguage] = useState<string>("");
  const [parameterTone, setParameterTone] = useState<string>("");

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [response, setResponse] = useState("");

  // prompt summary
  const promptSummary: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `Schrijf een korte samenvatting op basis van de volgende data. Dit is Google Ads data van alle campagnes van het bedrijf ${companyName}. Schijf eerst op één regel enkel de cijfers als concrete waarders, en schrijf daaronder een korte alinea ter samenvatting van bovenstaande cijfers. Schrijf geen titel boven de tekst, en vermijd markdown syntax.`;

  // prompts paragraphs
  const promptAge: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `schrijf een hele korte alinea van ~3 zinnen over leeftijden op basis van de volgende data over de "1 - GG - Marketing bureau locatie" campagne als totale opgetelde cijfers, dus niet van dag tot dag. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Schrijf geen titel boven de tekst, en vermijd markdown syntax. Overigens hoef je de campagnenaam zelf niet aan te duiden in de alinea. Ben je ervan bewust dat deze alle data per individuele dag is ingedeeld. Wanneer je totaal-cijfers opnoemd over CTR, kosten, etc. moet je dus eerst alle dagen bij elkaar optellen.`;
  const promptGender: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `schrijf een hele korte alinea van ~3 zinnen over gender op basis van de volgende data over de "1 - GG - Marketing bureau locatie" campagne als totale opgetelde cijfers, dus niet van dag tot dag. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Schrijf geen titel boven de tekst, en vermijd markdown syntax. Overigens hoef je de campagnenaam zelf niet aan te duiden in de alinea. Ben je ervan bewust dat alle data per individuele dag is ingedeeld. Wanneer je totaal-cijfers opnoemd over CTR, kosten, etc. moet je dus eerst alle dagen bij elkaar optellen.`;
  const promptDevice: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `schrijf een hele korte alinea van ~3 zinnen over apparaten op basis van de volgende data over de "1 - GG - Marketing bureau locatie" campagne als totale opgetelde cijfers, dus niet van dag tot dag. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Schrijf geen titel boven de tekst, en vermijd markdown syntax. Overigens hoef je de campagnenaam zelf niet aan te duiden in de alinea. Ben je ervan bewust dat alle data per individuele dag is ingedeeld. Wanneer je totaal-cijfers opnoemd over CTR, kosten, etc. moet je dus eerst alle dagen bij elkaar optellen.`;
  const promptDayAndTime: string =
    `${parameterLanguage}` +
    `${parameterTone}` +
    `schrijf een hele korte alinea van ~3 zinnen over de weekdagen op basis van de volgende data over de "1 - GG - Marketing bureau locatie" campagne als totale opgetelde cijfers, dus niet van dag tot dag. Je verteld voornamelijk over de conversie-cijfers indien je hier data van hebt, wanneer dit niet het geval is vertel je voornamelijk over de CTR cijfers. Geef tot slot advies m.b.t. procentuele bodaanpassing aan het eind van de alinea. Schrijf geen titel boven de tekst, en vermijd markdown syntax. Overigens hoef je de campagnenaam zelf niet aan te duiden in de alinea. Ben je ervan bewust dat deze alle data per individuele dag is ingedeeld. Wanneer je totaal-cijfers opnoemd over CTR, kosten, etc. moet je dus eerst alle dagen bij elkaar optellen.`;

  useEffect(() => {
    if (response) {
      rapportGenerator(response, companyName, currentDate);
    }
  }, [response, companyName, currentDate]);

  const handleClick = async () => {
    // check for content
    if (dataBatch.length === 0) {
      alert("Geen bestanden geselecteerd, oekel.");
      setIsUploading(false);
      return;
    }

    // Start uploading
    setIsUploading(true);

    // assigning csv files
    const getFileByName = (fileName: string) => {
      const file = dataBatch.find((file) => file.name === fileName);
      return file;
    };

    const csvSummary = getFileByName("summary_Performance.csv");
    const csvCampaign = getFileByName("campaign_Performance.csv");
    const csvGender = getFileByName("gender_Performance.csv");
    const csvAge = getFileByName("age_Performance.csv");
    const csvDevice = getFileByName("device_Performance.csv");

    if (!csvSummary || !csvCampaign || !csvGender || !csvAge || !csvDevice) {
      alert("Niet alle benodigde bestanden zijn geselecteerd.");
      setIsUploading(false);
      return;
    }

    // making requests
    try {
      const request = async (
        csvFile: File,
        prompt: string,
        model: string,
        temperature: number,
        maxTokens: number
      ) => {
        let csvFileText: string = "";
        csvFileText += await csvFile.text();

        const response = await fetch("http://localhost:3001/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: prompt + csvFileText,
            model: model,
            temperature: temperature,
            max_tokens: maxTokens,
          }),
        });

        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse;
      };

      const responseSummaryPrompt = await request(
        csvSummary,
        promptSummary,
        "gpt-4o-mini",
        0.5,
        250
      );
      const responsePromptAge = await request(
        csvAge,
        promptAge,
        "gpt-4o-2024-08-06",
        0.3,
        200
      );
      const responsePromptGender = await request(
        csvGender,
        promptGender,
        "gpt-4o-2024-08-06",
        0.3,
        200
      );
      const responsePromptDevices = await request(
        csvDevice,
        promptDevice,
        "gpt-4o-2024-08-06",
        0.3,
        200
      );
      const responsePromptDayAndTime = await request(
        csvCampaign,
        promptDayAndTime,
        "gpt-4o-2024-08-06",
        0.3,
        200
      );

      setResponse(
        "Samenvatting" +
          "\n\n" +
          responseSummaryPrompt.content +
          "\n\n" +
          "Leeftijden" +
          "\n\n" +
          responsePromptAge.content +
          "\n\n" +
          "Geslacht" +
          "\n\n" +
          responsePromptGender.content +
          "\n\n" +
          "Apparaten" +
          "\n\n" +
          responsePromptDevices.content +
          "\n\n" +
          "Dag en Tijd" +
          "\n\n" +
          responsePromptDayAndTime.content
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="logoContainer">
        <h1>Google Ads AI</h1>
        <img src={logo} className="logo" alt="Geen Gedoe Google Ads logo" />
      </div>
      <div className="dataForm">
        <label>Bedrijfsnaam</label>
        <input
          onChange={(e) => {
            setCompanyName(e.target.value);
          }}
        ></input>
        <label>Data</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setDataBatch(Array.from(e.target.files));
            }
          }}
        ></input>
        <div className="fineTuneContainer">
          <div className="textLanguage">
            <label>Teksttaal</label>
            <select
              value={parameterLanguage}
              onChange={(e) => {
                setParameterLanguage(e.target.value);
              }}
            >
              <option value="In het nederlands, ">Nederlands</option>
              <option value="In het engels, ">Engels</option>
            </select>
          </div>
          <div className="textTone">
            <label>Teksttoon</label>
            <select
              value={parameterTone}
              onChange={(e) => {
                setParameterTone(e.target.value);
              }}
            >
              <option value="in formele stijl, ">Formeel</option>
              <option value="in informele stijl, ">Informeel</option>
              <option value="in zakelijke stijl, ">Zakelijk</option>
              <option value="in behapzaam en eenvoudigere stijl, ">
                Behapzaam
              </option>
              <option value="in enthausiaste en vrolijke stijl, ">
                Enthausiast
              </option>
              <option value="in inspirerende en motiverende stijl, ">
                Inspirerend
              </option>
              <option value="in humoristische stijl, ">Humoristisch</option>
              <option value="in humoristische en neerbuigende stijl, ">
                Neerbuigend
              </option>
            </select>
          </div>
        </div>
        <div className="x">
          <label>Analyseniveau</label>
          <select>
            <option value="campaignLevel">Campagne</option>
            <option value="adGroupLevel">Advertentiegroep</option>
          </select>
        </div>
        <label>Toevoegingen (optioneel)</label>
        <input></input>
      </div>
      <button onClick={handleClick} disabled={isUploading}>
        {isUploading === true
          ? "Verwerken, even geduld..."
          : "Analyse uitvoeren"}
      </button>
    </div>
  );
}

export default App;

/*
      console.log(`companyname: ${companyName}`);
      console.log(`date: ${currentDate}`);
      console.log("--------------------");
      console.log("initial request");
      console.log("prompt: " + promptSummary);
      console.log("file: " + csvSummary.text.toString);
      console.log("--------------------");
      console.log("first request");
      console.log("prompt: " + promptAge);
      console.log("file: " + csvAge.text.toString);
      console.log("--------------------");
      console.log("second request");
      console.log("prompt: " + promptGender);
      console.log("file: " + csvGender.text.toString);
      console.log("--------------------");
      console.log("third request");
      console.log("prompt: " + promptDevice);
      console.log("file: " + csvDevice.text.toString);
      console.log("--------------------");
      console.log("fourth request");
      console.log("prompt: " + promptDayAndTime);
      console.log("file: " + csvCampaign.text.toString);
      console.log("--------------------");
      */
