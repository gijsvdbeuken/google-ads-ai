import { useState, useEffect } from "react";
import axios from "axios";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import logo from "/logo.png";
import "./App.css";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fullPrompt, setFullPrompt] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [companyName, setCompanyName] = useState<string | null>(null);

  const handleCompanyName = (event: any) => {
    setCompanyName(event.target.value);
  };

  const prompt: string = `Geef een analyse over het bedrijf "${companyName}". Deel deze op in de volgende paragrafen; "Inleiding" en "Statistieken". Zorg ervoor dat je het totaal aantal clicks, CTR, kosten, CPC, het aantal conversies en de kosten per conversie van de campagnes bij elkaar opgeteld in de "Statistieken" paragraaf duidelijk onder elkaar opbreekt. Daarna ga je de individuele campagnes in diepte analyzeren. Je begint bij de eerste campagne, geeft de naam van de campagne aan, en deelt het daarna op in de paragrafen "Leeftijden", "Geslacht", "Apparaten", "Dag en tijd" en "Doelgroepen". Dit doe je daarna ook met de andere campagnes. Wanneer je iets niet weet of ergens geen (duidelijke) informatie over hebt, geef je dit ook aan bij de betreffende paragraaf. `;

  const generateWordFile = (text: string) => {
    // Verdeel de tekst in paragrafen, splitst op dubbele nieuwe regel
    const paragraphs = text.split("\n\n");

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Google Ads Optimalisatie", // Voeg hier de titel toe
              heading: HeadingLevel.TITLE, // Optioneel: Pas de titel aan
            }),
            ...paragraphs.flatMap((paragraph) => [
              new Paragraph({
                children: [new TextRun(paragraph)],
              }),
              new Paragraph({ text: "" }), // Voeg een lege paragraaf toe voor extra ruimte
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
    if (files.length === 0) {
      setUploadStatus("No files selected");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploadStatus("Uploading...");

    try {
      // Stuur de bestanden naar de server (of verwerk ze op een andere manier)
      const res = await axios.post("http://httpbin.org/post", formData, {
        headers: {
          "Custom-Header": "Value",
        },
      });
      console.log(res.data.files);

      // Combineer de tekst van alle bestanden
      let combinedText = "";
      for (const file of files) {
        combinedText += await file.text();
      }
      setUploadStatus("Connecting to server...");

      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt + combinedText }),
      });
      const data = await response.json();
      setResponse(data.content);
      setUploadStatus("Response retrieved successfully!");
      setIsFinished(true);
      setFullPrompt(prompt + combinedText);
    } catch (err) {
      setUploadStatus("Upload failed" + err);
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
        <a href="https://www.google.com/" target="_blank">
          <img src={logo} className="logo" alt="Geen Gedoe Google Ads logo" />
        </a>
      </div>
      <label>Datasets</label>
      <input
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            setFiles(Array.from(e.target.files));
          }
        }}
      />
      <label>Bedrijfsnaam</label>
      <input onChange={handleCompanyName}></input>
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && (
        <span className={isFinished ? "finished" : "notFinished"}>
          {uploadStatus}
        </span>
      )}
      {fullPrompt && (
        <>
          <h3>Question asked:</h3>
          <pre>{fullPrompt}</pre>
        </>
      )}
    </div>
  );
}

export default App;
