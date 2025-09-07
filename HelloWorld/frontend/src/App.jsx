import "./App.css";
import ApiBox from "./components/ApiBox.jsx";
import WsBox from "./components/WsBox.jsx";
import PollBox from "./components/PollBox.jsx";
import reactLogo from "./assets/react.png";
import js from "./assets/js12.png";
import cs from "./assets/cs.png";
import dotnet from "./assets/DotNet.png";
import db from "./assets/postgresqlb.png";

function App() {
  return (
    <div className="container">
      <h2 className="title">
        Hello World! </h2>
        <hr />
      <p id="status">System loading...Please wait...</p>
      

      <ApiBox />
      <PollBox />
      <WsBox />

      <img src={reactLogo} className="imgTools" />
      <img src={js} className="imgTools" />
      <img src={dotnet} className="imgTools" />
      <img src={cs} className="imgTools" />
      <img src={db} className="imgTools" />
    </div>
  );
}

export default App;
