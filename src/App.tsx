import { useState, useEffect } from "react";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import logo from "/logo.png";
import "./App.css";

function App() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [campaignRapport, setCampaignRapport] = useState<File[]>([]);
  const [adRapports, setAdRapports] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState("");

  /*const introductionParagraph: string = `Bij deze sturen wij je de maandelijkse rapportage van de Google Ads optimalisatie
  van de lopende campagne. Het is van belang om eerst enkele statistieken in kaart te
  brengen die ons een idee geven van hoe de campagnes draaien.`;*/

  const prompt: string = `Geef een analyse over het bedrijf "${companyName}". Deel deze op in de volgende paragrafen; "Inleiding" en "Statistieken". Zorg ervoor dat je het totaal aantal clicks, CTR, kosten, CPC, het aantal conversies en de kosten per conversie van de campagnes bij elkaar opgeteld in de "Statistieken" paragraaf duidelijk onder elkaar opbreekt.`;

  const campaignPrompt: string = `Geef een analyze over "${fileName}" van het bedrijf "${companyName}". Geef eerst de naam van de campagne, en deel daarna de analyze op in de paragrafen "Leeftijden", "Geslacht", "Apparaten", "Dag en tijd" en "Doelgroepen". Dit doe je daarna ook met de andere campagnes. Wanneer je iets niet weet of ergens geen (duidelijke) informatie over hebt, geef je dit ook aan bij de betreffende paragraaf. `;

  const handleCompanyName = (event: any) => {
    setCompanyName(event.target.value);
  };

  const generateWordFile = (text: string) => {
    const paragraphs = text.split("\n\n");

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Google Ads Optimalisatie",
              heading: HeadingLevel.TITLE,
            }),
            ...paragraphs.flatMap((paragraph) => [
              new Paragraph({
                children: [new TextRun(paragraph)],
              }),
              new Paragraph({ text: "" }),
            ]),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "campagne-analyse.docx");
    });
  };

  async function handleUpload() {
    if (campaignRapport.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const combineTextAndAnalyze = async (files: File[], prompt: string) => {
        let combinedText = "";
        for (const file of files) {
          combinedText += await file.text();
        }

        const response = await fetch("http://localhost:3001/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: prompt + combinedText }),
        });

        return await response.json();
      };

      const analyzedCampagne = await combineTextAndAnalyze(
        campaignRapport,
        prompt
      );
      setFileName(campaignRapport.map((file) => file.name).join(", ")); // indien nodig

      const analyzedAdRapport = await combineTextAndAnalyze(
        adRapports,
        campaignPrompt
      );
      setFileName(adRapports.map((file) => file.name).join(", ")); // indien nodig

      setResponse(analyzedCampagne.content + analyzedAdRapport.content);
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    if (response) {
      generateWordFile(response);
    }
  }, [response]);

  return (
    <div className="container">
      <div>
        <img src={logo} className="logo" alt="Geen Gedoe Google Ads logo" />
      </div>
      <div className="dataForm">
        <label>Bedrijfsnaam</label>
        <input onChange={handleCompanyName}></input>
        <label>Campagnerapport</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setCampaignRapport(Array.from(e.target.files));
            }
          }}
        />
        <label>Advertentierapporten</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setAdRapports(Array.from(e.target.files));
            }
          }}
        />
      </div>
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading === true
          ? "Verwerken, even geduld..."
          : "Laat ChatGPT analyzeren"}
      </button>
      <small>versie: 1.0.0, model: OpenAI ChatGPT-4o</small>
    </div>
  );
}

export default App;
