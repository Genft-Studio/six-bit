import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
// import logo from './logo.svg';
import logo from './6bit-owl-wolf.png';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/pixeleditor">Pixel Editor</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/pixeleditor">
                        <PixelEditor />
                    </Route>
                    {/*<Route path="/users">*/}
                    {/*    <Users />*/}
                    {/*</Route>*/}
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>6-Bit - NFT Studio</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

function PixelEditor() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Pixel Editor<br />
                    Coming Soon...
                </h1>
            </header>
        </div>
    )
}

export default App;
