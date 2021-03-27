import {useEffect, useState} from "react";
import _ from "lodash";
import {ethers} from "ethers";
import gashaponDetails from "./abis/Gashapon.json";
import generateImage from "./pixelImage";

function NftViewer() {
    const [collectionAddress, setCollectionAddress] = useState("")
    const [id, setId] = useState("")
    const [gashaponContract, setGashaponContract] = useState(null)
    const [collectionCid, setCollectionCid] = useState(null)
    const [collectionData, setCollectionData] = useState(null)
    const [assetData, setAssetData] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)

    // TODO: Load contract address from the factory contract using it's child index

    // TODO: Move this to a library contract to reduce repetition across scripts
    const ipfsGatewayUrl = (cid) => {
        return 'https://' + cid + '.ipfs.dweb.link/'
    }

    // TODO: Move this to a library contract to reduce repetition across scripts
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

    // TODO: Move this to a library contract to reduce repetition across scripts
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
                // mintPrice: await contractWithSigner.getMintPrice(),
                // difficulty1Target: await contractWithSigner.difficulty1Target(),
                // dnaBitLength: await contractWithSigner.dnaBitLength(),
                cidRoot: await contractWithSigner.cidRoot()
            }
            console.log("Contract data: ", data)
            setCollectionData(data)
        } catch (e) {
            console.log("ERROR: Using Gashapon contract: ", e.toString())
            return
        }

        // Fetch assets from IPFS gateway
        // TODO: Move this to a library contract to reduce repetition across scripts
        let jsonData
        try {
            const assetUrl = ipfsGatewayUrl(data.cidRoot)
            console.log("Fetching assets from IPFS with gateway url: ", assetUrl)
            let response = await fetch(assetUrl);
            if (response.ok) { // if HTTP-status is 200-299 get the response body
                jsonData = await response.json();
                setAssetData(jsonData)
                console.log("assetData: ", jsonData)
            } else {
                console.log("HTTP-Error: " + response.status);
            }
        } catch (e) {
            console.log("ERROR: Fetching data from IPFS gateway: ", e.toString())
            return
        }
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


    return (
        <div className="App nft-minter">
            <div className="App-container">
                <div className="nft-viewer-detail text-center">
                    {_.isNull(signer) && (
                        <>
                            <h1 className="text-center">NFT Viewer</h1>
                            <button onClick={handleConnectEthereum}>
                                Connect Wallet
                            </button>
                        </>
                    )}
                    {!_.isNull(signer) && (
                        <>
                            NFT Collection Contract Address:
                            <input name="collectionAddress" className="address" value={collectionAddress} onChange={e => setCollectionAddress(e.target.value)} />
                        </>
                    )}
                    {!_.isNull(collectionData) && (
                        <>
                            <h1 className="text-center">Collection: {collectionData.name} {collectionData.symbol}</h1>
                            Asset ID:
                            <input value={id} onChange={e => setId(e.target.value)} /><br />
                            {!_.isNull(assetData) && (
                                <>
                                    {/* TODO: Only display single generated image, this display of many images is just for testing */}
                                    <img src={generateImage(assetData.assets[0], 10, 0)} alt="" style={{border: "4px solid #eeeeee"}} />

                                    <img src={generateImage(assetData.assets[0], 10, 1)} alt="" style={{border: "4px solid #eeeeee"}} />
                                    <img src={generateImage(assetData.assets[0], 10, 2)} alt="" style={{border: "4px solid #eeeeee"}} />
                                    <img src={generateImage(assetData.assets[0], 10, 3)} alt="" style={{border: "4px solid #eeeeee"}} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            {!_.isNull(collectionData) && (
                <button onClick={() => setCollectionAddress("")}>Select a different NFT collection</button>
            )}

        </div>
    )
}

export default NftViewer
