import { Avatar } from "@material-ui/core"
import React, { useEffect, useRef } from "react"
import "./Post.css"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import NearMeIcon from "@material-ui/icons/NearMe"
import moment from "moment"
import { LINKEDIN_URL, popupWindow, receiveLinkedInMessage } from "../actions"

function Post(feed) {
  const { profilePic, url, username, timestamp, message, type } = feed
  const popup = useRef()
  
  useEffect(() => {
    return () => {
      window.removeEventListener('message', (props) => {receiveLinkedInMessage({...props, popup: popup.current, feed: feed})})
    }
  }, [feed])

  const signInWithLinkedin = () => {
    window.addEventListener('message', (props) => {receiveLinkedInMessage({...props, popup: popup.current})})
    popup.current = popupWindow(
      LINKEDIN_URL,
      '_blank',
      window,
      0.6 * window.innerWidth,
      0.8 * window.innerHeight
    )
  }

  return (
    <div className="post" style={{width: 600}}>
      <div className="post__top">
        <Avatar src={profilePic} className="post__avatar" />
        <div className="post__topInfo">
          <h3>{username}</h3>
          <p>{moment(timestamp).format("DD MM YYYY a MM:SS")}</p>
        </div>
      </div>

      <div className="post__bottom">
        <p>{message}</p>
      </div>

      <div className="post__image">
        {type === "image" ? (
          <img src={url} alt="" />
        ) : (
          <video controls  style={{width: 600}}>
            <source src={url} type="video/mp4"/>
            Sorry, your browser doesn't support embedded videos.
          </video>
        )}
      </div>

      <div className="post__options">
        <div className="post__option">
          <ThumbUpIcon />
          <p>Like</p>
        </div>
        <div className="post__option">
          <ChatBubbleOutlineIcon />
          <p>Comment</p>
        </div>
        <div className="post__option" onClick={signInWithLinkedin}>
          <NearMeIcon />
          <p>Share</p>
        </div>
      </div>
    </div>
  )
}

export default Post
