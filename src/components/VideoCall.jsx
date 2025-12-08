'use client';

import {
  LiveKitRoom,
  ParticipantName,
  TrackMutedIndicator,
  RoomAudioRenderer,
  isTrackReference,
  useConnectionQualityIndicator,
  VideoTrack,
  ControlBar,
  GridLayout,
  useTracks,
  TrackRefContext,
} from '@livekit/components-react';
import { Room, Track, ConnectionQuality } from 'livekit-client';
import { useState } from 'react';
import myStyles from '../styles/Costumize.module.css'

const VideoCall = ({ tokenRoom }) => {
  const WS_URL = import.meta.env.VITE_WS_URL || '';
  const [room] = useState(new Room());
  const [connect, setConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setConnect(false);
    setIsConnected(false);
  };

  if (!tokenRoom) {
    return <p className="text-center mt-10 text-red-500">Token tidak tersedia!</p>;
  }

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col" data-lk-theme="default">
      <main className="flex-1 flex flex-col items-center justify-start p-4">
        {!isConnected && (
          <button
            className="mb-4 px-4 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
            onClick={() => setConnect(!connect)}
          >
            {connect ? 'Disconnect' : 'Connect'}
          </button>
        )}

        <LiveKitRoom
          room={room}
          token={tokenRoom}
          serverUrl={WS_URL}
          connect={connect}
          onConnected={() => setIsConnected(true)}
          onDisconnected={handleDisconnect}
          audio={true}
          video={true}
        >
          <RoomAudioRenderer />
          {isConnected && <Stage />}
        </LiveKitRoom>
      </main>
    </div>
  );
};

function Stage() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <div className="flex-1 w-full">
      <GridLayout tracks={tracks}>
        <TrackRefContext.Consumer>
          {(trackRef) =>
            trackRef && (
              <div className="relative">
                {isTrackReference(trackRef) ? (
                  <VideoTrack trackRef={trackRef} />
                ) : (
                  <p className="text-white text-center">Camera placeholder</p>
                )}
                <div className={myStyles['participant-indicators']}>
                  <div className="flex">
                    <TrackMutedIndicator
                      trackRef={{
                        participant: trackRef.participant,
                        source: Track.Source.Microphone,
                      }}
                    />
                    <TrackMutedIndicator trackRef={trackRef} />
                  </div>
                  <ParticipantName className={myStyles['my-participant-name']} />
                  <UserDefinedConnectionQualityIndicator />
                </div>
              </div>
            )
          }
        </TrackRefContext.Consumer>
      </GridLayout>
    </div>
  );
}

function UserDefinedConnectionQualityIndicator(props) {
  const { quality } = useConnectionQualityIndicator();

  function qualityToText(quality) {
    switch (quality) {
      case ConnectionQuality.Poor:
        return 'Poor';
      case ConnectionQuality.Good:
        return 'Good';
      case ConnectionQuality.Excellent:
        return 'Excellent';
      case ConnectionQuality.Lost:
        return 'Reconnecting';
      default:
        return 'Unknown';
    }
  }

  return <span {...props} className="text-white ml-1">{qualityToText(quality)}</span>;
}

export default VideoCall;
