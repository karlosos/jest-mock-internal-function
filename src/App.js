import { WelcomeMessage } from "./demo/welcomeMessage";

function App() {
  return (
    <div className="App">
      <h1>My app</h1>
      <p>
        <WelcomeMessage name={'John'} />
      </p>
    </div>
  );
}

export default App;
