import _ from "lodash";
import {useState, useEffect} from "react";
import { ethers } from "ethers";
import gashaponFactoryAbi from "./abis/GashaponFactory.json";

function NftMinter() {
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [collectionCid, setCollectionCid] = useState(null)
    const [collectionAddress, setCollectionAddress] = useState(null)
    const [collectionData, setCollectionData] = useState(null)

    // TODO: Pull collection contract address from url if present, for easy linking

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

    useEffect(() => {
        // TODO: Fetch live collection data from smart contract to replace this SAMPLE DATA:
        setCollectionAddress("0xDEMO____DEMO____DEMO")
        setCollectionData({
            name: "Owl Punks",
            symbol: ":owl:",
            averageDifficulty: "16",
            nextPrice: "0.1 ETH",
        })
    }, [])


    return (
        <div className="App nft-minter">
            {_.isNull(signer) && (
                <header className="App-header">
                    <h1 className="text-center">NFT Minter</h1>
                    <button onClick={handleConnectEthereum}>
                        Connect to Ethereum
                    </button>
                </header>
            )}
            {!_.isNull(signer) && (
                <>
                    <h1 className="text-center">NFT Minter</h1>
                    {_.isNull(collectionAddress) && (
                        <>
                            NFT Collection Contract Address:
                            <input name="collectionAddressInput" />
                        </>
                    )}

                    {!_.isNull(collectionAddress) && (
                        <>
                            Collection name: {collectionData.name}<br />
                            Symbol: {collectionData.symbol}<br />
                            Avg Difficulty: {collectionData.averageDifficulty}<br />
                            Next Price: {collectionData.nextPrice}<br />

                            <button >
                                Search for NFTs
                            </button><br />

                            NFT Found!

                            <button >
                                Mint NFT
                            </button>
                        </>
                    )}

                </>
            )}
        </div>
    )
}

export default NftMinter
