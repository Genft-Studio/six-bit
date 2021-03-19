import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import PixelEditor from "./PixelEditor";
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
                            <Link to="/pixel-editor">Pixel Editor</Link>
                        </li>
                        <li>
                            <Link to="/nft-maker">NFT Maker</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/pixel-editor">
                        <PixelEditor />
                    </Route>
                    <Route path="/nft-maker">
                        <NftMaker />
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


function NftMaker() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    NFT Maker<br />
                    Coming Soon...
                </h1>
            </header>
        </div>
    )
}


export default App;
