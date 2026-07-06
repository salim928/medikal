"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Monitor, 
  MessageSquare,
  Settings,
  Users,
  Clock,
  FileText,
  Camera,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: 'patient' | 'provider';
  videoEnabled: boolean;
  audioEnabled: boolean;
  isScreenSharing: boolean;
}

export default function VideoConsultationPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  // Video/Audio refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Media states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // UI states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{sender: string; message: string; time: string}>>([]);
  const [consultationNotes, setConsultationNotes] = useState("");

  // Consultation info
  const [consultationStartTime] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const isProvider = useMemo(() => {
    return user?.role === "provider" || user?.role === "doctor";
  }, [user]);

  // Mock participant data
  const otherParticipant: Participant = {
    id: "2",
    name: isProvider ? "John Patient" : "Dr. Sarah Smith",
    role: isProvider ? "patient" : "provider",
    videoEnabled: true,
    audioEnabled: true,
    isScreenSharing: false
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Initialize media devices
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setConnectionStatus('connected');
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setConnectionStatus('disconnected');
      }
    };

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - consultationStartTime.getTime()) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [consultationStartTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        // In real implementation, would share this stream via WebRTC
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    router.push(`/appointments/${appointmentId}`);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, {
        sender: user?.user_metadata?.full_name || user?.user_metadata?.name || "You",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatMessage("");
    }
  };

  const saveConsultationNotes = () => {
    // In real implementation, save notes to backend
    toast.success("Consultation notes saved");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading consultation...</p>
        </div>
      </div>
    );
  }

  const statusColor =
    connectionStatus === "connected" ? "bg-emerald-400" :
    connectionStatus === "connecting" ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Video className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-base font-semibold">Video visit</h1>
            <p className="text-sm text-slate-400">with {otherParticipant.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${statusColor} ${connectionStatus !== "disconnected" ? "animate-pulse" : ""}`} />
            <span className="text-sm capitalize text-slate-300">{connectionStatus}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
            <Clock className="h-4 w-4 text-brand-300" />
            <span className="font-mono text-sm">{formatDuration(duration)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video stage */}
        <div className="relative flex-1 bg-slate-900">
          <div className="absolute inset-0">
            {remoteStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-4xl font-bold text-white">
                    {otherParticipant.name[0]}
                  </div>
                  <p className="text-xl font-semibold text-white">{otherParticipant.name}</p>
                  <p className="text-slate-400">{otherParticipant.role === "provider" ? "Healthcare Provider" : "Patient"}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    {connectionStatus === "connected" ? "Connected" : connectionStatus === "connecting" ? "Connecting…" : "Waiting to connect…"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local PiP */}
          <div className="absolute bottom-6 right-6 h-40 w-56 overflow-hidden rounded-2xl border border-white/15 bg-slate-800 shadow-2xl">
            {videoEnabled && localStream ? (
              <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full scale-x-[-1] transform object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-800 text-slate-400">
                <VideoOff className="mb-2 h-8 w-8" />
                <p className="text-sm">Camera off</p>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs font-medium text-white">You</p>
            </div>
          </div>

          {/* Participant chip */}
          <div className="absolute left-6 top-6 flex items-center gap-2.5 rounded-xl bg-black/40 px-3 py-2 backdrop-blur">
            <Users className="h-4 w-4 text-brand-300" />
            <p className="text-sm font-medium text-white">{otherParticipant.name}</p>
            <span className="flex items-center gap-1.5">
              {otherParticipant.videoEnabled ? <Camera className="h-3.5 w-3.5 text-emerald-400" /> : <VideoOff className="h-3.5 w-3.5 text-red-400" />}
              {otherParticipant.audioEnabled ? <Mic className="h-3.5 w-3.5 text-emerald-400" /> : <MicOff className="h-3.5 w-3.5 text-red-400" />}
            </span>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="flex w-80 flex-col border-l border-white/10 bg-slate-900">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-300" />
                <h3 className="font-semibold text-white">Chat</h3>
              </div>
              <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">×</button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-300">{msg.sender}</span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-slate-200">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Type a message…"
                  className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
                <Button onClick={sendChatMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Sidebar (Provider Only) */}
        {showNotes && isProvider && (
          <div className="flex w-96 flex-col border-l border-white/10 bg-slate-900">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-300" />
                <h3 className="font-semibold text-white">Consultation Notes</h3>
              </div>
              <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-white">×</button>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Document the consultation, symptoms, diagnosis, treatment plan…"
                className="h-full w-full resize-none rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="border-t border-white/10 p-4">
              <Button onClick={saveConsultationNotes} className="w-full">Save notes</Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <CtrlButton active={!videoEnabled} danger={!videoEnabled} onClick={toggleVideo}>
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </CtrlButton>
          <CtrlButton active={!audioEnabled} danger={!audioEnabled} onClick={toggleAudio}>
            {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </CtrlButton>
          <CtrlButton onClick={() => setSpeakerEnabled(!speakerEnabled)}>
            {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </CtrlButton>
        </div>

        <div className="flex items-center gap-2">
          <CtrlButton active={isScreenSharing} onClick={toggleScreenShare}><Monitor className="h-5 w-5" /></CtrlButton>
          <CtrlButton active={showChat} onClick={() => setShowChat(!showChat)}><MessageSquare className="h-5 w-5" /></CtrlButton>
          {isProvider && (
            <CtrlButton active={showNotes} onClick={() => setShowNotes(!showNotes)}><FileText className="h-5 w-5" /></CtrlButton>
          )}
          <CtrlButton onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </CtrlButton>
        </div>

        <button
          onClick={endCall}
          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <Phone className="h-5 w-5" /> End call
        </button>
      </div>
    </div>
  );
}

function CtrlButton({
  children, onClick, active, danger,
}: {
  children: React.ReactNode; onClick?: () => void; active?: boolean; danger?: boolean;
}) {
  const base = "flex h-12 w-12 items-center justify-center rounded-full transition";
  const style = danger
    ? "bg-red-500 text-white hover:bg-red-600"
    : active
      ? "bg-brand-600 text-white hover:bg-brand-700"
      : "bg-white/10 text-white hover:bg-white/20";
  return (
    <button onClick={onClick} className={`${base} ${style}`}>{children}</button>
  );
}
