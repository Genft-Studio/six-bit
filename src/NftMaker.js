import _ from "lodash";
import {useState, useEffect} from "react";
import {NFTStorage} from "nft.storage";
import { ethers } from "ethers";
import gashaponFactoryAbi from "./abis/GashaponFactory.json"
import {OverlayTrigger, Popover} from "react-bootstrap";

// TODO: Keep GashaponFactory.json up to date, copy from build/contracts/...

function NftMaker() {
    const gashaponFactoryAddress = ""  // TODO: Fill this in!
    const localStorageKey = "saved-art"
    const nftStorageKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnaXRodWJ8MTU5NzUxIiwiaXNzIjoibmZ0LXN0b3JhZ2UiLCJpYXQiOjE2MTYxODI3MTI2ODUsIm5hbWUiOiJTSVgtQklUIn0.zqSNtZNehlfluFHVtRipupGOnoq_09Lg2w6dIe9ec2Q"
    const [savedArt, setSavedArt] = useState([])
    const [nftStorageClient, setNftStorageClient] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [gashaponFactoryContract, setGashaponFactoryContract] = useState(null)
    const [selectedArt, setSelectedArt] = useState([])
    const [launchStatus, setLaunchStatus] = useState("")
    const [collectionCid, setCollectionCid] = useState(null)

    const handleToggleArt = (e, index) => {
        console.log("Request to toggle art: ", e.target.checked, index)
        const art = savedArt[index]
        console.log("art: ", art)
        let selectedArtTmp
        if(e.target.checked) {
            selectedArtTmp = _.uniq([index, ...selectedArt])
            console.log("selectedArtTmp", selectedArtTmp)
        } else {
            selectedArtTmp = [...selectedArt]
            _.remove(selectedArtTmp, (n) => {return n == index})
            console.log("selectedArtTmp", selectedArtTmp)
        }
        setSelectedArt(selectedArtTmp)
    }

    const handleConnectEthereum = async () => {
        console.log("Request to connect to Ethereum")

        let newProvider
        let newSigner
        try {
            await window.ethereum.enable()
            newProvider = new ethers.providers.Web3Provider(window.ethereum);
            console.log("provider:", newProvider)
            setProvider(newProvider)
            newSigner = newProvider.getSigner();
            console.log("signer:", newSigner)
            setSigner(newSigner)

            // Sanity check
            const blockNumber = await newProvider.getBlockNumber()
            console.log("blockNumber:", blockNumber)
            const myAddress = await newSigner.getAddress()
            console.log("myAddress:", myAddress)
        } catch (e) {
            console.log("ERROR: Connecting to Ethereum wallet: ", e.toString())
            return
        }

        console.log("abi", gashaponFactoryAbi)

        try {
            // Setup Gashapon Factory contract model
            // TODO: Enable/test this with a deployed contract:
            // TODO: Note: gashaponFactoryAbi should maybe be gashaponFactoryAbi.abi here, but that
            //       causes errors at the moment (pre-contract deployment)
            const contract = new ethers.Contract(gashaponFactoryAddress, gashaponFactoryAbi, newProvider)
            setGashaponFactoryContract(contract)
            contract.connect(newSigner)
        } catch (e) {
            console.log("ERROR: Using GashaponFactory contract: ", e.toString())
            return
        }
    }

    const handleLaunchCollection = async () => {
        console.log("Request to launch collection")
        setLaunchStatus("uploading")
        let directoryData = []
        // TODO: uploaded png files don't seem to be rendered correctly, just seeing white squares, investigate...
        selectedArt.map((index) => {
            console.log("index", index)
            directoryData.push(new File([savedArt[index].data], "data/"+index+".txt"))
            directoryData.push(new File([savedArt[index].png], "png/"+index+".png"))
        })

        let cid
        try {
            cid = await nftStorageClient.storeDirectory(directoryData)
            console.log(cid)
            console.log("Assets stored at: " + ipfsGatewayUrl(cid))
        } catch (e) {
            console.log("ERROR: Problem uploading to nft.storage: ", e.toString())
            setLaunchStatus("error")
            return
        }

        setLaunchStatus("upload-complete")
        setCollectionCid(cid)

        // TODO: Initiate transaction to Gashapon Factory to create a new Gashapon contract
        // TODO: Include IPFS cid for collection of assets
    }

    const ipfsGatewayUrl = (cid) => {
        return 'https://' + cid + '.ipfs.dweb.link/'
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

    const todoPopover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Not implemented</Popover.Title>
            <Popover.Content>
                We haven't been able to implement this feature yet. 😿
            </Popover.Content>
        </Popover>
    )

    return (
        <div className="App nft-maker">

            {_.isNull(signer) && (
                <header className="App-header">
                    <h1 className="text-center">NFT Factory</h1>
                    <button onClick={handleConnectEthereum}>
                        Connect Wallet
                    </button>
                </header>
            )}
            {!_.isNull(signer) && (
                <>
                    <h1 className="text-center">NFT Factory</h1>
                    <div className="file-directory">
                        {!_.isEmpty(savedArt) && (
                            <>

                                <h3>Select Designs:</h3>
                                <ul>
                                    {savedArt.map((art, index) => {
                                        const cid = art.cid
                                        return (
                                            <li key={index + cid}>
                                                <input type="checkbox" name={cid} id={cid} onChange={e => handleToggleArt(e, index)} />
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

                                <h3>Starting Price (ETH):</h3>
                                <input name="initialPrice" defaultValue={0.01} />

                                <h3>Minimum Difficulty Bits:</h3>
                                <input name="minimumDifficultyBits" type="number" defaultValue={16} />

                                <h3>Dna Bit Length:</h3>
                                <input name="dnaBitLength" type="number" />

                                <br />

                                <button onClick={handleLaunchCollection}>
                                    Launch NFT Collection
                                </button>
                                {launchStatus === "uploading" && (
                                    <p>Storing art assets on IPFS...</p>
                                )}
                                {launchStatus === "upload-complete" && (
                                    <p>Initiating Ethereum transaction...</p>
                                )}
                                {launchStatus === "error" && (
                                    <p>ERROR</p>
                                )}
                                {!_.isNull(collectionCid) && (
                                    <a href={ipfsGatewayUrl(collectionCid)} target="_blank">IPFS Archive</a>
                                )}
                                <div className='shillzone'>
                                    <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                        <button>
                                            Offer collection through a vending machine in Decentraland
                                        </button>
                                    </OverlayTrigger>
                                    <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                        <button>
                                            Add an ENS domain
                                        </button>
                                    </OverlayTrigger>
                                    <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                        <button>
                                            Deploy DAPP to IPFS
                                        </button>
                                    </OverlayTrigger>
                                </div>
                            </>
                        )}

                    </div>
                </>
            )}
        </div>
    )
}

export default NftMaker