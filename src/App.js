import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import swal from "sweetalert"

import { Gif } from "./components/Gif/Gif"
import { loadGifs } from "./features/program/program"
import callProgram from "./hooks/call.program"

import "./App.css"

const App = () => {
    // State
    const dispatch = useDispatch()
    const program = callProgram()
    const [walletAddress, setWalletAddress] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [gifList, setGifList] = useState([])
    //const gifList = useSelector((state) => state.counter.value)
    // Actions
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window

            if (solana) {
                if (solana.isPhantom) {
                    const response = await solana.connect({
                        onlyIfTrusted: true,
                    })
                    setWalletAddress(response.publicKey.toString())
                }
            } else {
                swal({
                    title: "Warning",
                    icon: "warning",
                    text: "Solana object not found! Get a Phantom Wallet 👻",
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const connectWallet = async () => {
        const { solana } = window
        if (solana) {
            const response = await solana.connect()
            setWalletAddress(response.publicKey.toString())
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

    const renderConnectedContainer = () => {
        // If we hit this, it means the program account hasn't been initialized.
        if (gifList === null) {
            return (
                <div className="connected-container">
                    <button
                        className="cta-button submit-gif-button"
                        onClick={program.createGifAccount()}
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
                    <div className="gifs-container">
                        {gifList.map((item, index) => (
                            <Gif
                                link={item.gifLink}
                                uploader={item.userAddress}
                                upVoters={item.upVoters}
                                downVoters={item.downVoters}
                                key={index}
                            ></Gif>
                        ))}
                    </div>
                </div>
            )
        }
    }

    const sendGif = async () => {
        await program.sendGif(inputValue)
        getGifList()
    }
    // UseEffects
    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected()
        }
        window.addEventListener("load", onLoad)
        return () => window.removeEventListener("load", onLoad)
    }, [])

    const getGifList = async () => {
        if (walletAddress) {
            setGifList(await program.getGifList())
        }
    }

    useEffect(() => {
        getGifList()
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
                    {walletAddress && renderConnectedContainer()}
                </div>
            </div>
        </div>
    )
}

export default App
