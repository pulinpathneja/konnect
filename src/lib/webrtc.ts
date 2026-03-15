// WebRTC signaling via Firestore
// In production, signaling data (offer/answer/ICE candidates) is exchanged via Firestore documents

import { db } from './firebase';
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

export interface SignalingData {
  type: 'offer' | 'answer' | 'candidate' | 'hangup';
  from: string;
  to: string;
  data: RTCSessionDescriptionInit | RTCIceCandidateInit | null;
  callType: 'voice' | 'video';
  timestamp: number;
}

const CALLS_COLLECTION = 'calls';

export async function sendSignalingData(callId: string, data: SignalingData) {
  try {
    await setDoc(doc(db, CALLS_COLLECTION, callId), {
      ...data,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('Failed to send signaling data:', err);
  }
}

export function listenForSignalingData(
  callId: string,
  callback: (data: SignalingData) => void
) {
  return onSnapshot(doc(db, CALLS_COLLECTION, callId), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as SignalingData);
    }
  });
}

export async function endSignalingSession(callId: string) {
  try {
    await deleteDoc(doc(db, CALLS_COLLECTION, callId));
  } catch (err) {
    console.error('Failed to end signaling session:', err);
  }
}

export async function updateCallStatus(callId: string, status: 'ringing' | 'active' | 'ended') {
  try {
    await updateDoc(doc(db, CALLS_COLLECTION, callId), { status });
  } catch (err) {
    console.error('Failed to update call status:', err);
  }
}

// ICE server configuration for WebRTC
export const iceServers: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function createPeerConnection(): RTCPeerConnection {
  return new RTCPeerConnection({ iceServers });
}
