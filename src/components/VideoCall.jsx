'use client';

import {
  LiveKitRoom,
  ParticipantName,
  TrackMutedIndicator,
  RoomAudioRenderer,
  isTrackReference,
  useConnectionQualityIndicator,
  VideoTrack,
  useTracks,
  TrackRefContext,
  useLocalParticipant,
  useRoomContext,
  useParticipants,
} from '@livekit/components-react';
import { Room, Track, ConnectionQuality } from 'livekit-client';
import { useState } from 'react';

const VideoCall = ({ tokenRoom }) => {
  const WS_URL = import.meta.env.VITE_WS_URL || '';
  const [room] = useState(new Room());
  const [connect, setConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setConnect(false);
    setIsConnected(false);
    room.disconnect();
  };

  if (!tokenRoom) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-lg font-semibold">❌ Token tidak tersedia!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
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
        {!isConnected ? (
          <WaitingRoom onConnect={() => setConnect(true)} />
        ) : (
          <MeetingRoom onDisconnect={handleDisconnect} />
        )}
      </LiveKitRoom>
    </div>
  );
};

/* ========================= 
   Waiting Room
========================= */
function WaitingRoom({ onConnect }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Ready to join?
        </h1>
        <p className="text-gray-500 mb-8">
          Your camera and microphone will be enabled when you join
        </p>

        <button
          onClick={onConnect}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Join Meeting
        </button>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Secure connection</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= 
   Meeting Room
========================= */
function MeetingRoom({ onDisconnect }) {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'speaker'
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleAudio = async () => {
    if (localParticipant) {
      const enabled = localParticipant.isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(!enabled);
      setIsMuted(enabled);
    }
  };

  const toggleVideo = async () => {
    if (localParticipant) {
      const enabled = localParticipant.isCameraEnabled;
      await localParticipant.setCameraEnabled(!enabled);
      setIsVideoOff(enabled);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
          <div className="text-gray-600 text-sm font-medium">
            Meeting Room
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Participants Button */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{participants.length}</span>
          </button>

          {/* Chat Button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
            title="Chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Settings */}
          <button
            className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <main className="flex-1 p-4 overflow-auto">
          {viewMode === 'gallery' ? (
            <GalleryView />
          ) : (
            <SpeakerView />
          )}
        </main>

        {/* Sidebar */}
        {(showParticipants || showChat) && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {showParticipants && <ParticipantsSidebar onClose={() => setShowParticipants(false)} />}
            {showChat && <ChatSidebar onClose={() => setShowChat(false)} />}
          </aside>
        )}
      </div>

      {/* Bottom Controls */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                isMuted
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                {isMuted ? (
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                )}
              </svg>
              <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                isVideoOff
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isVideoOff ? 'Start Video' : 'Stop Video'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                {isVideoOff ? (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0018 13.586V6.414a2 2 0 00-3.53-1.297L12 7.586V6a2 2 0 00-2-2H7.414l-.707-.707A1 1 0 005.293 2.293zM10 12.586L6.707 9.293A1 1 0 006 10v4a2 2 0 002 2h4a2 2 0 001.414-.586l-3.414-3.414z" clipRule="evenodd" />
                ) : (
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                )}
              </svg>
              <span className="text-xs">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>

            {/* Share Screen */}
            <button
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
              title="Share Screen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-xs">Share</span>
            </button>

            {/* View Mode */}
            <button
              onClick={() => setViewMode(viewMode === 'gallery' ? 'speaker' : 'gallery')}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
              title="Change View"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM15 3a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-xs">{viewMode === 'gallery' ? 'Speaker' : 'Gallery'}</span>
            </button>

            {/* More Options */}
            <button
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
              title="More"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
              <span className="text-xs">More</span>
            </button>
          </div>

          {/* Leave Button */}
          <button
            onClick={onDisconnect}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>Leave</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ========================= 
   Gallery View
========================= */
function GalleryView() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const numColumns = tracks.length === 1 ? 1 : tracks.length <= 4 ? 2 : 3;

  return (
    <div className={`grid gap-4 h-full ${
      numColumns === 1 ? 'grid-cols-1' : 
      numColumns === 2 ? 'grid-cols-2' : 
      'grid-cols-3'
    }`}>
      {tracks.map((trackRef, index) => (
        <TrackRefContext.Provider value={trackRef} key={index}>
          <ParticipantTile trackRef={trackRef} />
        </TrackRefContext.Provider>
      ))}
    </div>
  );
}

/* ========================= 
   Speaker View
========================= */
function SpeakerView() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const mainTrack = tracks[0];
  const thumbnails = tracks.slice(1);

  return (
    <div className="relative h-full flex items-center justify-center">
      {/* Main Video */}
      <div className="w-full h-full">
        <TrackRefContext.Provider value={mainTrack}>
          <ParticipantTile trackRef={mainTrack} isMain={true} />
        </TrackRefContext.Provider>
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {thumbnails.map((trackRef, index) => (
            <TrackRefContext.Provider value={trackRef} key={index}>
              <div className="w-48 h-36">
                <ParticipantTile trackRef={trackRef} isThumbnail={true} />
              </div>
            </TrackRefContext.Provider>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================= 
   Participant Tile
========================= */
function ParticipantTile({ trackRef, isMain = false, isThumbnail = false }) {
  const { quality } = useConnectionQualityIndicator({ participant: trackRef?.participant });

  const qualityColor = {
    [ConnectionQuality.Excellent]: 'text-green-500',
    [ConnectionQuality.Good]: 'text-yellow-500',
    [ConnectionQuality.Poor]: 'text-red-500',
  }[quality] || 'text-gray-500';

  const isSpeaking = trackRef?.participant?.isSpeaking || false;

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 ${
      isSpeaking ? 'ring-4 ring-blue-500' : ''
    } ${isThumbnail ? '' : 'shadow-xl'}`}>
      {isTrackReference(trackRef) ? (
        <VideoTrack trackRef={trackRef} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {trackRef?.participant?.identity?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <p className="mt-4 text-white font-medium">
            {trackRef?.participant?.identity || 'Participant'}
          </p>
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ParticipantName className="text-white font-semibold text-sm" />
            {trackRef?.participant?.isLocal && (
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">You</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Mute Indicator */}
            <TrackMutedIndicator
              trackRef={{
                participant: trackRef?.participant,
                source: Track.Source.Microphone,
              }}
              className="text-white"
            />
            {/* Connection Quality */}
            <div className={`text-xs ${qualityColor}`}>●</div>
          </div>
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl pointer-events-none animate-pulse" />
      )}
    </div>
  );
}

/* ========================= 
   Participants Sidebar
========================= */
function ParticipantsSidebar({ onClose }) {
  const participants = useParticipants();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">
          Participants ({participants.length})
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.identity}
            className="flex items-center gap-3 p-4 hover:bg-blue-50 transition-colors border-b border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {participant.identity.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                {participant.identity}
                {participant.isLocal && (
                  <span className="ml-2 text-xs text-blue-600">(You)</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${participant.isMicrophoneEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {participant.isMicrophoneEnabled ? '🎤' : '🔇'}
                </span>
                <span className={`text-xs ${participant.isCameraEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                  {participant.isCameraEnabled ? '📷' : '📹'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================= 
   Chat Sidebar
========================= */
function ChatSidebar({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { text: input, sender: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-white w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800">Chat</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-xs break-words ${
                msg.sender === 'You' ? 'bg-blue-50 text-blue-900 self-end' : 'bg-gray-100 text-gray-800 self-start'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{msg.sender}</span>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCall