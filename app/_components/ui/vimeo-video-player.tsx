"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/vimeo";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Rewind, FastForward } from "lucide-react";

interface VimeoVideoPlayerProps {
  videoId: string;
  title: string;
}

const qualities = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
  { label: '540p', value: '540p' },
  { label: '360p', value: '360p' }
];

const VimeoVideoPlayer = ({ videoId, title }: VimeoVideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const qualityMenuRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  // Detecta se é dispositivo touch no mount
  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  // Mantém os controles sempre visíveis
  const handleInteraction = () => {
    setShowControls(true);
  };



  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!state) return;
    setProgress(state.played * 100);
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (playerRef.current) {
      playerRef.current.seekTo(newProgress / 100, 'fraction');
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    setShowQualityMenu(false);
    
    // Recarrega o player com a nova qualidade
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(currentTime - 10, 0));
    }
  };

  const handleFastForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fechar menu de qualidade quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(event.target as Node)) {
        setShowQualityMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${pad(secs)}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black"
      onMouseMove={!isTouch ? handleInteraction : undefined}
      onClick={isTouch ? handleInteraction : undefined}
    >
      <ReactPlayer
        ref={playerRef}
        url={`https://player.vimeo.com/video/${videoId}`}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        controls={false}
        config={{
          playerOptions: {
            responsive: true,
            autopause: false,
            dnt: true,
            playsinline: true,
            quality: currentQuality
          }
        }}
        style={{
          position: isFullscreen ? 'absolute' : 'relative',
          top: 0,
          left: 0
        }}
      />

      {/* Controles customizados */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent transition-all duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${isTouch ? 'px-2 py-2' : 'px-4 py-4'}`}
      >
        {/* Barra de progresso */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeekChange}
          className="w-full h-1 mb-2 md:mb-4 rounded-lg appearance-none cursor-pointer bg-gray-400/30 hover:h-2 transition-all"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
          }}
        />

        {/* Controles inferiores */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-4">
            {/* Play/Pause */}
            <button 
              onClick={handlePlayPause} 
              className="text-white hover:text-blue-400 transition-colors p-1 md:p-0"
            >
              {playing ? 
                <Pause className="w-4 h-4 md:w-6 md:h-6" /> : 
                <Play className="w-4 h-4 md:w-6 md:h-6" />
              }
            </button>

            {/* Retroceder/Avançar em telas maiores */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={handleRewind}
                className="text-white hover:text-blue-400 transition-colors group/rewind"
              >
                <div className="relative">
                  <Rewind className="w-5 h-5" />
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover/rewind:opacity-100 transition-opacity">
                    -10s
                  </span>
                </div>
              </button>

              <button 
                onClick={handleFastForward}
                className="text-white hover:text-blue-400 transition-colors group/forward"
              >
                <div className="relative">
                  <FastForward className="w-5 h-5" />
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover/forward:opacity-100 transition-opacity">
                    +10s
                  </span>
                </div>
              </button>
            </div>

            {/* Volume apenas em telas maiores */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={handleMuteToggle} 
                className="text-white hover:text-blue-400 transition-colors"
              >
                {muted || volume === 0 ? 
                  <VolumeX className="w-5 h-5" /> : 
                  <Volume2 className="w-5 h-5" />
                }
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 rounded-lg appearance-none cursor-pointer bg-gray-400/30"
              />
            </div>

            {/* Tempo */}
            <div className="text-white text-xs md:text-sm whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            {/* Qualidade em telas maiores */}
            <div className="hidden md:block relative" ref={qualityMenuRef}>
              <button 
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Menu de Qualidade */}
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden border border-gray-700">
                  <div className="py-1">
                    {qualities.map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => handleQualityChange(quality.value)}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-blue-600/20 transition-colors ${
                          currentQuality === quality.value ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        {quality.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button 
              onClick={toggleFullscreen} 
              className="text-white hover:text-blue-400 transition-colors p-1 md:p-0"
            >
              {isFullscreen ? 
                <Minimize className="w-4 h-4 md:w-6 md:h-6" /> : 
                <Maximize className="w-4 h-4 md:w-6 md:h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Logo */}
      
      {/* <div className={`absolute top-4 right-4 text-white text-sm font-medium transition-opacity duration-300 ${
        showControls ? 'opacity-50' : 'opacity-0'
      }`}>
        Lucas FII Research
      </div> */}

    </div>
  );
};

export default VimeoVideoPlayer;
