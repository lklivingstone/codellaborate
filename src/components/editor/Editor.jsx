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

function Editor() {

  const [socket, setSocket] = useState();
  const [session_id, setSessionId] = useState('meow');
  const [editorValue, setEditorValue] = useState('');
  const [collaborator, setCollaborator] = useState(null);
  const [lastAppliedChange, setLastAppliedChange] = useState(null);
  const [justClearedBuffer, setJustClearedBuffer] = useState(false);

//  useEffect(() => {
//      const collaborationSocket = io.connect('https://code.thayer.dartmouth.edu:1337', {
//        query: 'session_id=' + session_id,
//      });
//
//      collaborationSocket.on('change', (delta) => {
//        delta = JSON.parse(delta);
//        setLastAppliedChange(delta);
//        // Update the editor content with the received change
//        setEditorValue(editorValue + delta);
//      });
//
//      collaborationSocket.on('clear_buffer', () => {
//        setJustClearedBuffer(true);
//        console.log('setting editor empty');
//        setEditorValue('');
//      });
//
//      setCollaborator(collaborationSocket);
//
//      // Clean up the socket connection when the component unmounts
//      return () => {
//        collaborationSocket.disconnect();
//      };
//    }, [session_id]);


    //  editorElement?.getSession()?.getDocument()?.applyDeltas([delta])
    // Apply deltas to the code content
    //setEditorValue((prevCode) => {
      // Clone the previous code content
    //  const newCode = [...prevCode];
      // Apply the delta to the new code content
   // if (delta.action === 'insert') {
 //     newCode.splice(delta.start.row, 0, ...delta.lines);
 //   } else if (delta.action === 'remove') {
 //     newCode.splice(delta.start.row, delta.end.row - delta.start.row + 1);
 //   }

 //   // Join the code content back to a string
 //   return newCode.join('\n');
 //   });
  useEffect(() => { 
    console.log(2, editorValue);
  }, [editorValue])
  
  const handleEditorChange = (newCode, event) => {
      console.log(6, event, newCode);
      setEditorValue(newCode);
    
      if (socket == null) return;
      socket.emit('send-changes', event)
//  //      // TODO: Efficiently track change IDs to prevent conflicts
//      if (lastAppliedChange !== newEditorValue && !justClearedBuffer) {
//        // Send the change to the server
//        collaborator.emit('change', JSON.stringify(newEditorValue));
//      }
//      setJustClearedBuffer(false);
//      setEditorValue(newEditorValue);
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

      console.log(6, editorValue)
      setEditorValue((prevEditorValue) => {
        var editorValueArray = prevEditorValue.split("\n");

        if (delta.action === 'insert') {
          var prefixArray = editorValueArray.slice(0, delta.start['row']);
          var suffixArray = editorValueArray.slice(delta.start['row'] + 1, editorValueArray.length);
          
          var prefixString = editorValueArray[delta.start['row']].slice(0, delta.start['column']);
          // var middleString = delta.lines[0];
          var suffixString = editorValueArray[delta.start['row']].slice(delta.start['column'], editorValueArray[delta.start['row']].length);

          // var currString = prefixString + delta.lines[0];
          
          prefixString += delta.lines[0];

          var newDeltaLines = delta.lines.slice(1);
          
          if (newDeltaLines.length === 0) {
            prefixString += suffixString;
          }
          else {
            newDeltaLines[newDeltaLines.length - 1] += suffixString;
          }

          // var currString = prefixString + middleString + suffixString;
          var finalArray = [...prefixArray, prefixString, ...newDeltaLines, ...suffixArray];

          var finalString = finalArray.join("\n");
          // console.log(5, prevEditorValue, prefixString, middleString, suffixString, prefixArray, currString, suffixArray, finalString);
          return finalString;
        }
      else {  
        var prefixArray = editorValueArray.slice(0, delta.start['row']);
        var suffixArray = editorValueArray.slice(delta.end['row'] + 1, editorValueArray.length);

        var prefixString = ``;
        var suffixString = ``;
        var middleString = ``;
        //if (delta.start['row'] == delta.end['row']) { 
        prefixString = editorValueArray[delta.start['row']].slice(0, delta.start['column']);
        suffixString = editorValueArray[delta.end['row']].slice(delta.end['column'], editorValueArray[delta.end['row']].length);
        //}
        //else {
        //    
        //  }
        var finalArray = [...prefixArray, prefixString + suffixString, ...suffixArray];

        var finalString = finalArray.join("\n");

        return finalString;
      }

       // If the action is not 'insert', return the previous value
       return prevEditorValue;
     });
    }
  
  
    socket.on("receive-changes", applyDeltas)

    return () => {
      socket.off("receive-changes")
    }
  }, [socket])

  return (
    <AceEditor
      id="editor"
      mode = "javascript"
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
