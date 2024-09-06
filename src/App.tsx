import { useState, useEffect } from "react";
import { rapportGenerator } from "./utilities/RapportGenerator";
import { dataUploader } from "./utilities/DataUploader";
import logo from "/logo.png";
import "./App.css";
SVGAnimateTransformElement;

function App() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState("");
  const [currentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const overviewPrompt: string = `Geef eerst onder elkaar met een regel witruimte het aantal Clicks de CTR, de Kosten, de CPC, het Aantal Conversies en de Kosten per Conversie. Schrijf daarna één paragraaf over de statistieken van alle campagnes bij elkaar opgeteld. zet GEEN titel boven de paragraaf, ik wil enkel de inhoudelijke paragraaftekst.`;

  const detailedPrompt: string = `Geef een analyze over de volgende campagnes. Geef eerst de naam van de campagne (Campagne: <naam_campagne>), gevolgd door 5 alinea's: "Leeftijden", "Geslacht", "Apparaten", "Dag en Tijd, en "Doelgroepen". Schrijf de alinea telkens ONDER de titel met een regel witruimte er ussenin, en gebruik geen markdown of tekens als ":".`;

  useEffect(() => {
    if (response) {
      rapportGenerator(response, companyName, currentDate);
    }
  }, [response, companyName, currentDate]);

  return (
    <div className="container">
      <div>
        <img src={logo} className="logo" alt="Geen Gedoe Google Ads logo" />
      </div>
      <div className="dataForm">
        <label>Bedrijfsnaam</label>
        <input
          onChange={(e) => {
            setCompanyName(e.target.value);
          }}
        ></input>
        <label>Campagne data</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setCampaignData(Array.from(e.target.files));
            }
          }}
        ></input>
      </div>
      <button
        onClick={() =>
          dataUploader(
            campaignData,
            overviewPrompt,
            detailedPrompt,
            setIsUploading,
            setResponse
          )
        }
        disabled={isUploading}
      >
        {isUploading === true
          ? "Verwerken, even geduld..."
          : "Analyze uitvoeren"}
      </button>
      <small>versie: 1.0.0, model: OpenAI ChatGPT-4o-mini</small>
    </div>
  );
}

export default App;
