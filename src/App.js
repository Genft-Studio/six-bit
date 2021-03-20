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
import {UserStorage} from "@spacehq/storage";
import {useState, useEffect, createContext} from "react";
import _ from "lodash";
// import UserContext from "./UserContext";

// const UserContext = createContext(null)

function App() {
    const [spaceUser, setSpaceUser] = useState({})
    const [spaceStorage, setSpaceStorage] = useState({})

    const initializeUser = async () => {
        console.log("Initializing users from browser storage")
        const storage = new BrowserStorage()
        const onErrorCallback = (err, identity) => {
            console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
        }
        // users are automatically restored from stored identities
        // const users = await Users.withStorage(storage, {endpoint: "wss://auth-dev.space.storage"}, onErrorCallback)
        const users = await Users.withStorage(storage, {endpoint: "wss://auth.space.storage"}, onErrorCallback)

        const userList = users.list();
        let user
        if(_.isEmpty(userList)) {
            console.log("No identities found")
            // TODO: Prompt to restore an identity as alternative to creating a new one?
            const identity = await users.createIdentity()
            console.log("Created new identity")
            user = await users.authenticate(identity)
            console.log("Authenticated new user")
        } else {
            console.log("Loaded first user from browser storage")
            user = userList[0];
        }
        setSpaceUser(user)
        setSpaceStorage(new UserStorage(user))
    }

    useEffect(() => {
        initializeUser()
    }, [])


    return (
        // <UserContext.Provider value={spaceUser}>
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
                            <PixelEditor spaceUser={spaceUser} spaceStorage={spaceStorage} />
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
        // </UserContext.Provider>
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
