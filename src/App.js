import React, { useState, useEffect } from "react";
import './App.css';
import Navbar from "./components/navbar/Navbar.jsx";
import Editor from "./components/editor/Editor.jsx";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('c_cpp');
  const [dark, updateDark] = useState(false);
  const language_name = {
    54 : "c_cpp",
    50 : "c_cpp",
    51 : "csharp",
    62 : "java",
    63 : "javascript",
    71 : "python",
    22 : "golang"
  }
  const changeLanguage = (e) => {
    console.log(9, e)
    if (e.hasOwnProperty('mode')) { 
      setSelectedLanguage(e.mode);
    }
    else {
      setSelectedLanguage(e.target.value);
    }
  }

  return (
    <div className="App">
      <Navbar 
        selectedLanguage = {selectedLanguage} 
        onChange = {changeLanguage}
      />
      <Editor
        mode={selectedLanguage}
        dark={dark}
        changeLanguage={changeLanguage}
      />
    </div>
  );
}

export default App;
