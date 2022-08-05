import React from 'react'
import "./Feed.css"
import posts from "../mock/mock"
import Post from './Post'

function Feed() {
    return (
        <div className="feed">
            {posts.map((post, index) => (
                <Post
                    key={`${post.id}` + index}
                    profilePic={post.profilePic}
                    message={post.message}
                    timestamp={post.updated_at}
                    username={post.creator}
                    url={post.url}
                    type={post.type}
                />
            ))}

        </div>
    )
}

export default Feed