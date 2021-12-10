import {
    faArrowAltCircleDown,
    faArrowAltCircleUp,
    faCopy,
} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import swal from "sweetalert"

import callProgram from "../../hooks/call.program"

import "./Gif.css"

export const Gif = (props) => {
    const program = callProgram()
    let uploader = props.uploader.toString()

    const checkImage = (url) => {
        return url.includes(".gif")
    }

    const vote = async (link, uploader, direction) => {
        await program.voteGif(link, uploader, direction)
        window.location.reload()
    }

    const tip = (link, uploader) => {
        swal({
            icon: "warning",
            text: "This function is still under development, we'll keep you in touch !",
            title: "Ooops... !",
        })
    }
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
                        {props.upVoters.length})
                    </button>
                    <button
                        onClick={() => {
                            vote(props.link, props.uploader, "down")
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleDown} /> (
                        {props.downVoters.length})
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
