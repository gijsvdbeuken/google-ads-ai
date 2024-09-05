import { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import logo from "/logo.png";
import "./App.css";
SVGAnimateTransformElement;

function App() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [campaignRapport, setCampaignRapport] = useState<File[]>([]);
  // const [campaignDataFiles, setCampaignDataFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [response, setResponse] = useState("");

  const [campaignNames, setCampaignNames] = useState<string[]>(["", "", ""]);
  const [campaignNamesCounter, setCampaignNamesCounter] = useState<number>(0);
  const [campaignOneDataFiles, setCampaignOneDataFiles] = useState<File[]>([]);
  const [campaignTwoDataFiles, setCampaignTwoDataFiles] = useState<File[]>([]);
  const [campaignThreeDataFiles, setCampaignThreeDataFiles] = useState<File[]>(
    []
  );
  //const [campaginData, setCampaignData] = useState<string[]>(["", "", ""]);

  const [currentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const prompt: string = `Geef eerst onder elkaar met een regel witruimte het aantal Clicks de CTR, de Kosten, de CPC, het Aantal Conversies en de Kosten per Conversie. Schrijf daarna één paragraaf over de statistieken van alle campagnes bij elkaar opgeteld. zet GEEN titel boven de paragraaf, ik wil enkel de inhoudelijke paragraaftekst.`;

  /*
  const campaignPrompt: string = `Geef een analyze over de campagnes van het bedrijf "${companyName}". Start telkens met de naam van de campagne, en werk daarna de analyze uit in 5 alinea's; "Leeftijden", "Geslacht", "Apparaten", "Dag en Tijd", en "Doelgroepen". Ook geef je bij iedere alinea welke bodaanpassing je gaat toepassen op basis van de verkgregen informatie. Doe dit op chronologische volgorde ook voor de andere campagne's. schrijf de alinea telkens als plain text ONDER de titel met een regel witruimte er tussenin, en gebruik geen markdown of tekens als ":". Wanneer je geen informatie over een alinea hebt weten te vinden, citeer je "Wij hebben geen gegevens kunnen vinden m.b.t. deze campagne en dit onderwerp".`;
  */

  const campaignPrompt: string = `Geef een analyze over de campagne genaamd ${campaignNames[campaignNamesCounter]}. Geef eerst de naam van de campagne (Campagne: <naam_campagne>), gevolgd door 5 alinea's: "Leeftijden", "Geslacht", "Apparaten", "Dag en Tijd, en "Doelgroepen". Schrijf de alinea telkens ONDER de titel met een regel witruimte er ussenin, en gebruik geen markdown of tekens als ":".`;

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
                  font: "Arial",
                  text: "Google Ads Optimalisatie",
                  bold: true,
                  size: 48,
                  color: "E74764",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: "Arial",
                  text: `${companyName}`,
                  bold: true,
                  size: 20,
                  color: "E74764",
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  font: "Arial",
                  text: `Geen Gedoe - Media & Marketing - ${currentDate}`,
                  size: 20,
                  color: "113676",
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  font: "Arial",
                  text: "Inleiding",
                  bold: true,
                  size: 20,
                  color: "E74764",
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  font: "Arial",
                  text: `Bij deze sturen wij je de maandelijkse rapportage van de Google Ads optimalisatie van de lopende campagne(s). Het is van belang om eerst enkele statistieken in kaart te brengen die ons een idee geven van hoe de campagnes draaien.`,
                  size: 20,
                  color: "113676",
                }),
              ],
            }),
            new Paragraph({}),

            ...paragraphs.flatMap((paragraph) => {
              const isTitle =
                paragraph === "Leeftijden" ||
                paragraph === "Geslacht" ||
                paragraph === "Apparaten" ||
                paragraph === "Dag en Tijd" ||
                paragraph === "Doelgroepen";

              const isSubTitle =
                paragraph === "Aantal Clicks:" ||
                paragraph === "CTR:" ||
                paragraph === "Kosten:" ||
                paragraph === "CPC:" ||
                paragraph === "Aantal Conversies:" ||
                paragraph === "Kosten per Conversie:";

              return [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: "Arial",
                      text: paragraph,
                      size: 20,
                      bold: isTitle || isSubTitle,
                      color: isTitle ? "E74764" : "113676",
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

      const analyzedCampaignOne = await combineTextAndAnalyze(
        campaignOneDataFiles,
        campaignPrompt
      );

      setCampaignNamesCounter(1);

      const analyzedCampaignTwo = await combineTextAndAnalyze(
        campaignTwoDataFiles,
        campaignPrompt
      );

      setCampaignNamesCounter(2);

      const analyzedCampaignThree = await combineTextAndAnalyze(
        campaignThreeDataFiles,
        campaignPrompt
      );

      setResponse(
        analyzedCampagne.content +
          "\n\n" +
          analyzedCampaignOne.content +
          "\n\n" +
          analyzedCampaignTwo.content +
          "\n\n" +
          analyzedCampaignThree.content
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
        <label>CSV Kaartgegevens alle campagnes</label>
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
        {/* Campagne 1*/}
        <label>Campagnenaam</label>
        <input
          onChange={(e) => {
            const updatedCampaignNames = [...campaignNames];
            updatedCampaignNames[0] = e.target.value;
            setCampaignNames(updatedCampaignNames);
          }}
        ></input>
        <label>Kaartgegevens</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setCampaignOneDataFiles(Array.from(e.target.files));
            }
          }}
        ></input>
        {/* Campagne 2*/}
        <label>Campagnenaam</label>
        <input
          onChange={(e) => {
            const updatedCampaignNames = [...campaignNames];
            updatedCampaignNames[1] = e.target.value;
            setCampaignNames(updatedCampaignNames);
          }}
        ></input>
        <label>Kaartgegevens</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setCampaignTwoDataFiles(Array.from(e.target.files));
            }
          }}
        ></input>
        {/* Campagne 3*/}
        <label>Campagnenaam</label>
        <input
          onChange={(e) => {
            const updatedCampaignNames = [...campaignNames];
            updatedCampaignNames[2] = e.target.value;
            setCampaignNames(updatedCampaignNames);
          }}
        ></input>
        <label>Kaartgegevens</label>
        <input
          className="fileInput"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setCampaignThreeDataFiles(Array.from(e.target.files));
            }
          }}
        ></input>
      </div>
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading === true
          ? "Verwerken, even geduld..."
          : "Laat ChatGPT analyzeren"}
      </button>
      <small>versie: 1.0.0, model: OpenAI ChatGPT-4o-mini</small>
    </div>
  );
}

export default App;
