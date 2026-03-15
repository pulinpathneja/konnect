'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getSocket,
  sendCallOffer,
  sendCallAnswer,
  sendIceCandidate,
  sendCallEnded,
  sendCallRejected,
} from '@/lib/socket';

export type CallType = 'voice' | 'video';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'active' | 'ended';

export interface CallHookState {
  status: CallStatus;
  type: CallType | null;
  duration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callerId: string | null;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function useCall(chatId: string) {
  const [state, setState] = useState<CallHookState>({
    status: 'idle',
    type: null,
    duration: 0,
    isMuted: false,
    isVideoOff: false,
    localStream: null,
    remoteStream: null,
    callerId: null,
  });

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteOfferRef = useRef<RTCSessionDescriptionInit | null>(null);

  // Duration timer
  useEffect(() => {
    if (state.status === 'active') {
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, duration: s.duration + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status]);

  const cleanupCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    remoteOfferRef.current = null;
  }, []);

  const resetState = useCallback(() => {
    setState({
      status: 'idle',
      type: null,
      duration: 0,
      isMuted: false,
      isVideoOff: false,
      localStream: null,
      remoteStream: null,
      callerId: null,
    });
  }, []);

  const endCall = useCallback(() => {
    if (chatId) {
      sendCallEnded(chatId, 'Call ended');
    }
    cleanupCall();
    setState((s) => ({ ...s, status: 'ended' }));
    setTimeout(resetState, 2000);
  }, [chatId, cleanupCall, resetState]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && chatId) {
        sendIceCandidate(chatId, event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      setState((s) => ({ ...s, remoteStream: event.streams[0] }));
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        endCall();
      }
    };

    peerConnection.current = pc;
    return pc;
  }, [chatId, endCall]);

  const getMediaStream = useCallback(async (type: CallType): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    });
  }, []);

  // Listen for socket events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleCallOffer = (data: {
      chatId: string;
      offer: RTCSessionDescriptionInit;
      callType: CallType;
      callerId: string;
    }) => {
      if (data.chatId !== chatId) return;
      remoteOfferRef.current = data.offer;
      setState((s) => ({
        ...s,
        status: 'ringing',
        type: data.callType,
        callerId: data.callerId,
      }));
    };

    const handleCallAnswer = async (data: { chatId: string; answer: RTCSessionDescriptionInit }) => {
      if (data.chatId !== chatId) return;
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        setState((s) => ({ ...s, status: 'active', duration: 0 }));
      }
    };

    const handleIceCandidate = async (data: { chatId: string; candidate: RTCIceCandidateInit }) => {
      if (data.chatId !== chatId) return;
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Failed to add ICE candidate:', err);
        }
      }
    };

    const handleCallEnded = (data: { chatId: string }) => {
      if (data.chatId !== chatId) return;
      cleanupCall();
      setState((s) => ({ ...s, status: 'ended' }));
      setTimeout(resetState, 2000);
    };

    const handleCallRejected = (data: { chatId: string }) => {
      if (data.chatId !== chatId) return;
      cleanupCall();
      setState((s) => ({ ...s, status: 'ended' }));
      setTimeout(resetState, 2000);
    };

    socket.on('call-offer', handleCallOffer);
    socket.on('call-answer', handleCallAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-ended', handleCallEnded);
    socket.on('call-rejected', handleCallRejected);

    return () => {
      socket.off('call-offer', handleCallOffer);
      socket.off('call-answer', handleCallAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-ended', handleCallEnded);
      socket.off('call-rejected', handleCallRejected);
    };
  }, [chatId, cleanupCall, resetState]);

  const startCall = useCallback(async (type: CallType) => {
    if (!chatId) {
      console.error('Cannot start call: no chatId');
      return;
    }

    try {
      const stream = await getMediaStream(type);
      localStreamRef.current = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendCallOffer(chatId, pc.localDescription, type);

      setState((s) => ({
        ...s,
        status: 'calling',
        type,
        localStream: stream,
        duration: 0,
        isMuted: false,
        isVideoOff: false,
      }));
    } catch (err) {
      console.error('Failed to start call:', err);
    }
  }, [chatId, getMediaStream, createPeerConnection]);

  const acceptCall = useCallback(async () => {
    if (!state.type || !remoteOfferRef.current || !chatId) return;

    try {
      const stream = await getMediaStream(state.type);
      localStreamRef.current = stream;

      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Set remote description from stored offer
      await pc.setRemoteDescription(new RTCSessionDescription(remoteOfferRef.current));

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      sendCallAnswer(chatId, pc.localDescription);

      setState((s) => ({
        ...s,
        status: 'active',
        localStream: stream,
        duration: 0,
      }));
    } catch (err) {
      console.error('Failed to accept call:', err);
      rejectCall();
    }
  }, [state.type, chatId, getMediaStream, createPeerConnection]);

  const rejectCall = useCallback(() => {
    if (chatId) {
      sendCallRejected(chatId);
    }
    cleanupCall();
    resetState();
  }, [chatId, cleanupCall, resetState]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setState((s) => ({ ...s, isMuted: !s.isMuted }));
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setState((s) => ({ ...s, isVideoOff: !s.isVideoOff }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, [cleanupCall]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    ...state,
    formattedDuration: formatDuration(state.duration),
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}
