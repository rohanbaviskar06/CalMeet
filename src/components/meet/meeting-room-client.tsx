"use client";

import { useEffect, useRef, useState } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, Clock, ExternalLink, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface MeetingRoomClientProps {
  bookingId: string;
  roomName: string;
  displayName: string;
  email: string;
  userImage?: string | null;
  eventTitle: string;
  hostName: string;
  startTime: string;
  endTime: string;
}

export function MeetingRoomClient({
  bookingId,
  roomName,
  displayName,
  email,
  eventTitle,
  hostName,
  startTime,
  endTime,
  userImage,
}: MeetingRoomClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const apiRef = useRef<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [elapsed, setElapsed] = useState("00:00");
  const [joinTime, setJoinTime] = useState<Date | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [jitsiError, setJitsiError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  // WebRTC lobby states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const meetStart = new Date(startTime);
  const meetEnd = new Date(endTime);
  const durationMins = Math.round((meetEnd.getTime() - meetStart.getTime()) / 60000);
  const formattedStart = meetStart.toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // Load Jitsi script
  useEffect(() => {
    if (document.getElementById("jitsi-sdk")) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "jitsi-sdk";
    script.src = "https://meet.jit.si/external_api.js";
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setJitsiError("Failed to load video SDK. Please check your internet connection.");
    document.head.appendChild(script);
  }, []);

  // WebRTC preview stream initialization
  useEffect(() => {
    let cancelled = false;
    let activeStream: MediaStream | null = null;

    if (!hasJoined) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          activeStream = stream;
          // Apply initial toggle state to tracks
          stream.getVideoTracks().forEach((t) => { t.enabled = true; });
          stream.getAudioTracks().forEach((t) => { t.enabled = true; });
          setLocalStream(stream);
        })
        .catch((err) => {
          console.warn("Camera/mic access denied or unavailable:", err);
        });
    }

    return () => {
      cancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [hasJoined]);

  // Attach stream to video element AFTER React renders it
  // (videoRef.current is null while localStream is null because <video> is conditional)
  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, videoEnabled]);

  // Track toggles
  const toggleLocalMic = () => {
    const nextState = !micEnabled;
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = nextState;
      });
    }
    setMicEnabled(nextState);
  };

  const toggleLocalVideo = () => {
    const nextState = !videoEnabled;
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = nextState;
      });
    }
    setVideoEnabled(nextState);
  };

  // Elapsed timer
  useEffect(() => {
    if (!joinTime) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - joinTime.getTime()) / 1000);
      if (diff >= durationMins * 60) {
        setLimitReached(true);
        if (apiRef.current) {
          apiRef.current.executeCommand("hangup");
        }
        clearInterval(interval);
        return;
      }
      const m = Math.floor(diff / 60).toString().padStart(2, "0");
      const s = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [joinTime, durationMins]);

  const joinMeeting = () => {
    if (!scriptLoaded || !containerRef.current || !window.JitsiMeetExternalAPI) {
      setJitsiError("Video SDK not ready. Please wait a moment and try again.");
      return;
    }
    setIsJoining(true);
    setJitsiError(null);
    setLimitReached(false);

    // Stop local stream before Jitsi takes control
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    try {
      const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        userInfo: { displayName, email },
        configOverwrite: {
          startWithAudioMuted: !micEnabled,
          startWithVideoMuted: !videoEnabled,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          enableClosePage: false,
          toolbarButtons: [
            "microphone", "camera", "desktop", "chat",
            "raisehand", "tileview", "participants-pane",
            "hangup",
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: "",
          SHOW_POWERED_BY: false,
          APP_NAME: "CalMeet",
          NATIVE_APP_NAME: "CalMeet",
          PROVIDER_NAME: "CalMeet",
          DEFAULT_BACKGROUND: "#0f172a",
          TOOLBAR_ALWAYS_VISIBLE: false,
          HIDE_INVITE_MORE_HEADER: true,
        },
      });

      apiRef.current = api;
      setHasJoined(true);
      setIsJoining(false);

      api.addEventListener("videoConferenceJoined", () => {
        setJoinTime(new Date());
      });

      api.addEventListener("participantJoined", () => {
        setParticipantCount((c) => c + 1);
      });

      api.addEventListener("participantLeft", () => {
        setParticipantCount((c) => Math.max(0, c - 1));
      });

      api.addEventListener("videoConferenceLeft", () => {
        api.dispose();
        apiRef.current = null;
        setHasJoined(false);
        setIsJoining(false);
        setJoinTime(null);
        setElapsed("00:00");
      });

      api.addEventListener("readyToClose", () => {
        if (apiRef.current) {
          apiRef.current.dispose();
          apiRef.current = null;
        }
        setHasJoined(false);
        setIsJoining(false);
      });
    } catch (err) {
      setJitsiError("Could not start video. Please try again.");
      setIsJoining(false);
    }
  };

  const leaveMeeting = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("hangup");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-card/85 backdrop-blur-md border-b border-border z-10">
        <div className="flex items-center gap-3">
          {/* CalMeet logo mark */}
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Video className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">CalMeet Room</p>
            <h1 className="text-sm font-bold text-foreground leading-tight">{eventTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasJoined && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{participantCount + 1}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono">
                <Clock className="h-3.5 w-3.5" />
                <span>{elapsed}</span>
              </div>
            </>
          )}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure · End-to-end encrypted</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {!hasJoined ? (
          /* Pre-join lobby */
          <div className="flex-1 flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-center justify-center">

              {/* Left Side: Live Preview Container */}
              <div className="w-full lg:w-1/2 flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-border bg-card shadow-2xl flex items-center justify-center group">
                  {videoEnabled && localStream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                        <VideoOff className="h-10 w-10" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Camera is turned off</p>
                    </div>
                  )}

                  {/* Absolute control overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border">
                    <Button
                      type="button"
                      onClick={toggleLocalMic}
                      variant={micEnabled ? "secondary" : "destructive"}
                      className="h-10 w-10 rounded-xl p-0 transition-transform active:scale-95"
                    >
                      {micEnabled ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
                    </Button>
                    <Button
                      type="button"
                      onClick={toggleLocalVideo}
                      variant={videoEnabled ? "secondary" : "destructive"}
                      className="h-10 w-10 rounded-xl p-0 transition-transform active:scale-95"
                    >
                      {videoEnabled ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
                    </Button>
                  </div>
                </div>

                {/* Audio indicators / Help message */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${micEnabled ? "bg-emerald-400" : "bg-red-400"}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${micEnabled ? "bg-emerald-500" : "bg-red-500"}`} />
                  </span>
                  <span>{micEnabled ? "Microphone is picking up sound" : "Microphone is muted"}</span>
                </div>
              </div>

              {/* Right Side: Invite Details Card */}
              <div className="w-full lg:w-[420px] space-y-6">
                <div className="rounded-3xl bg-card border border-border overflow-hidden shadow-2xl relative">
                  {/* Decorative glass border */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-orange-500" />

                  {/* Gradient banner content */}
                  <div className="p-6 pb-4 border-b border-border bg-muted/10">
                    <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Upcoming Meeting
                    </span>
                    <h2 className="text-xl font-extrabold text-foreground mt-3 leading-tight">{eventTitle}</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Grid of info details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/40">
                        <span className="text-muted-foreground font-medium">Host</span>
                        <span className="text-foreground font-bold">{hostName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/40">
                        <span className="text-muted-foreground font-medium">Scheduled</span>
                        <span className="text-foreground font-bold">{formattedStart}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/40">
                        <span className="text-muted-foreground font-medium">Duration</span>
                        <span className="text-foreground font-bold">{durationMins} minutes</span>
                      </div>
                    </div>

                    {/* Joining as user profile */}
                    <div className="flex items-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={displayName}
                          className="h-9 w-9 rounded-xl object-cover select-none"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-xl bg-primary/30 flex items-center justify-center text-sm font-black text-primary uppercase select-none">
                          {displayName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Joining as</p>
                        <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                      </div>
                    </div>

                    {jitsiError && (
                      <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
                        {jitsiError}
                      </div>
                    )}

                    {limitReached && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-500">
                        The scheduled meeting limit of {durationMins} minutes has been reached. Please rejoin if you want to continue.
                      </div>
                    )}

                    <Button
                      className="w-full h-12 text-sm font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-98 transition-all"
                      onClick={joinMeeting}
                      disabled={isJoining || !scriptLoaded}
                    >
                      {isJoining ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          Acquiring video stream…
                        </>
                      ) : !scriptLoaded ? (
                        <>Loading Jitsi SDK…</>
                      ) : (
                        <>
                          <Video className="h-4.5 w-4.5" />
                          Join Meeting
                        </>
                      )}
                    </Button>

                    <p className="text-center text-[10px] text-muted-foreground font-medium">
                      Protected by secure tokens · Powered by Jitsi API
                    </p>
                  </div>
                </div>

                {/* Lobby guides */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { title: "Audio Check", desc: "Use headphones" },
                    { title: "Video Check", desc: "Position camera" },
                    { title: "Encrypted", desc: "Fully private" },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-border bg-card p-3">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* Active meeting — full screen Jitsi */
          <div className="flex-1 relative bg-background">
            {/* Leave button overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
              <Button
                variant="destructive"
                className="gap-2 rounded-full px-6 shadow-xl"
                onClick={leaveMeeting}
              >
                <PhoneOff className="h-4 w-4" />
                Leave
              </Button>
            </div>
          </div>
        )}

        {/* Jitsi iframe container — always mounted, visible only when joined */}
        <div
          ref={containerRef}
          id="jitsi-container"
          className={hasJoined ? "fixed inset-0 top-[65px] z-10 bg-background" : "hidden"}
        />
      </div>
    </div>
  );
}
