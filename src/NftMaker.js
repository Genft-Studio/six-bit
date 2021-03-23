import _ from "lodash";
import {useState, useEffect} from "react";
import {NFTStorage} from "nft.storage";
import { ethers } from "ethers";
import gashaponFactoryDetails from "./abis/GashaponFactory.json"
import {OverlayTrigger, Popover} from "react-bootstrap";

// TODO: Keep GashaponFactory.json up to date, copy from build/contracts/...

function NftMaker() {
    // const gashaponFactoryAddress = ""  // TODO: Fill this in!
    const gashaponFactoryAddress = "0x0B1Aa0B38694D39FE293D3e210A6eb955e237786"  // TODO: LOCAL DEV SERVER ADDRESS - Replace this with deployed address
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

    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [initialPrice, setInitialPrice] = useState("0.01")
    const [minimumDifficulty, setMinimumDifficulty] = useState("16")
    const [dnaBitLength, setDnaBitLength] = useState("4")
    const [priceIncreasePercentage, setPriceIncreasePercentage] = useState("0")
    const [cidRoot, setCidRoot] = useState("")

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

        console.log("abi", gashaponFactoryDetails.abi)

        try {
            // Setup Gashapon Factory contract model
            const contract = new ethers.Contract(gashaponFactoryAddress, gashaponFactoryDetails.abi, newProvider)
            const contractWithSigner = contract.connect(newSigner)
            setGashaponFactoryContract(contractWithSigner)
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
            // console.log("index", index)
            directoryData.push(new File([savedArt[index].data], "data/"+index+".txt"))
            directoryData.push(new File([savedArt[index].png], "png/"+index+".png"))
        })

        let cid
        try {
            cid = await nftStorageClient.storeDirectory(directoryData)
            setCidRoot(cid)
            console.log("cid: ", cid)
            console.log("Assets stored at: " + ipfsGatewayUrl(cid))
        } catch (e) {
            console.log("ERROR: Problem uploading to nft.storage: ", e.toString())
            setLaunchStatus("error")
            return
        }

        setLaunchStatus("upload-complete")
        setCollectionCid(cid)

        const signerAddress = await signer.getAddress();

        // Setup event listener for child contract creation
        gashaponFactoryContract.on("GashaponCreated", async (from, child, event) => {
            console.log("GashaponCreated event received")
            // console.log("- From: ", from)
            // console.log("  [me]: ", signerAddress)
            if(from === signerAddress) {
                console.log("Detected creation of new Gashapon child contract by current user: ", child)

                // Save record of created contract
                const localStorageMintersKey = "minters"

                let minters = JSON.parse(localStorage.getItem(localStorageMintersKey))
                if(_.isNull(minters) || !_.isArray(minters)) {
                    minters = []
                }

                if(!_.find(minters, {address: child})) {
                    console.log("Saving new minter data to localStorage")
                    minters.push({tokenName: tokenName, address: child})
                } else {
                    console.log("Minter data already present in localStorage")
                }

                // const mintersTmp = [{tokenName: tokenName, address: child}]
                localStorage.setItem(localStorageMintersKey, JSON.stringify(minters))

            }
        })

        // Initiate transaction to Gashapon Factory to create a new Gashapon contract
        // Include IPFS cid for collection of assets
        // TODO: Parameter validation
        try {
            const result = await gashaponFactoryContract.createChild(
                tokenName,
                tokenSymbol,
                minimumDifficulty,
                dnaBitLength,
                ethers.utils.parseEther(initialPrice),
                priceIncreasePercentage,
                cid,
            )
        } catch (e) {
            console.log("ERROR: Problem running createChild on factory contract: ", e.toString())
        }
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
                                <input name="collectionName" value={tokenName} onChange={e => setTokenName(e.target.value)} />

                                <h3>Token Symbol:</h3>
                                <input name="tokenSymbol" value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value)} />

                                <h3>Starting Price (ETH):</h3>
                                <input name="initialPrice" value={initialPrice} onChange={e => setInitialPrice(e.target.value)} />

                                <h3>Minimum Difficulty Bits:</h3>
                                <input name="minimumDifficulty" type="number" value={minimumDifficulty} onChange={e => setMinimumDifficulty(e.target.value)} />

                                <h3>Dna Bit Length:</h3>
                                <input name="dnaBitLength" type="number" value={dnaBitLength} onChange={e => setDnaBitLength(e.target.value)} />

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
                                    <a href={ipfsGatewayUrl(collectionCid)} target="_blank" rel="noreferrer">IPFS Archive</a>
                                )}

                                {/* TODO: Something about the shillzone section generates a console warning about findDomNode being deprecated in StrictMode */}
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
                                            Deploy minter DAPP to IPFS
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