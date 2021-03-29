import {useEffect, useState} from "react";
import _ from "lodash";
import {ethers} from "ethers";
import gashaponDetails from "./abis/Gashapon.json";
// import generateImage from "./pixelImage";
import {gashaponParser, gashaponImage} from "./pixelImage";

function NftViewer() {
    const [collectionAddress, setCollectionAddress] = useState("")
    const [dna, setDna] = useState("")
    const [gashaponContract, setGashaponContract] = useState(null)
    const [collectionCid, setCollectionCid] = useState(null)
    const [collectionData, setCollectionData] = useState(null)
    const [genome, setGenome] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [imageData, setImageData] = useState(null)

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
            console.log("Fetching genome from IPFS with gateway url: ", assetUrl)
            let response = await fetch(assetUrl);
            if (response.ok) { // if HTTP-status is 200-299 get the response body
                jsonData = await response.json();
                setGenome(jsonData)
                console.log("genome: ", jsonData)
            } else {
                console.log("HTTP-Error: " + response.status);
            }
        } catch (e) {
            console.log("ERROR: Fetching genome from IPFS gateway: ", e.toString())
            return
        }
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }

    useEffect(() => {
        try {
            /*
            const processedDna = gashaponParser(dna, genome)
            console.log("processedDna: ", processedDna)
            // TODO: Probably generateImage
            const imageDataResult = generateImage(processedDna, 10, 0)
            console.log("imageData: ", imageDataResult)
            setImageData(imageDataResult)
             */

            const gashapon = gashaponParser(dna, genome)

            console.log("gashaponParser result: ", gashapon)


        } catch (e) {
            console.log("ERROR: Running gashaponParser: ", e.toString())
            setImageData(null)
        }
    }, [dna])

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

    // For testing purposes
    const randomDna = () => {
        // 5 Byte DNA
        const bytes = 5
        const max = 256 ** bytes
        const randomInt = getRandomInt(max)
        const hexString = _.padStart(randomInt.toString(16), bytes * 2, 0)
        setDna("0x" + hexString)

    }

    const handleRandomDna = () => {
        randomDna()
    }

    useEffect(() => {
        randomDna()
    }, [])

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
                            DNA:
                            <input value={dna} onChange={e => setDna(e.target.value)} />
                            <button onClick={handleRandomDna}>
                                Random
                            </button>
                            <br />
                            {!_.isNull(genome) && (
                                <>
                                    {/* TODO: Only display single generated image, this display of many images is just for testing */}
                                    {/*<img src={generateImage(genome.assets[0], 10, 0)} alt="" style={{border: "4px solid #eeeeee"}} />*/}
                                    {/*<img src={generateImage(genome.assets[0], 10, 1)} alt="" style={{border: "4px solid #eeeeee"}} />*/}
                                    {/*<img src={generateImage(genome.assets[0], 10, 2)} alt="" style={{border: "4px solid #eeeeee"}} />*/}
                                    {/*<img src={generateImage(genome.assets[0], 10, 3)} alt="" style={{border: "4px solid #eeeeee"}} />*/}
                                    <img src={gashaponImage(gashaponParser(dna, genome))} alt="" style={{border: "4px solid #ffdddd"}} />
                                </>
                            )}
                            {!_.isNull(imageData) && (
                                <img src={imageData} alt="" style={{border: "4px solid #eeeeee"}} />
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
