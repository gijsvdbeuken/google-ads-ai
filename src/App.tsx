import { useState, useEffect } from "react";
import { rapportGenerator } from "./utilities/RapportGenerator";
import { dataUploader } from "./utilities/DataUploader";
import logo from "/logo.png";
import "./App.css";
SVGAnimateTransformElement;

function App() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [data, setData] = useState<File[]>([]);
  const [userAdditions, setUserAdditions] = useState<string>("");
  const [textLanguage, setTextLanguage] = useState<string>("");
  const [outputTone, setOutputTone] = useState<string>("");
  const [analyzeLevel, setAnalyzeLevel] = useState<string>("campaignLevel");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState("");
  const [currentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const syntaxRequirements: string = `Schrijf de alinea's telkens ONDER de titel, met een extra regel witruimte tussen de titel en alinea in. Gebruik geen markdown of tekens als ":". `;

  const overviewPrompt: string =
    `${outputTone}` +
    `geef in het ${textLanguage} eerst bij elkaar het aantal Clicks de CTR, de Kosten, de CPC, het Aantal Conversies en de Kosten per Conversie als concrete cijfers, zonder extra informatie. Hierna schrijf je één paragraaf over de statistieken van alle campagnes bij elkaar opgeteld. zet GEEN titel boven de paragraaf, ik wil enkel de inhoudelijke paragraaftekst. ` +
    `${userAdditions}`;

  const campaignLevelPrompt: string =
    `${outputTone}` +
    `geef in het ${textLanguage} een analyze over de volgende campagnes op chronologische volgorde. Geef eerst de naam van de campagne (Campagne: <naam_campagne>), gevolgd door 5 alinea's: "Leeftijden", "Geslacht", "Apparaten", "Dag en Tijd, en "Doelgroepen". Doe dit ook voor de campagnes erna. Wanneer je geen relevante informatie kon vinden m.b.t. de betreffende campagne en een van de alinea's, citeer je "N/A". ` +
    `${syntaxRequirements}` +
    `${userAdditions}`;

  const adGroupLevelPrompt: string =
    `${outputTone}` +
    `geef in het ${textLanguage} een analyze over de volgende advertentiegroepen op chronologische volgorde. Schrijf voor iedere individuele advertentiegroep een korte aline, waarbij je telksens de titel aanduid met de naam van de betreffende advertentiegroep. ` +
    `${syntaxRequirements}` +
    `${userAdditions}`;

  useEffect(() => {
    if (response) {
      rapportGenerator(response, companyName, currentDate);
    }
  }, [response, companyName, currentDate]);

  const handleClick = () => {
    const followUpPrompt =
      analyzeLevel === "campaignLevel"
        ? campaignLevelPrompt
        : adGroupLevelPrompt;
    setIsUploading(true);

    console.log("Data: " + data);
    console.log("Overview prompt: " + overviewPrompt);
    console.log("Follow-up prompt: " + followUpPrompt);
    console.log("Analyse level: " + analyzeLevel);

    dataUploader(
      data,
      overviewPrompt,
      followUpPrompt,
      setIsUploading,
      setResponse
    );
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
        <label>Google Ads data</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setData(Array.from(e.target.files));
            }
          }}
        ></input>
        <div className="fineTuneContainer">
          <div className="textLanguage">
            <label>Teksttaal</label>
            <select
              value={textLanguage}
              onChange={(e) => {
                setTextLanguage(e.target.value);
              }}
            >
              <option value="nederlands">Nederlands</option>
              <option value="engels">Engels</option>
            </select>
          </div>
          <div className="textTone">
            <label>Teksttoon</label>
            <select
              value={outputTone}
              onChange={(e) => {
                setOutputTone(e.target.value);
              }}
            >
              <option value="In formele stijl, ">Formeel</option>
              <option value="In informele stijl, ">Informeel</option>
              <option value="In zakelijke stijl, ">Zakelijk</option>
              <option value="In behapzaam en eenvoudigere stijl, ">
                Behapzaam
              </option>
              <option value="In enthausiaste en vrolijke stijl, ">
                Enthausiast
              </option>
              <option value="In inspirerende en motiverende stijl, ">
                Inspirerend
              </option>
              <option value="In humoristische stijl, ">Humoristisch</option>
              <option value="In humoristische en neerbuigende stijl, ">
                Neerbuigend
              </option>
            </select>
          </div>
        </div>
        <div className="x">
          <label>Analyseniveau</label>
          <select
            value={analyzeLevel}
            onChange={(e) => {
              setAnalyzeLevel(e.target.value);
            }}
          >
            <option value="campaignLevel">Campagne</option>
            <option value="adGroupLevel">Advertentiegroep</option>
          </select>
        </div>
        <label>Toevoegingen (optioneel)</label>
        <input
          onChange={(e) => {
            setUserAdditions(e.target.value);
          }}
        ></input>
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
