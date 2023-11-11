import React, { useState, useEffect } from "react";
import './App.css';
import Navbar from "./components/navbar/Navbar.jsx";
import Editor from "./components/editor/Editor.jsx";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('54');
  
  return (
    <div className="App">
      <Navbar 
        selectedLanguage = {selectedLanguage} 
        onChange = {
          e => {
            setSelectedLanguage(e.target.value)  
          }
        }
      />
      <Editor />
    </div>
  );
}

export default App;
