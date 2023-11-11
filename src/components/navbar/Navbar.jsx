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
        <option value="54">C++</option>
        <option value="50">C</option>
        <option value="51">C#</option>
        <option value="62">Java</option>
        <option value="63">Javascript</option>
        <option value="71">Python</option>
        <option value="22">Go</option>
      </select>
    </div>
  )
}
