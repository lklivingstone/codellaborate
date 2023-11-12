import React from "react";
import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import io from 'socket.io-client';
import 'brace/mode/c_cpp';
import 'brace/mode/csharp';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/mode/golang';
import 'brace/theme/github';
import 'brace/theme/monokai';

function Editor(data) {

  const [socket, setSocket] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [mode, setMode] = useState(data.mode);
  useEffect(() => { 
    console.log(2, editorValue);
  }, [editorValue])
  
  const handleEditorChange = (newCode, event) => {
    console.log(6, event, newCode);
    setEditorValue(newCode);
  
    if (socket == null) return;
    socket.emit('send-changes', event)
  };

  useEffect(() => {
    const io_socket = io("http://localhost:5000");
    setSocket(io_socket);


    return () => {
      io_socket.disconnect();
    }
  }, []); 

  useEffect(() => {
    if (socket == null) return;
    console.log("received");
    const applyDeltas = (delta) => {
      console.log(1, delta)

       if (delta.hasOwnProperty('mode')) {
        setMode(delta.mode);
        data.changeLanguage({
          mode: delta.mode 
        })

        return; 
      }
      console.log(6, editorValue)
      setEditorValue((prevEditorValue) => {
        var editorValueArray = prevEditorValue.split("\n");
        
        if (delta.action === 'insert') {
          var prefixArray = editorValueArray.slice(0, delta.start['row']);
          var suffixArray = editorValueArray.slice(delta.start['row'] + 1, editorValueArray.length);
          
          var prefixString = editorValueArray[delta.start['row']].slice(0, delta.start['column']);
          // var middleString = delta.lines[0];
          var suffixString = editorValueArray[delta.start['row']].slice(delta.start['column'], editorValueArray[delta.start['row']].length);
          
          prefixString += delta.lines[0];

          var newDeltaLines = delta.lines.slice(1);
          
          if (newDeltaLines.length === 0) {
            prefixString += suffixString;
          }
          else {
            newDeltaLines[newDeltaLines.length - 1] += suffixString;
          }

          var finalArray = [...prefixArray, prefixString, ...newDeltaLines, ...suffixArray];

          var finalString = finalArray.join("\n");
          return finalString;
        }
      else {  
        var prefixArray = editorValueArray.slice(0, delta.start['row']);
        var suffixArray = editorValueArray.slice(delta.end['row'] + 1, editorValueArray.length);

        var prefixString = ``;
        var suffixString = ``;
        prefixString = editorValueArray[delta.start['row']].slice(0, delta.start['column']);
        suffixString = editorValueArray[delta.end['row']].slice(delta.end['column'], editorValueArray[delta.end['row']].length);
        var finalArray = [...prefixArray, prefixString + suffixString, ...suffixArray];

        var finalString = finalArray.join("\n");

        return finalString;
      }
     });
    }
    socket.on("receive-changes", applyDeltas)
    return () => {
      socket.off("receive-changes")
    }
  }, [socket])

  useEffect(() => {
    setMode((mode) => {
      return data.mode;
    })
    if (socket == null) return;
    socket.emit('send-changes', {
      mode: data.mode
    });
  }, [data.mode])

  return (
    <AceEditor
      id="editor"
      mode = {mode}
      theme = "monokai"
      onChange = {handleEditorChange}
      name = "abcd"
      fontSize = {14}
      width = '100%'
      height = '100%'
      value={editorValue}
      // editorProps={{ $blockScrolling: Infinity }}
      // editorProps={{
      //   $blockScrolling: true
      // }}
      setOptions = {{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        tabSize: 4,
      }}
    />
  );
}

export default Editor;
