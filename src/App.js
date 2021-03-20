import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import PixelEditor from "./PixelEditor";
import logo from './6bit-owl-wolf.png';
import './App.css';
import { Users, BrowserStorage } from '@spacehq/users'
import {useState, useEffect} from "react";
import _ from "lodash";

function App() {
    const [spaceUser, setSpaceUser] = useState({})

    const initializeUser = async () => {
        console.log("Initializing users from browser storage")
        const storage = new BrowserStorage()
        const onErrorCallback = (err, identity) => {
            console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
        }
        // users are automatically restored from stored identities
        const users = await Users.withStorage(storage, {endpoint: "wss://auth-dev.space.storage"}, onErrorCallback)

        const userList = users.list();
        if(_.isEmpty(userList)) {
            console.log("No identities found")
            // TODO: Prompt to restore an identity as alternative to creating a new one?
            const identity = await users.createIdentity()
            console.log("Created new identity")
            const user = await users.authenticate(identity)
            console.log("Authenticated new user")
            setSpaceUser(user)
        } else {
            console.log("Loaded first user from browser storage")
            setSpaceUser(userList[0])
        }
    }

    useEffect(() => {
        initializeUser()
    }, [])


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
