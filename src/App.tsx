import { useState, useEffect } from "react";
import axios from "axios";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import logo from "/logo.png";
import "./App.css";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [csvData, setCsvData] = useState("");
  const [response, setResponse] = useState("");

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const prompt: string =
    "Geef een analyse over de volgende data. Deel deze analyse in 3 paragrafen op: introductie, analyse en conclusie. Zet ook de titel er netjes boven.";

  const generateWordFile = (text: string) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(text)],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "document.docx");
    });
  };

  async function handleUpload() {
    if (!file) {
      setUploadStatus("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("Uploading...");

    axios
      .post("http://httpbin.org/post", formData, {
        headers: {
          "Custom-Header": "Value",
        },
      })
      .then((res) => {
        console.log(res.data.files.file);
        setCsvData(res.data.files.file);
        setUploadStatus("Connecting to server...");
      })
      .catch((err) => {
        setUploadStatus("Upload failed");
        console.log(err);
      });
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt + csvData }),
    });
    const data = await res.json();
    setResponse(data.content);
    setUploadStatus("Response retrieved successfully!");
    setIsFinished(true);
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
      <label>{`Bestanden om te analyseren:`}</label>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          } else {
            setFile(null);
          }
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && (
        <span className={isFinished ? "finished" : "notFinished"}>
          {uploadStatus}
        </span>
      )}
      {/*response && (
        <>
          <h3>Response from ChatGPT:</h3>
          <pre>{response}</pre>
        </>
      )*/}
    </div>
  );
}

export default App;

/* 
import { useState } from "react";
import axios from "axios";
import logo from "/logo.png";
import "./App.css";

function App() {
  
  const [accountNameValue, setAccountNameValue] = useState("");
  const [startingDateValue, setStartingDateValue] = useState("");
  const [endingDateValue, setEndingDateValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState<string | null>(null);
  const [csvData, setCsvData] = useState("");
  const [response, setResponse] = useState("");

  const prompt: string =
    "Geef een analyse over de volgende data. Deel deze analyse in 3 paragrafen op: introductie, analyse en conclusie. Zet ook de titel er netjes boven.";

  const handleAccountNameChange = (event: any) => {
    setAccountNameValue(event.target.value);
  };
  const handleStartingDateChange = (event: any) => {
    setStartingDateValue(event.target.value);
  };
  const handleEndingDateChange = (event: any) => {
    setEndingDateValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  function handleUpload() {
    if (!file) {
      setMsg("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setMsg("Uploading...");
    setProgress((prevState) => ({
      ...prevState,
      started: true,
    }));

    axios
      .post("http://httpbin.org/post", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress((prevState) => ({
              ...prevState,
              pc: percentCompleted,
            }));
          }
        },
        headers: {
          "Custom-Header": "Value",
        },
      })
      .then((res) => {
        setMsg("Upload successful");
        console.log(res.data.files.file);
        setCsvData(res.data.files.file);
      })
      .catch((err) => {
        setMsg("Upload failed");
        console.log(err);
      });
  }

  const handleResponse = async () => {
    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt + csvData }),
    });
    const data = await res.json();
    setResponse(data.content);
  };

  return (
    <div className="container">
      <div>
        <a href="https://www.google.com/" target="_blank">
          <img src={logo} className="logo" alt="Geen Gedoe Google Ads logo" />
        </a>
      </div>
      <form className="form">
        <label>Account name</label>
        <input
          type="text"
          id="accountName"
          value={accountNameValue}
          onChange={handleAccountNameChange}
        />
        <div className="dateContainer">
          <div className="startingDate">
            <label>Starting date</label>
            <input
              type="text"
              id="startingDate"
              value={startingDateValue}
              onChange={handleStartingDateChange}
            />
          </div>
          <div className="endingDate">
            <label>Ending date</label>
            <input
              type="text"
              id="endingDate"
              value={endingDateValue}
              onChange={handleEndingDateChange}
            />
          </div>
        </div>

        <button type="submit" onSubmit={handleSubmit}>
          Generate rapport
        </button>
      </form>

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
          } else {
            setFile(null);
          }
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      {progress.started && <progress max="100" value={progress.pc}></progress>}
      {msg && <span>{msg}</span>}
      <button onClick={handleResponse}>Get Response</button>
      {response && (
        <>
          <h3>Response from ChatGPT:</h3>
          <pre>{response}</pre>
        </>
      )}
    </div>
  );
}

export default App; 
*/
