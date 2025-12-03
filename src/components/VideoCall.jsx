import { LiveKitRoom, VideoConference } from '@livekit/components-react'

const VideoCall = ({ token }) => {
  const WS_URL = import.meta.env.VITE_WS_URL

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col">
      <LiveKitRoom 
        token={token} 
        serverUrl={WS_URL} 
        connect={true} 
        video={{ simulcast: true, resolution: 'qvga', facingMode: 'user' }} 
        audio={true} // aktifin mic juga, optional
      >
        {/* Top bar */}
        <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
          <h1 className="font-bold text-lg">Video Call</h1>
        </div>

        {/* Video grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
          <VideoConference />
        </div>

        {/* Bottom info */}
        <div className="p-3 bg-gray-800 text-white text-center">
          <p className="text-sm">Gunakan tombol bawaan di video untuk mute/unmute dan leave</p>
        </div>
      </LiveKitRoom>
    </div>
  )
}

export default VideoCall
