import React from "react"
import "./Gif.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCopy,
    faArrowAltCircleDown,
    faArrowAltCircleUp,
} from "@fortawesome/free-regular-svg-icons"
const checkImage = (url) => {
    return url.includes(".gif")
}

const vote = (link, uploader, direction) => {}
const tip = (link, uploader) => {}

export const Gif = (props) => {
    let uploader = props.uploader.toString()
    console.log(uploader)
    if (checkImage(props.link)) {
        return (
            <div className="gif-container">
                <div className="gif">
                    <img className="gif-img" src={props.link} alt="" />
                </div>
                <div className="gif-infos">
                    <p className="gif-uploader">
                        {`${uploader.substr(0, 10)}...${uploader.substr(
                            uploader.length - 10,
                            uploader.length
                        )}`}
                        &nbsp;&nbsp;
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(uploader)
                            }
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </p>
                </div>
                <div className="gif-actions">
                    <button
                        onClick={() => {
                            vote(props.link, props.uploader, "up")
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleUp} /> (
                        {props.upVoters})
                    </button>
                    <button
                        onClick={() => {
                            vote(props.link, props.uploader, "down")
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleDown} /> (
                        {props.downVoters})
                    </button>
                    <button
                        onClick={() => {
                            tip(props.link, props.uploader)
                        }}
                    >
                        <img
                            src="./solana_logo.png"
                            alt="Solana logo"
                            width="15"
                        />
                    </button>
                </div>
            </div>
        )
    } else {
        return <span></span>
    }
}
