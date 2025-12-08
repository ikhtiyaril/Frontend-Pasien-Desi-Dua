import React from 'react'
import { useLocation } from 'react-router-dom'
import VideoCall from '../components/videoCall'

const VideoCallPages = () => {
  const location = useLocation()
  const { tokenRoom } = location.state || {} // ambil tokenRoom

  return (
    <VideoCall tokenRoom={tokenRoom}/>
  )
}

export default VideoCallPages
