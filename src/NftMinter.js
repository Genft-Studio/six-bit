import _ from "lodash";
import {Fragment, useState, useEffect} from "react";
import {ethers} from "ethers";
import gashaponFactoryAbi from "./abis/GashaponFactory.json";
import {Popover, OverlayTrigger} from 'react-bootstrap'
import gashaponDetails from "./abis/Gashapon.json";
import mine from "./mine-worker.mjs";
import './glitch.css'
// import pixelArtParser from "./pixelImage";
import generateImage from "./pixelImage";
import pixelImage from "./pixelImage";

// TODO: Keep ./abis/Gashapon.json up to date, copy from ../build/contracts/...

function NftMinter() {
    const localStorageMintersKey = "minters"
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [collectionCid, setCollectionCid] = useState(null)
    const [collectionAddress, setCollectionAddress] = useState("")
    const [collectionData, setCollectionData] = useState(null)
    const [minted, setMinted] = useState(false)
    const [myMinters, setMyMinters] = useState([])
    const [gashaponContract, setGashaponContract] = useState(null)
    const [assetData, setAssetData] = useState(null)

    // TODO: Pull collection contract address from url if present, for easy linking

    const abbreviateAddress = (address) => {
        if(address.length > 24) {
            return address.substr(0, 12) + "..." + address.substr(address.length-12)
        }
        return address
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
    }

    const handleSearch = async () => {
        // TODO: Get this working, failing with "Buffer not defined" error
        /*
        const testAddress = '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'
        let result = mine('$OWL', 16, 32, testAddress)
        console.log('seed:', result.seed.toString('hex'))
        console.log('hash:', result.hash.toString('hex'))
        console.log('dna:', result.dna.toString('hex'))
        console.log('address:', '0x534Eb19E729E955308e5A9c37c90d4128e0F450F'.slice(2))
        console.log('difficulty bits:', 16)
        console.log('dna bits:', 32)
        console.log('salt: $OWL')
        */

        // TODO: This is just for testing image rendering:
        // const imageArray = assetData[0];
        // const imageTmp = pixelArtParser.generateImage(imageArray)
    }

    useEffect(() => {
        let myMintersTmp = JSON.parse(localStorage.getItem(localStorageMintersKey))
        if(_.isNull(myMintersTmp) || !_.isArray(myMintersTmp)) {
            myMintersTmp = []
        }
        setMyMinters(myMintersTmp)


        // TODO: Fetch live collection data from smart contract to replace this SAMPLE DATA:
        /*
        setCollectionAddress("0xDEMO____DEMO____DEMO")
        setCollectionData({
            name: "Owl Punks",
            symbol: ":owl:",
            averageDifficulty: "16",
            nextPrice: "0.1 ETH",
        })
         */
    }, [])

    const loadCollection = async (address) => {
        console.log("Loading collection: ", address)

        let data
        try {
            // Setup Gashapon contract model
            const contract = new ethers.Contract(address, gashaponDetails.abi, provider)
            const contractWithSigner = contract.connect(signer)
            setGashaponContract(contractWithSigner)

            // Fetch data from contract
            data = {
                name: await contractWithSigner.name(),
                symbol: await contractWithSigner.symbol(),
                artistAddress: await contractWithSigner.artistAddress(),
                // nextPrice: await contractWithSigner.nextPrice(),
                mintPrice: await contractWithSigner.getMintPrice(),
                difficulty1Target: await contractWithSigner.difficulty1Target(),
                // totalDifficulty: await contractWithSigner.totalDifficulty(),
                dnaBitLength: await contractWithSigner.dnaBitLength(),
                cidRoot: await contractWithSigner.cidRoot()
            }
            console.log("Contract data: ", data)
            setCollectionData(data)
        } catch (e) {
            console.log("ERROR: Using Gashapon contract: ", e.toString())
            return
        }

        // Fetch assets from IPFS gateway
        let json
        try {
            const assetUrl = ipfsGatewayUrl(data.cidRoot)
            console.log("Fetching assets from IPFS with gateway url: ", assetUrl)
            let response = await fetch(assetUrl);
            if (response.ok) { // if HTTP-status is 200-299 get the response body
                json = await response.json();
                setAssetData(json)
                console.log("assetData: ", json)
            } else {
                console.log("HTTP-Error: " + response.status);
            }
        } catch (e) {
            console.log("ERROR: Fetching data from IPFS gateway: ", e.toString())
            return
        }
    }

    const handleDeselectCollection = () => {
        setCollectionAddress("")
    }

    useEffect(() => {
        if(!ethers.utils.isAddress(collectionAddress)) {
            if(!_.isNull(collectionData)) {
                // Unload collection data if the address is changed to something invalid
                setCollectionData(null)
            }
        } else {
            // Address is valid
            console.log("Address successfully validated")
            // TODO: Load collection data
            loadCollection(collectionAddress)
        }
    }, [collectionAddress])

    const ipfsGatewayUrl = (cid) => {
        return 'https://' + cid + '.ipfs.dweb.link/'
    }

    const todoPopover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Not implemented</Popover.Title>
            <Popover.Content>
                We haven't been able to implement this feature yet. 😿
            </Popover.Content>
        </Popover>
    )


    return (
        <div className="App nft-minter">
            <div className="App-container">
            {_.isNull(signer) && (
                <>
                    <h1 className="text-center">NFT Minter</h1>
                    <button onClick={handleConnectEthereum}>
                        Connect Wallet
                    </button>
                </>
            )}
            {!_.isNull(signer) && (
                <>
                    <h1 className="text-center">NFT Minter</h1>
                    <div className="nft-minter-detail text-center">
                        {_.isNull(collectionData) && (
                            <>
                                {!_.isEmpty(myMinters) && (
                                    <>
                                        Saved Collections:<br />
                                        <select value={collectionAddress} onChange={e => {
                                            setCollectionAddress(e.target.value)
                                        }}>
                                            <option>Select Collection:</option>
                                        {myMinters.map((minter, index) => {
                                            return (
                                                <option value={minter.address} key={index}>
                                                    {minter.tokenName} - {abbreviateAddress(minter.address)}
                                                </option>
                                            )
                                        })}
                                        </select><br />
                                    </>
                                )}
                                NFT Collection Contract Address:
                                <input name="collectionAddress" className="address" value={collectionAddress} onChange={e => setCollectionAddress(e.target.value)} />
                            </>
                        )}


                        {!_.isNull(collectionData) && (
                            <>
                                <h3 className="text-center">NFT Collection:</h3>
                                <h1 className="text-center">"{collectionData.name}"</h1>

                                <button onClick={handleSearch}>
                                    Search for {collectionData.symbol} NFTs
                                </button>
                                <br/>

                                {!_.isNull(assetData) && !_.isEmpty(assetData.assets) && (
                                    <>
                                        {assetData.assets.map((assetString, index) => {
                                            return (
                                                <img src={generateImage(assetString, 2)} alt="" style={{border: "4px solid #eeeeee"}} />
                                            )
                                        })}
                                    </>
                                )}

                                <h3 className="text-center">Next Mint Price: {ethers.utils.formatEther(collectionData.mintPrice)} ETH</h3>
                                <strong>Symbol: <strong>{collectionData.symbol}</strong></strong><br/>
                                Artist: {collectionData.artistAddress}<br />
                                {/*Total Difficulty: {collectionData.totalDifficulty.toString()}<br/>*/}
                                DNA Bit Length: {collectionData.dnaBitLength.toString()}<br />
                                Difficulty Target: {collectionData.difficulty1Target.toString()}<br/>
                                IPFS CID Root: <a href={ipfsGatewayUrl(collectionData.cidRoot)} target="_blank">{collectionData.cidRoot}</a><br />
                                Contract: <a href={"https://etherscan.io/address/" + collectionAddress} target="_blank">{collectionAddress}</a><br />

                                {!_.isNull(assetData) && (
                                    <>
                                        <h2 className="text-center">Genome Data:</h2>
                                        <div className="ascii-asset-preview">
                                            {assetData.assets.map((asset, index) => {
                                                return (
                                                    <div key={index} style={{backgroundImage: "url(" + generateImage(asset, 6) + ")"}}>
                                                        <pre className="XXXglitch" datatext={asset}>
                                                            {asset}
                                                        </pre>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                )}

                                NFT Found!
                                <button onClick={()=>setMinted(true)} disabled={minted}>
                                    Mint NFT
                                </button>

                                {minted && (
                                    <div className='shillzone'>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                            <button>
                                                Burn and earn
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                            <button>
                                                Sell on Raribles
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                            <button>
                                                Sell on SuperRare
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                            <button>
                                                Add to NTFX
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                            <button>
                                                Offer shares on NIFTEX
                                            </button>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" placement="bottom" overlay={todoPopover}>
                                            <button>
                                                Display in Decentraland
                                            </button>
                                        </OverlayTrigger>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </>
            )}
            </div>
            {!_.isNull(collectionData) && (
                <button onClick={handleDeselectCollection}>Select a different NFT collection</button>
            )}

        </div>
    )
}

export default NftMinter
