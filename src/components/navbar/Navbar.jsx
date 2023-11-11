import "./Navbar.css";

export default function Navbar(data) {
  
  return (
    <div className="navbar">
      <p>Programming Language:</p>
      <select 
      name="selectedLanguage"
      value={data.selectedLanguage} // ...force the select's value to match the state variable...
      onChange={data.onChange} 
      >
        <option value="c_cpp">C/C++</option>
        <option value="csharp">C#</option>
        <option value="java">Java</option>
        <option value="javascript">Javascript</option>
        <option value="python">Python</option>
        <option value="golang">Go</option>
      </select>
    </div>
  )
}
