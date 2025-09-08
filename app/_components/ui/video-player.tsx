// app/_components/ui/video-player.tsx
import React from "react";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="video-player">
      <iframe
        width="100%"
        height="315"
        src={videoUrl}
        title="Video Player"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
