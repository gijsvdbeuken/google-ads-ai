import { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import logo from "/logo.png";
import "./App.css";
SVGAnimateTransformElement;

function App() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [campaignRapport, setCampaignRapport] = useState<File[]>([]);
  const [adRapports, setAdRapports] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState("");

  const prompt: string = `Geef eerst onder elkaar het aantal Clicks de CTR, de Kosten, de CPC, het Aantal Conversies en de Kosten per Conversie. Schrijf daarna één paragraaf over de statistieken van alle campagnes bij elkaar opgeteld. zet GEEN titel boven de paragraaf, ik wil enkel de inhoudelijke paragraaftekst.`;

  const campaignPrompt: string = `Geef een analyze over de campagnes van het bedrijf "${companyName}". Geef eerst de naam van de campagne, en deel daarna de analyze op in de paragrafen "Leeftijden", "Geslacht", "Apparaten", "Dag en tijd" en "Doelgroepen". Dit doe je daarna ook met de andere campagnes. Wanneer je iets niet weet of ergens geen (duidelijke) informatie over hebt, geef je dit ook aan bij de betreffende paragraaf. Gebruik GEEN Markdown of tekens als ":" voor het aankondigen van titels. gebruik voor alles gewoon 'plain' tekst, maar zet de paragraaf zelf wel één regel onder de titel, zonder witruimte tussen de titel en paragraaf.`;

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
              children: [
                new TextRun({
                  text: "Google Ads Optimalisatie",
                  bold: true,
                  size: 48,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${companyName}`,
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Geen Gedoe - Media & Marketing - 01-01-2025",
                  size: 24,
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Inleiding",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Bij deze sturen wij je de maandelijkse rapportage van de Google Ads optimalisatie van de lopende campagne. Het is van belang om eerst enkele statistieken in kaart te brengen die ons een idee geven van hoe de campagnes draaien.`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({}),

            ...paragraphs.flatMap((paragraph) => {
              const isTitle =
                paragraph === "Leeftijden" ||
                paragraph === "Geslacht" ||
                paragraph === "Apparaten" ||
                paragraph === "Dag en tijd" ||
                paragraph === "Doelgroepen";

              return [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paragraph,
                      bold: isTitle,
                    }),
                  ],
                }),
                new Paragraph({ text: "" }),
              ];
            }),
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

      const analyzedAdRapport = await combineTextAndAnalyze(
        adRapports,
        campaignPrompt
      );

      setResponse(
        analyzedCampagne.content + "\n\n" + analyzedAdRapport.content
      );
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
