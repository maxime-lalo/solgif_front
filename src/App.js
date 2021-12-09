import { Program, Provider, web3 } from "@project-serum/anchor"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import React, { useEffect, useState } from "react"

import twitterLogo from "./assets/twitter-logo.svg"
import idl from "./idl.json"
import kp from "./keypair.json"

import "./App.css"

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address)

// Set our network to devnet.
const network = clusterApiUrl("devnet")

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
    preflightCommitment: "processed",
}

// Constants
const TWITTER_HANDLE = "_buildspace"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
    // State
    const [walletAddress, setWalletAddress] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [gifList, setGifList] = useState([])
    // Actions
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window

            if (solana) {
                if (solana.isPhantom) {
                    console.log("Phantom wallet found!")
                    const response = await solana.connect({
                        onlyIfTrusted: true,
                    })
                    console.log(
                        "Connected with Public Key:",
                        response.publicKey.toString()
                    )

                    /*
                     * Set the user's publicKey in state to be used later!
                     */
                    setWalletAddress(response.publicKey.toString())
                }
            } else {
                alert("Solana object not found! Get a Phantom Wallet 👻")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const connectWallet = async () => {
        const { solana } = window

        if (solana) {
            const response = await solana.connect()
            console.log(
                "Connected with Public Key:",
                response.publicKey.toString()
            )
            setWalletAddress(response.publicKey.toString())
        }
    }

    const sendGif = async () => {
        if (inputValue.length === 0) {
            console.log("No gif link given!")
            return
        }
        setInputValue("")
        console.log("Gif link:", inputValue)
        try {
            const provider = getProvider()
            const program = new Program(idl, programID, provider)

            await program.rpc.addGif(inputValue, {
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                },
            })
            console.log("GIF successfully sent to program", inputValue)

            await getGifList()
        } catch (error) {
            console.log("Error sending GIF:", error)
        }
    }

    const renderNotConnectedContainer = () => (
        <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
        >
            Connect to Wallet
        </button>
    )

    const onInputChange = (event) => {
        const { value } = event.target
        setInputValue(value)
    }

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment)
        const provider = new Provider(
            connection,
            window.solana,
            opts.preflightCommitment
        )
        return provider
    }

    const checkImage = (url) => {
        return url.includes(".gif")
    }

    const renderConnectedContainer = () => {
        // If we hit this, it means the program account hasn't been initialized.
        if (gifList === null) {
            return (
                <div className="connected-container">
                    <button
                        className="cta-button submit-gif-button"
                        onClick={createGifAccount}
                    >
                        Do One-Time Initialization For GIF Program Account
                    </button>
                </div>
            )
        }
        // Otherwise, we're good! Account exists. User can submit GIFs.
        else {
            return (
                <div className="connected-container">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            sendGif()
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter gif link!"
                            value={inputValue}
                            onChange={onInputChange}
                        />
                        <button
                            type="submit"
                            className="cta-button submit-gif-button"
                        >
                            Submit
                        </button>
                    </form>
                    <div className="gif-grid">
                        {gifList.map(
                            (item, index) =>
                                checkImage(item.gifLink) && (
                                    <div className="gif-item" key={index}>
                                        <img src={item.gifLink} alt="" />
                                        <span style={{ color: "white" }}>
                                            {item.userAddress.toString()}
                                        </span>
                                    </div>
                                )
                        )}
                    </div>
                </div>
            )
        }
    }

    // UseEffects
    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected()
        }
        window.addEventListener("load", onLoad)
        return () => window.removeEventListener("load", onLoad)
    }, [])

    const createGifAccount = async () => {
        try {
            const provider = getProvider()
            const program = new Program(idl, programID, provider)
            console.log("ping")
            await program.rpc.startStuffOff({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [baseAccount],
            })
            console.log(
                "Created a new BaseAccount w/ address:",
                baseAccount.publicKey.toString()
            )
            await getGifList()
        } catch (error) {
            console.log("Error creating BaseAccount account:", error)
        }
    }

    const getGifList = async () => {
        try {
            const provider = getProvider()
            const program = new Program(idl, programID, provider)
            const account = await program.account.baseAccount.fetch(
                baseAccount.publicKey
            )

            console.log("Got the account", account)
            setGifList(account.gifList)
        } catch (error) {
            console.log("Error in getGifList: ", error)
            setGifList(null)
        }
    }

    useEffect(() => {
        if (walletAddress) {
            console.log("Fetching GIF list...")
            getGifList()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress])

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">🌀 Max's GIF Portal 🌀</p>
                    <p className="sub-text">
                        Add your own Netflix gif to our collection !
                    </p>
                    {!walletAddress && renderNotConnectedContainer()}
                    {/* We just need to add the inverse here! */}
                    {walletAddress && renderConnectedContainer()}
                </div>
                <div className="footer-container">
                    <img
                        alt="Twitter Logo"
                        className="twitter-logo"
                        src={twitterLogo}
                    />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    )
}

export default App
