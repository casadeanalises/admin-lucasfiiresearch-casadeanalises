"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, ChevronDown, Rewind, FastForward, Subtitles } from "lucide-react";

interface CustomVideoPlayerProps {
  videoId: string;
  title: string;
}


const videoQualities = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: 'hd1080' },
  { label: '720p', value: 'hd720' },
  { label: '480p', value: 'large' },
  { label: '360p', value: 'medium' },
  { label: '240p', value: 'small' },
  { label: '144p', value: 'tiny' }
];

const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const CustomVideoPlayer = ({ videoId, title }: CustomVideoPlayerProps) => {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserPaused = useRef<boolean>(false);
  const pauseButtonRef = useRef<HTMLButtonElement>(null);
  const qualityMenuRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  
  const setPausedState = (isPaused: boolean) => {
    isUserPaused.current = isPaused;
    setPlaying(!isPaused);
  };

  
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

 
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    const showThenHideControls = () => {
      setShowControls(true);
      clearTimeout(hideTimeout);
      if (playing) {
        hideTimeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", showThenHideControls);
      container.addEventListener("touchstart", showThenHideControls, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", showThenHideControls);
        container.removeEventListener("touchstart", showThenHideControls);
      }
      clearTimeout(hideTimeout);
    };
  }, [playing]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setPausedState(!isUserPaused.current);
    setShowControls(true);
    
    setTimeout(() => {
      if (pauseButtonRef.current) {
        pauseButtonRef.current.blur();
      }
    }, 50);
  };

  const handleSeek = (amount: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + amount, 'seconds');
    }
  };

  const toggleCaptions = () => {
    setShowCaptions(prev => !prev);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${minutes}:${pad(secs)}`;
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setProgress(state.played * 100);
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    setProgress(percent * 100);
    playerRef.current?.seekTo(percent);
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = x / width;
    const time = duration * percentage;
    
    setHoverTime(time);
    setHoverPosition({ 
      x: Math.min(Math.max(x, 40), width - 40), // Limita a posição para não sair da tela
      y: bounds.top 
    });
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
    setHoverPosition(null);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        (containerRef.current as any).mozRequestFullScreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

 
  const toggleQualityMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQualityMenu(!showQualityMenu);
  };

  const toggleSpeedMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSpeedMenu(!showSpeedMenu);
    setShowQualityMenu(false);
  };

  const selectQuality = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityMenu(false);
    
  
 
    if (playerRef.current) {
      
      setTimeout(() => {
        const currentTime = playerRef.current?.getCurrentTime() || 0;
        playerRef.current?.seekTo(currentTime);
      }, 100);
    }
  };

  const selectSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  
  const getSelectedQualityLabel = () => {
    const found = videoQualities.find(q => q.value === selectedQuality);
    return found ? found.label : 'Auto';
  };

  return (
    <div 
      className="relative w-full h-full bg-black cursor-none hover:cursor-auto" 
      ref={containerRef}
    >
      <ReactPlayer
        key={showCaptions ? 'captions-on' : 'captions-off'}
        ref={playerRef}
        url={`https://www.youtube-nocookie.com/embed/${videoId}`}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        controls={false}
        playbackRate={playbackSpeed}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              showinfo: 0,
              rel: 0,
              iv_load_policy: 3,
              cc_load_policy: showCaptions ? 1 : 0,
              cc_lang_pref: 'pt',
              fs: 0,
              disablekb: 1,
              controls: 0,
              vq: selectedQuality !== 'auto' ? selectedQuality : undefined
            }
          }
        }}
      />

    
      <div 
        className="absolute inset-0 z-10 cursor-pointer" 
        onClick={handlePlayPause}
        style={{ bottom: '80px' }} 
      />

      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 sm:px-4 py-2 sm:py-4 z-20 transition-all duration-300 transform ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div 
          className="h-1 w-full bg-white/30 cursor-pointer mb-2 sm:mb-4 group relative"
          onClick={handleSeekChange}
          onMouseMove={handleProgressHover}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => {
            setIsInteracting(false);
            handleProgressLeave();
          }}
          ref={progressRef}
        >
          <div 
            className="h-full bg-blue-500 transition-all relative group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
          </div>
          {hoverTime !== null && hoverPosition !== null && (
            <div 
              className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded -translate-y-8 -translate-x-1/2"
              style={{ 
                left: hoverPosition.x,
                top: -20
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        <div 
          className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          <button
            onClick={() => handleSeek(-10)}
            className="text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none"
          >
            <Rewind className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            ref={pauseButtonRef}
            onClick={handlePlayPause}
            className="text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none"
          >
            {playing ? (
              <Pause className="w-4 h-4 sm:w-6 sm:h-6" />
            ) : (
              <Play className="w-4 h-4 sm:w-6 sm:h-6" />
            )}
          </button>
          <button
            onClick={() => handleSeek(10)}
            className="text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none"
          >
            <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="text-white text-xs sm:text-sm min-w-[90px] sm:min-w-[120px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 order-last sm:order-none">
            <button
              onClick={handleMute}
              className="text-white hover:text-blue-500 transition p-1 sm:p-2"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 sm:w-6 sm:h-6" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-6 sm:h-6" />
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 sm:w-20 h-1 sm:h-2 bg-white/30 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, rgba(255, 255, 255, 0.3) ${volume * 100}%, rgba(255, 255, 255, 0.3) 100%)`
              }}
            />
          </div>
          
        
          <div className="relative hidden sm:block" ref={qualityMenuRef}>
            <button
              onClick={toggleQualityMenu}
              className="flex items-center gap-1 text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs">{getSelectedQualityLabel()}</span>
              <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
            </button>
            
            {showQualityMenu && (
              <div className="absolute bottom-12 left-0 bg-black/90 backdrop-blur-sm rounded p-2 w-28 sm:w-32 shadow-lg">
                <div className="text-xs text-gray-400 px-2 py-1 border-b border-gray-700">Qualidade</div>
                {videoQualities.map(quality => (
                  <button
                    key={quality.value}
                    className={`w-full text-left px-2 py-1.5 text-xs sm:text-sm hover:bg-white/10 rounded transition-colors ${
                      selectedQuality === quality.value ? 'text-blue-400' : 'text-white'
                    }`}
                    onClick={() => selectQuality(quality.value)}
                  >
                    {quality.label}
                    {selectedQuality === quality.value && (
                      <span className="float-right">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={toggleSpeedMenu}
            className="flex items-center gap-1 text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none"
          >
            <span className="text-xs">{playbackSpeed}x</span>
            <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
          </button>
          
          {showSpeedMenu && (
            <div className="absolute bottom-12 left-0 bg-black/90 backdrop-blur-sm rounded p-2 w-28 sm:w-32 shadow-lg">
              <div className="text-xs text-gray-400 px-2 py-1 border-b border-gray-700">Velocidade</div>
              {playbackSpeeds.map(speed => (
                <button
                  key={speed}
                  className={`w-full text-left px-2 py-1.5 text-xs sm:text-sm hover:bg-white/10 rounded transition-colors ${
                    playbackSpeed === speed ? 'text-blue-400' : 'text-white'
                  }`}
                  onClick={() => selectSpeed(speed)}
                >
                  {speed}x
                  {playbackSpeed === speed && (
                    <span className="float-right">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
          
          <button
            onClick={toggleCaptions}
            className={`text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none ${showCaptions ? 'text-blue-500' : ''}`}
          >
            <Subtitles className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-blue-500 transition p-1 sm:p-2 focus:outline-none"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
          
          {/* Removido texto da marca d'água */}
        </div>
      </div>

      <style jsx global>{`
        * {
          user-select: none !important;
        }
        iframe {
          pointer-events: none !important;
        }
        /* Esconder todos os elementos do YouTube */
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-watermark,
        .ytp-title,
        .ytp-modestbranding,
        .ytp-show-cards-title,
        .ytp-youtube-button,
        .ytp-embed,
        .ytp-pause-overlay,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-share-button,
        .ytp-watch-later-button,
        .ytp-more-videos-button,
        iframe[id^='youtube'] > div {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        
        /* Estilo para o controle deslizante de volume */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type=range]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        
        /* Estilos para tela cheia */
        .player-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
        }
        
        /* Animações suaves para os controles */
        .transform {
          transition-property: transform, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Esconder o cursor após 3 segundos de inatividade */
        .cursor-none {
          cursor: none;
        }
        
        /* Mostrar o cursor ao mover */
        .hover\:cursor-auto:hover {
          cursor: auto;
        }
        
        /* Ajustes para mobile */
        @media (max-width: 640px) {
          input[type=range]::-webkit-slider-thumb {
            width: 10px;
            height: 10px;
          }
          
          input[type=range]::-moz-range-thumb {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomVideoPlayer;
