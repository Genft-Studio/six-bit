import _ from "lodash";
import {Fragment, useState, useEffect} from "react";
import {ethers} from "ethers";
import gashaponFactoryAbi from "./abis/GashaponFactory.json";
import {Popover, OverlayTrigger} from 'react-bootstrap'

function NftMinter() {
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [collectionCid, setCollectionCid] = useState(null)
    const [collectionAddress, setCollectionAddress] = useState(null)
    const [collectionData, setCollectionData] = useState(null)
    const [minted, setMinted] = useState(false)
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
            {_.isNull(signer) && (
                <header className="App-header">
                    <h1 className="text-center">NFT Minter</h1>
                    <button onClick={handleConnectEthereum}>
                        Connect Wallet
                    </button>
                </header>
            )}
            {!_.isNull(signer) && (
                <>
                    <h1 className="text-center">NFT Minter</h1>
                    <div className="nft-minter-detail text-center">
                        {_.isNull(collectionAddress) && (
                            <>
                                NFT Collection Contract Address:
                                <input name="collectionAddressInput"/>
                            </>
                        )}

                        {!_.isNull(collectionAddress) && (
                            <>
                                Collection name: {collectionData.name}<br/>
                                Symbol: {collectionData.symbol}<br/>
                                Avg Difficulty: {collectionData.averageDifficulty}<br/>
                                Next Price: {collectionData.nextPrice}<br/>

                                <button>
                                    Search for NFTs
                                </button>
                                <br/>

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
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </>
            )}
        </div>
    )
}

export default NftMinter
