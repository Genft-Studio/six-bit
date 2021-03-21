import _ from "lodash";
import {useState, useEffect} from "react";
import {NFTStorage} from "nft.storage";
import { ethers } from "ethers";

function NftMaker() {
    const gashaponAddress = ""  // TODO: Fill this in!
    const gashaponAbi = []  // TODO: Fill this in!
    const localStorageKey = "saved-art"
    const nftStorageKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaXRodWJ8MTU5NzUxIiwiaXNzIjoibmZ0LXN0b3JhZ2UiLCJpYXQiOjE2MTYxODI3MTI2ODUsIm5hbWUiOiJTSVgtQklUIn0.zqSNtZNehlfluFHVtRipupGOnoq_09Lg2w6dIe9ec2Q"
    const [savedArt, setSavedArt] = useState([])
    const [nftStorageClient, setNftStorageClient] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [gashaponContract, setGashaponContract] = useState(null)

    const handleOpenFile = (cid) => {
        console.log("Request to open file: ", cid)
        // TODO: ?
    }

    const handleConnectEthereum = async () => {
        console.log("Request to connect to Ethereum")

        try {
            await window.ethereum.enable()
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            console.log("provider:", newProvider)
            setProvider(newProvider)
            const newSigner = newProvider.getSigner();
            console.log("signer:", newSigner)
            setSigner(newSigner)

            // Sanity check
            const blockNumber = await newProvider.getBlockNumber()
            console.log("blockNumber:", blockNumber)
            const myAddress = await newSigner.getAddress()
            console.log("myAddress:", myAddress)

            // Setup Gashapon contract model
            // const contract = new ethers.Contract(gashaponAddress, gashaponAbi, newProvider)  // TODO: Enable this
        } catch (e) {
            console.log("ERROR: Connecting to Ethereum wallet: ", e.toString())
        }
    }

    const handleLaunchCollection = async () => {
        console.log("Request to launch collection")

        // TODO: Store art assets and metadata on IPFS using nft.storage

        // TODO: Initiate transaction to Gashapon Factory to create a new Gashapon contract
    }

    // Run once after page fully loads
    useEffect(() => {
        // Initialize nft.storage client
        const client = new NFTStorage({ token: nftStorageKey })
        setNftStorageClient(client)

        let savedArtTmp = JSON.parse(localStorage.getItem(localStorageKey));
        console.log("savedArtTmp:", savedArtTmp)
        if (!_.isEmpty(savedArtTmp)) {
            setSavedArt(savedArtTmp)
        }
    }, [])

    return (
        <div className="App nft-maker">

            {_.isNull(signer) && (
            <header className="App-header">
                <h1 className="text-center">NFT Maker</h1>
                <button onClick={handleConnectEthereum}>
                    Connect to Ethereum
                </button>
            </header>
            )}
            {!_.isNull(signer) && (
                <>
                    <h1 className="text-center">NFT Maker</h1>
                    <div className="file-directory">
                        {!_.isEmpty(savedArt) && (
                            <>

                                <h3>Select Designs:</h3>
                                <ul>
                                    {savedArt.map((art, index) => {
                                        const cid = art.cid
                                        return (
                                            <li key={index + cid} onClick={() => {handleOpenFile(cid)}}>
                                                <input type="checkbox" name={cid} id={cid} />
                                                <label htmlFor={cid}>
                                                    {/*{cid.substring(0,23)}.....{cid.substring(cid.length-23, cid.length)}<br />*/}
                                                    <img src={art.png} alt="" width="50px" />
                                                </label>
                                            </li>
                                        )
                                    })}
                                </ul>


                                <h3>Name Collection:</h3>
                                <input name="collection" />

                                <h3>Token Symbol:</h3>
                                <input name="tokenSymbol" />

                                <h3>Minimum Difficulty Bits:</h3>
                                <input name="minimumDifficultyBits" type="number" />

                                <h3>Dna Bit Length:</h3>
                                <input name="dnaBitLength" type="number" />

                                <br />

                                <button onClick={handleLaunchCollection}>
                                    Launch NFT Collection
                                </button>

                            </>
                        )}

                    </div>
                </>
            )}
        </div>
    )
}

export default NftMaker