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
  //const [response, setResponse] = useState("")

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
      {csvData && (
        <div className="csv-data">
          <h3>CSV Data:</h3>
          <pre>{csvData}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
