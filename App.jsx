import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Users, Play, RotateCcw, Trophy, ShieldAlert, Coins, Home, Building2,
  Shuffle, Sparkles, Crown, HelpCircle, Check, X, ArrowRightLeft,
  Volume2, VolumeX, Smartphone, ChevronRight, Layers, Hand, Eye,
  Clock, Award, MessageSquare, Wifi, Copy, CheckCheck, Maximize2, Minimize2,
  ZoomIn, ZoomOut, EyeOff, Lock, Mic, MicOff, Send, Radio
} from 'lucide-react';

// ============================================================================
// COLOR & PROPERTY METADATA (Classic Monopoly Deal Set Rules)
// ============================================================================
const COLOR_META = {
  brown:      { name: 'Brown',       req: 2, rent: [1, 2],       bg: '#7C4722', border: '#5A3115', text: '#FFFFFF', light: '#EFE3D8' },
  light_blue: { name: 'Light Blue',  req: 3, rent: [1, 2, 3],    bg: '#38BDF8', border: '#0284C7', text: '#0F172A', light: '#E0F2FE' },
  pink:       { name: 'Pink',        req: 3, rent: [1, 2, 4],    bg: '#EC4899', border: '#BE185D', text: '#FFFFFF', light: '#FCE7F3' },
  orange:     { name: 'Orange',      req: 3, rent: [1, 3, 5],    bg: '#F97316', border: '#C2410C', text: '#FFFFFF', light: '#FFEDD5' },
  red:        { name: 'Red',         req: 3, rent: [2, 3, 6],    bg: '#EF4444', border: '#B91C1C', text: '#FFFFFF', light: '#FEE2E2' },
  yellow:     { name: 'Yellow',      req: 3, rent: [2, 4, 6],    bg: '#EAB308', border: '#A16207', text: '#0F172A', light: '#FEF9C3' },
  green:      { name: 'Green',       req: 3, rent: [2, 4, 7],    bg: '#16A34A', border: '#15803D', text: '#FFFFFF', light: '#DCFCE7' },
  dark_blue:  { name: 'Dark Blue',   req: 2, rent: [3, 8],       bg: '#1D4ED8', border: '#1E3A8A', text: '#FFFFFF', light: '#DBEAFE' },
  railroad:   { name: 'Railroad',    req: 4, rent: [1, 2, 3, 4], bg: '#1E293B', border: '#0F172A', text: '#FFFFFF', light: '#F1F5F9' },
  utility:    { name: 'Utility',     req: 2, rent: [1, 2],       bg: '#10B981', border: '#047857', text: '#FFFFFF', light: '#D1FAE5' },
};

const ALL_COLORS = Object.keys(COLOR_META);

const SEAT_AVATARS = [
  { name: 'You',    emoji: '😎', flag: '🇪🇬', ring: '#F59E0B', rank: 'VIP' },
  { name: 'Karim',  emoji: '🦁', flag: '🇪🇬', ring: '#38BDF8', rank: 'PRO' },
  { name: 'Nour',   emoji: '👑', flag: '🇦🇪', ring: '#EC4899', rank: 'ACE' },
  { name: 'Tarek',  emoji: '🦅', flag: '🇸🇦', ring: '#22C55E', rank: 'MASTER' },
  { name: 'Salma',  emoji: '💎', flag: '🇰🇼', ring: '#A855F7', rank: 'ELITE' },
  { name: 'Ziad',   emoji: '🔥', flag: '🇶🇦', ring: '#F97316', rank: 'BOSS' },
];

const QUICK_CHATS = [
  'Nice move! 👏',
  'No mercy! 😈',
  'Pay up! 💸',
  'Just Say No! 🛑',
  'Good game! 🤝',
  'Hurry up! ⏱️',
];

// ============================================================================
// 108-CARD DECK GENERATOR
// ============================================================================
function buildFullDeck() {
  let idCounter = 1;
  const deck = [];
  const add = (card, count = 1) => {
    for (let i = 0; i < count; i++) {
      deck.push({ ...card, uid: `card_${idCounter++}` });
    }
  };

  // Properties (28)
  add({ type: 'property', color: 'brown',      name: 'Mediterranean Ave',   value: 1 });
  add({ type: 'property', color: 'brown',      name: 'Baltic Ave',          value: 1 });
  add({ type: 'property', color: 'light_blue', name: 'Oriental Ave',        value: 1 });
  add({ type: 'property', color: 'light_blue', name: 'Vermont Ave',         value: 1 });
  add({ type: 'property', color: 'light_blue', name: 'Connecticut Ave',     value: 1 });
  add({ type: 'property', color: 'pink',       name: 'St. Charles Place',   value: 2 });
  add({ type: 'property', color: 'pink',       name: 'States Ave',          value: 2 });
  add({ type: 'property', color: 'pink',       name: 'Virginia Ave',        value: 2 });
  add({ type: 'property', color: 'orange',     name: 'St. James Place',     value: 2 });
  add({ type: 'property', color: 'orange',     name: 'Tennessee Ave',       value: 2 });
  add({ type: 'property', color: 'orange',     name: 'New York Ave',        value: 2 });
  add({ type: 'property', color: 'red',        name: 'Kentucky Ave',        value: 3 });
  add({ type: 'property', color: 'red',        name: 'Indiana Ave',         value: 3 });
  add({ type: 'property', color: 'red',        name: 'Illinois Ave',        value: 3 });
  add({ type: 'property', color: 'yellow',     name: 'Atlantic Ave',        value: 3 });
  add({ type: 'property', color: 'yellow',     name: 'Ventnor Ave',         value: 3 });
  add({ type: 'property', color: 'yellow',     name: 'Marvin Gardens',      value: 3 });
  add({ type: 'property', color: 'green',      name: 'Pacific Ave',         value: 4 });
  add({ type: 'property', color: 'green',      name: 'North Carolina Ave',  value: 4 });
  add({ type: 'property', color: 'green',      name: 'Pennsylvania Ave',    value: 4 });
  add({ type: 'property', color: 'dark_blue',  name: 'Park Place',          value: 4 });
  add({ type: 'property', color: 'dark_blue',  name: 'Boardwalk',           value: 4 });
  add({ type: 'property', color: 'railroad',   name: 'Reading Railroad',    value: 2 });
  add({ type: 'property', color: 'railroad',   name: 'Pennsylvania RR',     value: 2 });
  add({ type: 'property', color: 'railroad',   name: 'B. & O. Railroad',    value: 2 });
  add({ type: 'property', color: 'railroad',   name: 'Short Line',          value: 2 });
  add({ type: 'property', color: 'utility',    name: 'Electric Company',    value: 2 });
  add({ type: 'property', color: 'utility',    name: 'Water Works',         value: 2 });

  // Property Wildcards (11)
  add({ type: 'wildcard', colors: ['dark_blue', 'green'],      name: 'Blue/Green Wild',     value: 4 }, 1);
  add({ type: 'wildcard', colors: ['green', 'railroad'],       name: 'Green/RR Wild',       value: 4 }, 1);
  add({ type: 'wildcard', colors: ['utility', 'railroad'],     name: 'Utility/RR Wild',     value: 2 }, 1);
  add({ type: 'wildcard', colors: ['light_blue', 'railroad'],  name: 'Lt.Blue/RR Wild',     value: 4 }, 1);
  add({ type: 'wildcard', colors: ['light_blue', 'brown'],     name: 'Lt.Blue/Brown Wild',  value: 1 }, 1);
  add({ type: 'wildcard', colors: ['pink', 'orange'],          name: 'Pink/Orange Wild',    value: 2 }, 2);
  add({ type: 'wildcard', colors: ['red', 'yellow'],           name: 'Red/Yellow Wild',     value: 3 }, 2);
  add({ type: 'wildcard', colors: ALL_COLORS,                  name: 'Multi-Color Wild',    value: 0 }, 2);

  // Money Cards (20)
  add({ type: 'money', value: 10, name: '$10M' }, 1);
  add({ type: 'money', value: 5,  name: '$5M' },  2);
  add({ type: 'money', value: 4,  name: '$4M' },  3);
  add({ type: 'money', value: 3,  name: '$3M' },  3);
  add({ type: 'money', value: 2,  name: '$2M' },  5);
  add({ type: 'money', value: 1,  name: '$1M' },  6);

  // Action Cards (34)
  add({ type: 'action', action: 'deal_breaker',   name: 'Deal Breaker',    value: 5, desc: 'Steal a complete property set!' }, 2);
  add({ type: 'action', action: 'just_say_no',    name: 'Just Say No!',    value: 4, desc: 'Cancel any action played against you.' }, 3);
  add({ type: 'action', action: 'sly_deal',       name: 'Sly Deal',        value: 3, desc: 'Steal 1 property (not from a full set).' }, 3);
  add({ type: 'action', action: 'forced_deal',    name: 'Forced Deal',     value: 3, desc: 'Swap 1 property with another player.' }, 4);
  add({ type: 'action', action: 'debt_collector', name: 'Debt Collector',  value: 3, desc: 'Force 1 player to pay you $5M.' }, 3);
  add({ type: 'action', action: 'birthday',       name: "It's My Birthday",value: 2, desc: 'All players give you $2M.' }, 3);
  add({ type: 'action', action: 'pass_go',        name: 'Pass Go',         value: 1, desc: 'Draw 2 extra cards.' }, 10);
  add({ type: 'action', action: 'house',          name: 'House',           value: 3, desc: 'Add +$3M rent to a full set.' }, 3);
  add({ type: 'action', action: 'hotel',          name: 'Hotel',           value: 4, desc: 'Add +$4M rent to a set with a House.' }, 2);
  add({ type: 'action', action: 'double_rent',    name: 'Double The Rent!',value: 1, desc: 'Play with Rent to double amount.' }, 2);

  // Rent Cards (13)
  add({ type: 'rent', colors: ['dark_blue', 'green'],     name: 'Rent: Blue/Green',    value: 1 }, 2);
  add({ type: 'rent', colors: ['red', 'yellow'],          name: 'Rent: Red/Yellow',    value: 1 }, 2);
  add({ type: 'rent', colors: ['pink', 'orange'],         name: 'Rent: Pink/Orange',   value: 1 }, 2);
  add({ type: 'rent', colors: ['light_blue', 'brown'],    name: 'Rent: Lt.Blue/Brown', value: 1 }, 2);
  add({ type: 'rent', colors: ['railroad', 'utility'],    name: 'Rent: RR/Utility',    value: 1 }, 2);
  add({ type: 'rent', colors: ALL_COLORS,                 name: 'Wild Rent (Any)',     value: 3 }, 3);

  return shuffleArray(deck);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ============================================================================
// PROPERTY & SET HELPERS
// ============================================================================
function getGroupedProperties(properties) {
  const groups = {};
  ALL_COLORS.forEach((c) => {
    groups[c] = [];
  });
  (properties || []).forEach((card) => {
    const activeColor = card.assignedColor || card.color || (card.colors && card.colors[0]) || 'brown';
    if (!groups[activeColor]) groups[activeColor] = [];
    groups[activeColor].push(card);
  });
  return groups;
}

function getCompletedSets(player) {
  const groups = getGroupedProperties(player.properties);
  const completed = [];
  ALL_COLORS.forEach((color) => {
    const cards = groups[color] || [];
    const req = COLOR_META[color].req;
    const hasRealProperty = cards.some((c) => c.type === 'property' || (c.type === 'wildcard' && c.colors.length < 10));
    if (cards.length >= req && (hasRealProperty || cards.length >= req)) {
      completed.push(color);
    }
  });
  return completed;
}

function calculateRentForColor(player, color) {
  const groups = getGroupedProperties(player.properties);
  const cards = groups[color] || [];
  if (cards.length === 0) return 0;
  const meta = COLOR_META[color];
  const count = Math.min(cards.length, meta.req);
  let base = meta.rent[count - 1] || 0;
  if (cards.length >= meta.req) {
    if (player.buildings?.[color]?.house) base += 3;
    if (player.buildings?.[color]?.hotel) base += 4;
  }
  return base;
}

function getBankTotal(player) {
  return (player.bank || []).reduce((sum, c) => sum + (c.value || 0), 0);
}

function getPayableAssets(player) {
  const bankItems = (player.bank || []).map((c) => ({ ...c, source: 'bank' }));
  const propItems = (player.properties || [])
    .filter((c) => (c.value || 0) > 0)
    .map((c) => ({ ...c, source: 'properties' }));
  return [...bankItems, ...propItems];
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Lobby & Configuration State
  const [screen, setScreen] = useState('lobby'); // 'lobby' | 'game' | 'victory'
  const [setsToWin, setSetsToWin] = useState(3); // 3 to 6
  const [gameMode, setGameMode] = useState('ai'); // 'ai' | 'pass_play' | 'online'
  const [playerCount, setPlayerCount] = useState(4); // 2 to 6
  const [humanSeatIndex, setHumanSeatIndex] = useState(0); // 0..5
  const [turnTimerSetting, setTurnTimerSetting] = useState(0); // 0 = off, 15, 30
  const [playerName, setPlayerName] = useState('Mohamed');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [uiZoom, setUiZoom] = useState('auto'); // 'auto' | '90' | '100' | '110'
  const [viewportSize, setViewportSize] = useState({ w: 844, h: 390 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Online Room & PeerJS P2P Multiplayer State (Zero Backend Server Required)
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [onlineRole, setOnlineRole] = useState('host'); // 'host' | 'guest'
  const [roomSeats, setRoomSeats] = useState([
    { seat: 0, name: 'Mohamed', isHuman: true, occupied: true },
    { seat: 1, name: 'Bot Karim', isHuman: false, occupied: false },
    { seat: 2, name: 'Bot Nour', isHuman: false, occupied: false },
    { seat: 3, name: 'Bot Tarek', isHuman: false, occupied: false },
    { seat: 4, name: 'Bot Salma', isHuman: false, occupied: false },
    { seat: 5, name: 'Bot Ziad', isHuman: false, occupied: false },
  ]);
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const peerInstanceRef = useRef(null);
  const dataConnsRef = useRef({});
  const peerIdRef = useRef(`peer_${Math.random().toString(36).slice(2, 9)}`);

  // Voice Mic & Table Chat State
  const [micEnabled, setMicEnabled] = useState(false);
  const [pttMode, setPttMode] = useState(false);
  const [pttHolding, setPttHolding] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micError, setMicError] = useState('');
  const [speakingPlayerIds, setSpeakingPlayerIds] = useState([]);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { id: 'c1', senderId: 1, senderName: 'Karim', text: 'Ready to deal! Let’s see who gets 3 sets first.', time: 'Now' },
  ]);

  // Core Game State
  const [game, setGame] = useState(null);
  const gameRef = useRef(null);
  gameRef.current = game;

  // UI Interaction State
  const [selectedCardUid, setSelectedCardUid] = useState(null);
  const [handMinimized, setHandMinimized] = useState(false);
  const [doubleRentCount, setDoubleRentCount] = useState(0);
  const [wildcardColorChoice, setWildcardColorChoice] = useState(null);
  const [rentColorChoice, setRentColorChoice] = useState(null);
  const [targetModal, setTargetModal] = useState(null);
  const [paymentSelection, setPaymentSelection] = useState([]);
  const [discardSelection, setDiscardSelection] = useState([]);
  const [inspectPlayerId, setInspectPlayerId] = useState(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [passCurtainPlayer, setPassCurtainPlayer] = useState(null);
  const [shuffleBanner, setShuffleBanner] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [turnSecondsLeft, setTurnSecondsLeft] = useState(null);
  const [seatBubbles, setSeatBubbles] = useState({}); // { [playerId]: { text, tone, id } }

  const aiTimeoutRef = useRef(null);
  const lastShuffleCountRef = useRef(0);
  const lastBubbleEventIdRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRafRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const remoteAudiosRef = useRef({});

  // ============================================================================
  // VIEWPORT & FULLSCREEN HANDLERS
  // ============================================================================
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    document.addEventListener('fullscreenchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('fullscreenchange', updateSize);
    };
  }, []);

  const toggleFullScreen = async () => {
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      }
    } catch {
      showToast('On iPhone Safari: Tap Share → Add to Home Screen for full screen');
    }
  };

  const effectiveScale = useMemo(() => {
    if (uiZoom !== 'auto') return Number(uiZoom) / 100;
    if (viewportSize.h < 350 || viewportSize.w < 680) return 0.86;
    if (viewportSize.h < 410 || viewportSize.w < 820) return 0.93;
    return 1;
  }, [uiZoom, viewportSize]);

  const showToast = useCallback((text) => {
    setToastMsg(text);
    setTimeout(() => {
      setToastMsg((prev) => (prev === text ? null : prev));
    }, 2800);
  }, []);

  const triggerSeatBubble = useCallback((playerId, text, tone = 'neutral') => {
    const id = Date.now() + Math.random();
    setSeatBubbles((prev) => ({ ...prev, [playerId]: { text, tone, id } }));
    setTimeout(() => {
      setSeatBubbles((prev) => {
        if (prev[playerId]?.id !== id) return prev;
        const next = { ...prev };
        delete next[playerId];
        return next;
      });
    }, 3400);
  }, []);

  // ============================================================================
  // SERVERLESS PEERJS (WEBRTC) MULTIPLAYER & LIVE VOICE
  // ============================================================================
  const sendWsMessage = useCallback((payload) => {
    const packet = { ...payload, roomCode, peerId: peerIdRef.current };
    Object.values(dataConnsRef.current).forEach((conn) => {
      if (conn && conn.open) {
        conn.send(packet);
      }
    });
  }, [roomCode]);

  const broadcastGameState = useCallback((nextGameState) => {
    if (gameMode === 'online' && roomCode) {
      sendWsMessage({ type: 'game_state', state: nextGameState });
    }
  }, [gameMode, roomCode, sendWsMessage]);

  useEffect(() => {
    if (gameMode !== 'online' || !roomCode) {
      if (peerInstanceRef.current) {
        peerInstanceRef.current.destroy();
        peerInstanceRef.current = null;
      }
      dataConnsRef.current = {};
      setWsConnected(false);
      return;
    }

    const hostPeerId = `dealest-room-${roomCode}`;
    const myPeerId = onlineRole === 'host' ? hostPeerId : `${hostPeerId}-${peerIdRef.current}`;
    const PeerCls = window.Peer;
    if (!PeerCls) { showToast('P2P engine loading, try again'); return; }
    const peer = new PeerCls(myPeerId, {
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
    });
    peerInstanceRef.current = peer;

    const handleIncomingPacket = (msg, senderConn) => {
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'seat_claim') {
        setRoomSeats((prev) =>
          prev.map((s) =>
            s.seat === msg.seatIndex
              ? { ...s, name: msg.playerName, isHuman: true, occupied: true }
              : s
          )
        );
        if (onlineRole === 'host') {
          Object.values(dataConnsRef.current).forEach((c) => {
            if (c !== senderConn && c.open) c.send(msg);
          });
        }
      } else if (msg.type === 'game_state' && msg.state) {
        setGame(msg.state);
        if (msg.state.winnerId !== null) setScreen('victory');
        else setScreen('game');
        if (onlineRole === 'host') {
          Object.values(dataConnsRef.current).forEach((c) => {
            if (c !== senderConn && c.open) c.send(msg);
          });
        }
      } else if (msg.type === 'chat_msg' && msg.entry) {
        setChatMessages((prev) => [...prev.slice(-39), msg.entry]);
        triggerSeatBubble(msg.entry.senderId, msg.entry.text, 'chat');
        if (!chatDrawerOpen) setUnreadChatCount((c) => c + 1);
        if (onlineRole === 'host') {
          Object.values(dataConnsRef.current).forEach((c) => {
            if (c !== senderConn && c.open) c.send(msg);
          });
        }
      }
    };

    const bindDataConn = (conn) => {
      dataConnsRef.current[conn.peer] = conn;
      conn.on('open', () => {
        setWsConnected(true);
        conn.send({
          type: 'seat_claim',
          seatIndex: humanSeatIndex,
          playerName: playerName || 'Player',
          peerId: myPeerId,
        });
        if (onlineRole === 'host' && gameRef.current) {
          conn.send({ type: 'game_state', state: gameRef.current });
        }
        if (localStreamRef.current && peerInstanceRef.current) {
          const call = peerInstanceRef.current.call(conn.peer, localStreamRef.current);
          if (call) {
            call.on('stream', (remoteStream) => {
              let audioEl = remoteAudiosRef.current[conn.peer];
              if (!audioEl) {
                audioEl = new Audio();
                audioEl.autoplay = true;
                remoteAudiosRef.current[conn.peer] = audioEl;
              }
              audioEl.srcObject = remoteStream;
            });
          }
        }
      });
      conn.on('data', (data) => handleIncomingPacket(data, conn));
      conn.on('close', () => {
        delete dataConnsRef.current[conn.peer];
      });
    };

    peer.on('open', () => {
      setWsConnected(true);
      if (onlineRole === 'guest') {
        const conn = peer.connect(hostPeerId, { reliable: true });
        bindDataConn(conn);
      }
    });

    peer.on('connection', (conn) => {
      bindDataConn(conn);
    });

    peer.on('call', (call) => {
      call.answer(localStreamRef.current || undefined);
      call.on('stream', (remoteStream) => {
        let audioEl = remoteAudiosRef.current[call.peer];
        if (!audioEl) {
          audioEl = new Audio();
          audioEl.autoplay = true;
          remoteAudiosRef.current[call.peer] = audioEl;
        }
        audioEl.srcObject = remoteStream;
      });
    });

    peer.on('error', () => {
      setWsConnected(false);
    });

    return () => {
      peer.destroy();
      dataConnsRef.current = {};
    };
  }, [gameMode, roomCode, onlineRole, humanSeatIndex, playerName, triggerSeatBubble, chatDrawerOpen, showToast]);

  // ============================================================================
  // MICROPHONE AUDIO CAPTURE & LEVEL METER
  // ============================================================================
  const stopMicrophone = useCallback(() => {
    if (analyserRafRef.current) cancelAnimationFrame(analyserRafRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setMicEnabled(false);
    setMicLevel(0);
    setSpeakingPlayerIds((prev) => prev.filter((id) => id !== humanSeatIndex));
  }, [humanSeatIndex]);

  const toggleMicrophone = async () => {
    if (micEnabled) {
      stopMicrophone();
      showToast('Microphone muted');
      return;
    }
    try {
      setMicError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      setMicEnabled(true);
      showToast('Live Microphone connected');

      const AudioContextCls = window.AudioContext || window.webkitAudioContext;
      if (AudioContextCls) {
        const ctx = new AudioContextCls();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          const level = Math.min(100, Math.round(avg * 2.2));
          setMicLevel(level);

          const isTransmitting = !pttMode || pttHolding;
          stream.getAudioTracks().forEach((t) => {
            t.enabled = isTransmitting;
          });

          if (isTransmitting && level > 14) {
            setSpeakingPlayerIds((prev) => (prev.includes(humanSeatIndex) ? prev : [...prev, humanSeatIndex]));
          } else {
            setSpeakingPlayerIds((prev) => prev.filter((id) => id !== humanSeatIndex));
          }
          analyserRafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }
    } catch {
      setMicError('Mic permission blocked or unavailable (requires HTTPS)');
      showToast('Mic access denied — check browser permissions');
    }
  };

  useEffect(() => {
    return () => stopMicrophone();
  }, [stopMicrophone]);

  // ============================================================================
  // TABLE CHAT HANDLER
  // ============================================================================
  const sendTableChat = (customText) => {
    const text = (customText ?? chatInput).trim();
    if (!text) return;
    const sender = game?.players?.[humanSeatIndex] || { id: humanSeatIndex, name: playerName || 'You' };
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const entry = {
      id: `chat_${Date.now()}_${Math.random()}`,
      senderId: sender.id,
      senderName: sender.name,
      text,
      time,
    };
    setChatMessages((prev) => [...prev.slice(-39), entry]);
    triggerSeatBubble(sender.id, text, 'chat');
    if (!customText) setChatInput('');

    if (gameMode === 'online' && roomCode) {
      sendWsMessage({ type: 'chat_msg', entry });
    } else if (game && gameMode === 'ai') {
      const bots = game.players.filter((p) => p.isAI);
      if (bots.length > 0 && Math.random() < 0.65) {
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const replies = ['Let’s play! 🃏', 'Watch out for Deal Breaker 👀', 'Good luck! 🔥', 'My set is almost ready 😎'];
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev.slice(-39),
            { id: `bot_${Date.now()}`, senderId: bot.id, senderName: bot.name, text: replyText, time },
          ]);
          triggerSeatBubble(bot.id, replyText, 'chat');
        }, 900);
      }
    }
  };

  // ============================================================================
  // DRAW CARDS WITH AUTOMATIC DISCARD RESHUFFLE
  // ============================================================================
  const drawCardsFromDeck = (state, count) => {
    let drawPile = [...state.drawPile];
    let discardPile = [...state.discardPile];
    let shuffleCount = state.shuffleCount || 0;
    const drawn = [];

    for (let i = 0; i < count; i++) {
      if (drawPile.length === 0) {
        if (discardPile.length === 0) break;
        drawPile = shuffleArray(discardPile);
        discardPile = [];
        shuffleCount += 1;
      }
      if (drawPile.length > 0) {
        drawn.push(drawPile.shift());
      }
    }

    return { drawPile, discardPile, drawn, shuffleCount };
  };

  // ============================================================================
  // START & INITIALIZE MATCH
  // ============================================================================
  const startMatch = () => {
    const fullDeck = buildFullDeck();
    const count = Math.max(2, Math.min(6, playerCount));
    const clampedHumanSeat = Math.min(humanSeatIndex, count - 1);
    setHumanSeatIndex(clampedHumanSeat);

    const players = Array.from({ length: count }, (_, idx) => {
      const meta = SEAT_AVATARS[idx % SEAT_AVATARS.length];
      let name = meta.name;
      let isAI = false;

      if (gameMode === 'ai') {
        if (idx === clampedHumanSeat) {
          name = playerName.trim() || 'You';
          isAI = false;
        } else {
          name = meta.name;
          isAI = true;
        }
      } else if (gameMode === 'pass_play') {
        name = idx === clampedHumanSeat ? (playerName.trim() || 'Player 1') : `Player ${idx + 1}`;
        isAI = false;
      } else {
        const seatInfo = roomSeats[idx];
        name = idx === clampedHumanSeat ? (playerName.trim() || 'You') : (seatInfo?.name || `Bot ${meta.name}`);
        isAI = idx !== clampedHumanSeat && !seatInfo?.occupied;
      }

      return {
        id: idx,
        name,
        emoji: meta.emoji,
        flag: meta.flag,
        ring: meta.ring,
        rank: meta.rank,
        isAI,
        hand: [],
        bank: [],
        properties: [],
        buildings: {},
      };
    });

    // Deal 5 cards to each player
    let drawPile = [...fullDeck];
    players.forEach((p) => {
      p.hand = drawPile.splice(0, 5);
    });

    // First player (seat 0) draws 2 cards to start turn 1
    const firstTurnDrawn = drawPile.splice(0, 2);
    players[0].hand.push(...firstTurnDrawn);

    const initialState = {
      setsToWin,
      gameMode,
      turnTimerSetting,
      players,
      drawPile,
      discardPile: [],
      shuffleCount: 0,
      turnIndex: 0,
      actionsLeft: 3,
      pendingAction: null,
      winnerId: null,
      logs: [`Match started! First to ${setsToWin} full sets wins.`],
      lastEvent: { id: Date.now(), playerId: 0, text: 'Dealt 5 + 2 cards!', tone: 'good' },
    };

    lastShuffleCountRef.current = 0;
    setSelectedCardUid(null);
    setDoubleRentCount(0);
    setWildcardColorChoice(null);
    setRentColorChoice(null);
    setTargetModal(null);
    setPaymentSelection([]);
    setDiscardSelection([]);
    setGame(initialState);
    setScreen('game');
    broadcastGameState(initialState);

    if (gameMode === 'pass_play' && !players[0].isAI && 0 !== clampedHumanSeat) {
      setPassCurtainPlayer(players[0]);
    }
  };

  // Monitor Shuffle & Bubble Events
  useEffect(() => {
    if (!game) return;
    if ((game.shuffleCount || 0) > lastShuffleCountRef.current) {
      lastShuffleCountRef.current = game.shuffleCount;
      setShuffleBanner(true);
      showToast('Draw deck empty! Played cards reshuffled into deck.');
      setTimeout(() => setShuffleBanner(false), 2400);
    }
    if (game.lastEvent && game.lastEvent.id !== lastBubbleEventIdRef.current) {
      lastBubbleEventIdRef.current = game.lastEvent.id;
      triggerSeatBubble(game.lastEvent.playerId, game.lastEvent.text, game.lastEvent.tone);
    }
  }, [game, showToast, triggerSeatBubble]);

  // ============================================================================
  // CORE GAME STATE MUTATIONS & OFFICIAL RULES
  // ============================================================================
  const commitGameUpdate = useCallback((updater) => {
    setGame((prev) => {
      if (!prev) return prev;
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next.winnerId !== null && prev.winnerId === null) {
        setTimeout(() => setScreen('victory'), 450);
      }
      broadcastGameState(next);
      return next;
    });
  }, [broadcastGameState]);

  const checkVictoryOnState = (state) => {
    for (const p of state.players) {
      if (getCompletedSets(p).length >= state.setsToWin) {
        return { ...state, winnerId: p.id };
      }
    }
    return state;
  };

  // Rule: Flipping/Changing a Property Wildcard color on the table costs 1 action
  const flipWildcardColor = (playerId, cardUid, newColor = null) => {
    commitGameUpdate((prev) => {
      if (prev.turnIndex !== playerId || prev.pendingAction) return prev;
      if (prev.actionsLeft <= 0) {
        if (playerId === humanSeatIndex) showToast('No actions left to flip wildcard color!');
        return prev;
      }
      const players = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        const properties = p.properties.map((c) => {
          if (c.uid !== cardUid || c.type !== 'wildcard') return c;
          const colors = c.colors || ALL_COLORS;
          const currIdx = colors.indexOf(c.assignedColor || colors[0]);
          const nextColor = newColor || colors[(currIdx + 1) % colors.length];
          return { ...c, assignedColor: nextColor };
        });
        return { ...p, properties };
      });
      const actor = players[playerId];
      const next = checkVictoryOnState({
        ...prev,
        players,
        actionsLeft: prev.actionsLeft - 1,
        logs: [`${actor.name} flipped a wildcard color (1 action).`, ...prev.logs.slice(0, 29)],
        lastEvent: { id: Date.now(), playerId, text: 'Flipped Wildcard!', tone: 'neutral' },
      });
      return next;
    });
  };

  // Rule: Only Money, Action, and Rent cards can be banked — Properties & Wildcards CANNOT be banked
  const bankCard = (playerId, cardUid) => {
    commitGameUpdate((prev) => {
      if (prev.turnIndex !== playerId || prev.actionsLeft <= 0 || prev.pendingAction) return prev;
      const actor = prev.players[playerId];
      const card = actor.hand.find((c) => c.uid === cardUid);
      if (!card) return prev;
      if (card.type === 'property' || card.type === 'wildcard') {
        if (playerId === humanSeatIndex) showToast('Properties cannot be placed in the Bank!');
        return prev;
      }

      const players = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          hand: p.hand.filter((c) => c.uid !== cardUid),
          bank: [...p.bank, card],
        };
      });

      setSelectedCardUid(null);
      setDoubleRentCount(0);
      return {
        ...prev,
        players,
        actionsLeft: prev.actionsLeft - 1,
        logs: [`${actor.name} banked ${card.name} ($${card.value}M).`, ...prev.logs.slice(0, 29)],
        lastEvent: { id: Date.now(), playerId, text: `Banked $${card.value}M`, tone: 'good' },
      };
    });
  };

  const playPropertyCard = (playerId, cardUid, chosenColor = null) => {
    commitGameUpdate((prev) => {
      if (prev.turnIndex !== playerId || prev.actionsLeft <= 0 || prev.pendingAction) return prev;
      const actor = prev.players[playerId];
      const card = actor.hand.find((c) => c.uid === cardUid);
      if (!card || (card.type !== 'property' && card.type !== 'wildcard')) return prev;

      const assignedColor =
        card.type === 'property'
          ? card.color
          : chosenColor || (card.colors && card.colors[0]) || 'brown';

      const players = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          hand: p.hand.filter((c) => c.uid !== cardUid),
          properties: [...p.properties, { ...card, assignedColor }],
        };
      });

      setSelectedCardUid(null);
      setWildcardColorChoice(null);
      return checkVictoryOnState({
        ...prev,
        players,
        actionsLeft: prev.actionsLeft - 1,
        logs: [`${actor.name} played ${card.name} (${COLOR_META[assignedColor].name}).`, ...prev.logs.slice(0, 29)],
        lastEvent: { id: Date.now(), playerId, text: `${COLOR_META[assignedColor].name}!`, tone: 'good' },
      });
    });
  };

  // Play Action or Rent Card (including stacked Double The Rent!)
  const executePlayAction = (playerId, cardUid, options = {}) => {
    commitGameUpdate((prev) => {
      if (prev.turnIndex !== playerId || prev.actionsLeft <= 0 || prev.pendingAction) return prev;
      const actor = prev.players[playerId];
      const card = actor.hand.find((c) => c.uid === cardUid);
      if (!card) return prev;

      // Double The Rent cannot be played standalone
      if (card.type === 'action' && card.action === 'double_rent') {
        if (playerId === humanSeatIndex) {
          showToast('Select a Rent card first, then attach Double The Rent!');
        }
        return prev;
      }

      let discardPile = [...prev.discardPile];
      let drawPile = [...prev.drawPile];
      let shuffleCount = prev.shuffleCount || 0;
      let actionsSpent = 1;
      let usedCardUids = [cardUid];

      // PASS GO: Draw 2 cards
      if (card.type === 'action' && card.action === 'pass_go') {
        discardPile.push(card);
        const res = drawCardsFromDeck({ drawPile, discardPile, shuffleCount }, 2);
        drawPile = res.drawPile;
        discardPile = res.discardPile;
        shuffleCount = res.shuffleCount;

        const players = prev.players.map((p) =>
          p.id === playerId
            ? { ...p, hand: [...p.hand.filter((c) => c.uid !== cardUid), ...res.drawn] }
            : p
        );
        setSelectedCardUid(null);
        return {
          ...prev,
          players,
          drawPile,
          discardPile,
          shuffleCount,
          actionsLeft: prev.actionsLeft - 1,
          logs: [`${actor.name} played Pass Go (+2 cards).`, ...prev.logs.slice(0, 29)],
          lastEvent: { id: Date.now(), playerId, text: 'Pass Go +2!', tone: 'good' },
        };
      }

      // HOUSE / HOTEL
      if (card.type === 'action' && (card.action === 'house' || card.action === 'hotel')) {
        const targetColor = options.color;
        if (!targetColor) return prev;
        discardPile.push(card);
        const players = prev.players.map((p) => {
          if (p.id !== playerId) return p;
          const prevB = p.buildings?.[targetColor] || {};
          return {
            ...p,
            hand: p.hand.filter((c) => c.uid !== cardUid),
            buildings: {
              ...p.buildings,
              [targetColor]: {
                ...prevB,
                [card.action]: true,
              },
            },
          };
        });
        setSelectedCardUid(null);
        setTargetModal(null);
        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - 1,
          logs: [`${actor.name} added a ${card.name} to ${COLOR_META[targetColor].name}.`, ...prev.logs.slice(0, 29)],
          lastEvent: { id: Date.now(), playerId, text: `+${card.name}!`, tone: 'good' },
        };
      }

      // RENT (Standard Dual-Color or Wild Rent) + Optional 1 or 2 Double The Rent cards
      if (card.type === 'rent') {
        const chosenColor = options.color || card.colors[0];
        const baseRent = calculateRentForColor(actor, chosenColor);
        if (baseRent <= 0) {
          if (playerId === humanSeatIndex) showToast(`You have no ${COLOR_META[chosenColor].name} properties!`);
          return prev;
        }

        const requestedDoubles = Math.min(
          options.doubleCount || 0,
          2,
          prev.actionsLeft - 1
        );
        const availableDoubleCards = actor.hand.filter(
          (c) => c.type === 'action' && c.action === 'double_rent' && c.uid !== cardUid
        );
        const actualDoubles = Math.min(requestedDoubles, availableDoubleCards.length);
        const doubleCardsToUse = availableDoubleCards.slice(0, actualDoubles);

        actionsSpent = 1 + actualDoubles;
        usedCardUids = [cardUid, ...doubleCardsToUse.map((c) => c.uid)];
        discardPile.push(card, ...doubleCardsToUse);

        const multiplier = actualDoubles === 2 ? 4 : actualDoubles === 1 ? 2 : 1;
        const totalRent = baseRent * multiplier;
        const isWildRent = card.colors.length >= 10;

        let targetIds = [];
        if (isWildRent) {
          if (options.targetPlayerId === undefined || options.targetPlayerId === null) return prev;
          targetIds = [options.targetPlayerId];
        } else {
          targetIds = prev.players.filter((p) => p.id !== playerId).map((p) => p.id);
        }

        const players = prev.players.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => !usedCardUids.includes(c.uid)) } : p
        );

        const queue = targetIds.map((tid) => ({
          type: 'pay',
          fromId: tid,
          toId: playerId,
          amount: totalRent,
          reason: `${COLOR_META[chosenColor].name} Rent${multiplier > 1 ? ` (×${multiplier})` : ''}`,
        }));

        setSelectedCardUid(null);
        setDoubleRentCount(0);
        setRentColorChoice(null);
        setTargetModal(null);
        setPaymentSelection([]);

        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - actionsSpent,
          pendingAction: queue[0] || null,
          actionQueue: queue.slice(1),
          logs: [
            `${actor.name} charged $${totalRent}M ${COLOR_META[chosenColor].name} Rent${multiplier > 1 ? ` (×${multiplier} Double Rent)` : ''}!`,
            ...prev.logs.slice(0, 29),
          ],
          lastEvent: { id: Date.now(), playerId, text: `Rent $${totalRent}M!`, tone: 'warn' },
        };
      }

      // IT'S MY BIRTHDAY ($2M from all players)
      if (card.type === 'action' && card.action === 'birthday') {
        discardPile.push(card);
        const players = prev.players.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => c.uid !== cardUid) } : p
        );
        const queue = prev.players
          .filter((p) => p.id !== playerId)
          .map((p) => ({
            type: 'pay',
            fromId: p.id,
            toId: playerId,
            amount: 2,
            reason: "It's My Birthday ($2M)",
          }));

        setSelectedCardUid(null);
        setPaymentSelection([]);
        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - 1,
          pendingAction: queue[0] || null,
          actionQueue: queue.slice(1),
          logs: [`${actor.name} played It's My Birthday ($2M from everyone)!`, ...prev.logs.slice(0, 29)],
          lastEvent: { id: Date.now(), playerId, text: 'Birthday $2M!', tone: 'warn' },
        };
      }

      // DEBT COLLECTOR ($5M from 1 player)
      if (card.type === 'action' && card.action === 'debt_collector') {
        if (options.targetPlayerId === undefined) return prev;
        discardPile.push(card);
        const players = prev.players.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => c.uid !== cardUid) } : p
        );
        setSelectedCardUid(null);
        setTargetModal(null);
        setPaymentSelection([]);
        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - 1,
          pendingAction: {
            type: 'pay',
            fromId: options.targetPlayerId,
            toId: playerId,
            amount: 5,
            reason: 'Debt Collector ($5M)',
          },
          actionQueue: [],
          logs: [
            `${actor.name} used Debt Collector on ${prev.players[options.targetPlayerId].name} ($5M)!`,
            ...prev.logs.slice(0, 29),
          ],
          lastEvent: { id: Date.now(), playerId, text: 'Pay $5M!', tone: 'warn' },
        };
      }

      // SLY DEAL (Steal 1 incomplete-set property)
      if (card.type === 'action' && card.action === 'sly_deal') {
        if (options.targetPlayerId === undefined || !options.targetCardUid) return prev;
        const targetPlayer = prev.players[options.targetPlayerId];
        const targetCard = targetPlayer.properties.find((c) => c.uid === options.targetCardUid);
        if (!targetCard) return prev;

        // Enforce Full-Set Protection
        const targetColor = targetCard.assignedColor || targetCard.color || targetCard.colors?.[0];
        const fullSets = getCompletedSets(targetPlayer);
        if (fullSets.includes(targetColor)) {
          if (playerId === humanSeatIndex) showToast('Cannot steal a property from a completed Full Set!');
          return prev;
        }

        discardPile.push(card);
        const players = prev.players.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => c.uid !== cardUid) } : p
        );
        setSelectedCardUid(null);
        setTargetModal(null);
        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - 1,
          pendingAction: {
            type: 'sly_deal',
            fromId: options.targetPlayerId,
            toId: playerId,
            targetCardUid: options.targetCardUid,
            reason: `Sly Deal (${targetCard.name})`,
          },
          actionQueue: [],
          logs: [
            `${actor.name} played Sly Deal targeting ${targetPlayer.name}'s ${targetCard.name}!`,
            ...prev.logs.slice(0, 29),
          ],
          lastEvent: { id: Date.now(), playerId, text: 'Sly Deal!', tone: 'warn' },
        };
      }

      // FORCED DEAL (Swap 1 incomplete-set property)
      if (card.type === 'action' && card.action === 'forced_deal') {
        if (options.targetPlayerId === undefined || !options.targetCardUid || !options.myCardUid) return prev;
        const targetPlayer = prev.players[options.targetPlayerId];
        const targetCard = targetPlayer.properties.find((c) => c.uid === options.targetCardUid);
        const myCard = actor.properties.find((c) => c.uid === options.myCardUid);
        if (!targetCard || !myCard) return prev;

        // Enforce Full-Set Protection on both sides
        const targetColor = targetCard.assignedColor || targetCard.color || targetCard.colors?.[0];
        const myColor = myCard.assignedColor || myCard.color || myCard.colors?.[0];
        if (getCompletedSets(targetPlayer).includes(targetColor) || getCompletedSets(actor).includes(myColor)) {
          if (playerId === humanSeatIndex) showToast('Properties inside a Full Set cannot be swapped!');
          return prev;
        }

        discardPile.push(card);
        const players = prev.players.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => c.uid !== cardUid) } : p
        );
        setSelectedCardUid(null);
        setTargetModal(null);
        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - 1,
          pendingAction: {
            type: 'forced_deal',
            fromId: options.targetPlayerId,
            toId: playerId,
            targetCardUid: options.targetCardUid,
            myCardUid: options.myCardUid,
            reason: `Forced Deal (${myCard.name} ⇄ ${targetCard.name})`,
          },
          actionQueue: [],
          logs: [
            `${actor.name} proposed Forced Deal with ${targetPlayer.name}!`,
            ...prev.logs.slice(0, 29),
          ],
          lastEvent: { id: Date.now(), playerId, text: 'Forced Deal!', tone: 'warn' },
        };
      }

      // DEAL BREAKER (Steal a full property set)
      if (card.type === 'action' && card.action === 'deal_breaker') {
        if (options.targetPlayerId === undefined || !options.targetColor) return prev;
        const targetPlayer = prev.players[options.targetPlayerId];
        if (!getCompletedSets(targetPlayer).includes(options.targetColor)) return prev;

        discardPile.push(card);
        const players = prev.players.map((p) =>
          p.id === playerId ? { ...p, hand: p.hand.filter((c) => c.uid !== cardUid) } : p
        );
        setSelectedCardUid(null);
        setTargetModal(null);
        return {
          ...prev,
          players,
          discardPile,
          actionsLeft: prev.actionsLeft - 1,
          pendingAction: {
            type: 'deal_breaker',
            fromId: options.targetPlayerId,
            toId: playerId,
            targetColor: options.targetColor,
            reason: `Deal Breaker (${COLOR_META[options.targetColor].name} Set)`,
          },
          actionQueue: [],
          logs: [
            `${actor.name} unleashed DEAL BREAKER on ${targetPlayer.name}'s ${COLOR_META[options.targetColor].name} set!`,
            ...prev.logs.slice(0, 29),
          ],
          lastEvent: { id: Date.now(), playerId, text: 'DEAL BREAKER!', tone: 'warn' },
        };
      }

      return prev;
    });
  };

  // ============================================================================
  // JUST SAY NO & COUNTER-CHAIN RESOLUTION
  // ============================================================================
  const playJustSayNoResponse = (responderId) => {
    commitGameUpdate((prev) => {
      const pending = prev.pendingAction;
      if (!pending) return prev;
      const responder = prev.players[responderId];
      const jsnCard = responder.hand.find((c) => c.type === 'action' && c.action === 'just_say_no');
      if (!jsnCard) return prev;

      const players = prev.players.map((p) =>
        p.id === responderId
          ? { ...p, hand: p.hand.filter((c) => c.uid !== jsnCard.uid) }
          : p
      );
      const discardPile = [...prev.discardPile, jsnCard];

      // If currently a normal action -> transition to jsn_counter awaiting attacker's response
      if (pending.type !== 'jsn_counter') {
        return {
          ...prev,
          players,
          discardPile,
          pendingAction: {
            type: 'jsn_counter',
            responderId: pending.toId, // Original attacker can now counter-cancel
            defenderId: pending.fromId, // Original defender
            attackerId: pending.toId,
            originalAction: pending,
            chainCount: 1,
            reason: `${responder.name} played Just Say No!`,
          },
          logs: [`${responder.name} blocked with JUST SAY NO!`, ...prev.logs.slice(0, 29)],
          lastEvent: { id: Date.now(), playerId: responderId, text: 'Just Say No! 🛑', tone: 'warn' },
        };
      }

      // Alternating counter-chain: toggle who needs to respond next
      const nextResponderId = responderId === pending.attackerId ? pending.defenderId : pending.attackerId;
      return {
        ...prev,
        players,
        discardPile,
        pendingAction: {
          ...pending,
          responderId: nextResponderId,
          chainCount: (pending.chainCount || 1) + 1,
          reason: `${responder.name} countered with JUST SAY NO!`,
        },
        logs: [`${responder.name} countered with JUST SAY NO!`, ...prev.logs.slice(0, 29)],
        lastEvent: { id: Date.now(), playerId: responderId, text: 'Counter No! 🛑', tone: 'warn' },
      };
    });
  };

  const acceptJustSayNoOutcome = () => {
    commitGameUpdate((prev) => {
      const pending = prev.pendingAction;
      if (!pending || pending.type !== 'jsn_counter') return prev;
      // Odd chainCount -> Defender's Just Say No stands (action canceled)
      // Even chainCount -> Attacker's counter stands (original action proceeds)
      const actionCanceled = (pending.chainCount || 1) % 2 === 1;
      if (actionCanceled) {
        const nextPending = (prev.actionQueue || [])[0] || null;
        return {
          ...prev,
          pendingAction: nextPending,
          actionQueue: (prev.actionQueue || []).slice(1),
          logs: ['Action was canceled by Just Say No.', ...prev.logs.slice(0, 29)],
        };
      }
      return {
        ...prev,
        pendingAction: pending.originalAction,
        logs: ['Counter-Just Say No succeeded! Original action resolves.', ...prev.logs.slice(0, 29)],
      };
    });
  };

  // Resolve Pending Action (Payment, Sly Deal, Forced Deal, Deal Breaker)
  const resolvePendingAction = (selectedAssetUids = []) => {
    commitGameUpdate((prev) => {
      const pending = prev.pendingAction;
      if (!pending || pending.type === 'jsn_counter') return prev;

      let players = prev.players.map((p) => ({
        ...p,
        hand: [...p.hand],
        bank: [...p.bank],
        properties: [...p.properties],
        buildings: { ...p.buildings },
      }));

      const fromP = players[pending.fromId];
      const toP = players[pending.toId];

      if (pending.type === 'pay') {
        const transferBank = [];
        const transferProps = [];
        fromP.bank = fromP.bank.filter((c) => {
          if (selectedAssetUids.includes(c.uid)) {
            transferBank.push(c);
            return false;
          }
          return true;
        });
        fromP.properties = fromP.properties.filter((c) => {
          if (selectedAssetUids.includes(c.uid)) {
            transferProps.push(c);
            return false;
          }
          return true;
        });

        toP.bank.push(...transferBank);
        toP.properties.push(...transferProps);
        const totalPaid = [...transferBank, ...transferProps].reduce((s, c) => s + (c.value || 0), 0);

        const nextPending = (prev.actionQueue || [])[0] || null;
        setPaymentSelection([]);
        return checkVictoryOnState({
          ...prev,
          players,
          pendingAction: nextPending,
          actionQueue: (prev.actionQueue || []).slice(1),
          logs: [`${fromP.name} paid $${totalPaid}M to ${toP.name}.`, ...prev.logs.slice(0, 29)],
          lastEvent: { id: Date.now(), playerId: fromP.id, text: `Paid $${totalPaid}M`, tone: 'neutral' },
        });
      }

      if (pending.type === 'sly_deal') {
        const idx = fromP.properties.findIndex((c) => c.uid === pending.targetCardUid);
        if (idx !== -1) {
          const [stolen] = fromP.properties.splice(idx, 1);
          toP.properties.push(stolen);
        }
        const nextPending = (prev.actionQueue || [])[0] || null;
        return checkVictoryOnState({
          ...prev,
          players,
          pendingAction: nextPending,
          actionQueue: (prev.actionQueue || []).slice(1),
          logs: [`${toP.name} stole a property from ${fromP.name}!`, ...prev.logs.slice(0, 29)],
        });
      }

      if (pending.type === 'forced_deal') {
        const theirIdx = fromP.properties.findIndex((c) => c.uid === pending.targetCardUid);
        const myIdx = toP.properties.findIndex((c) => c.uid === pending.myCardUid);
        if (theirIdx !== -1 && myIdx !== -1) {
          const [theirCard] = fromP.properties.splice(theirIdx, 1);
          const [myCard] = toP.properties.splice(myIdx, 1);
          toP.properties.push(theirCard);
          fromP.properties.push(myCard);
        }
        const nextPending = (prev.actionQueue || [])[0] || null;
        return checkVictoryOnState({
          ...prev,
          players,
          pendingAction: nextPending,
          actionQueue: (prev.actionQueue || []).slice(1),
          logs: [`${toP.name} swapped properties with ${fromP.name}!`, ...prev.logs.slice(0, 29)],
        });
      }

      if (pending.type === 'deal_breaker') {
        const stolenSet = [];
        fromP.properties = fromP.properties.filter((c) => {
          const col = c.assignedColor || c.color || c.colors?.[0];
          if (col === pending.targetColor) {
            stolenSet.push(c);
            return false;
          }
          return true;
        });
        toP.properties.push(...stolenSet);
        if (fromP.buildings?.[pending.targetColor]) {
          toP.buildings[pending.targetColor] = { ...fromP.buildings[pending.targetColor] };
          delete fromP.buildings[pending.targetColor];
        }
        const nextPending = (prev.actionQueue || [])[0] || null;
        return checkVictoryOnState({
          ...prev,
          players,
          pendingAction: nextPending,
          actionQueue: (prev.actionQueue || []).slice(1),
          logs: [
            `${toP.name} took ${fromP.name}'s full ${COLOR_META[pending.targetColor].name} set!`,
            ...prev.logs.slice(0, 29),
          ],
        });
      }

      return prev;
    });
  };

  // ============================================================================
  // END TURN & 7-CARD HAND LIMIT ENFORCEMENT
  // ============================================================================
  const advanceTurn = useCallback((state, excessDiscardUids = []) => {
    const currIdx = state.turnIndex;
    const currPlayer = state.players[currIdx];

    let discardedCards = [];
    const updatedCurrHand = currPlayer.hand.filter((c) => {
      if (excessDiscardUids.includes(c.uid)) {
        discardedCards.push(c);
        return false;
      }
      return true;
    });

    const nextIdx = (currIdx + 1) % state.players.length;
    const nextPlayer = state.players[nextIdx];
    const drawCount = nextPlayer.hand.length === 0 ? 5 : 2;

    const res = drawCardsFromDeck(
      {
        drawPile: state.drawPile,
        discardPile: [...state.discardPile, ...discardedCards],
        shuffleCount: state.shuffleCount || 0,
      },
      drawCount
    );

    const players = state.players.map((p, idx) => {
      if (idx === currIdx) return { ...p, hand: updatedCurrHand };
      if (idx === nextIdx) return { ...p, hand: [...p.hand, ...res.drawn] };
      return p;
    });

    return {
      ...state,
      players,
      drawPile: res.drawPile,
      discardPile: res.discardPile,
      shuffleCount: res.shuffleCount,
      turnIndex: nextIdx,
      actionsLeft: 3,
      pendingAction: null,
      actionQueue: [],
      logs: [`${nextPlayer.name}'s turn (+${res.drawn.length} cards).`, ...state.logs.slice(0, 29)],
      lastEvent: { id: Date.now(), playerId: nextIdx, text: `+${res.drawn.length} Cards`, tone: 'neutral' },
    };
  }, []);

  const handleEndTurnClick = () => {
    if (!game || game.pendingAction || game.winnerId !== null) return;
    const currPlayer = game.players[game.turnIndex];
    if (currPlayer.hand.length > 7) {
      const excessCount = currPlayer.hand.length - 7;
      if (discardSelection.length < excessCount) {
        showToast(`Discard ${excessCount} card(s) to end turn with max 7 cards!`);
        return;
      }
    }
    setSelectedCardUid(null);
    setDoubleRentCount(0);
    setWildcardColorChoice(null);
    setRentColorChoice(null);
    setTargetModal(null);

    commitGameUpdate((prev) => {
      const next = advanceTurn(prev, discardSelection);
      setDiscardSelection([]);
      if (prev.gameMode === 'pass_play' && !next.players[next.turnIndex].isAI) {
        setPassCurtainPlayer(next.players[next.turnIndex]);
      }
      return next;
    });
  };

  // Optional Turn Timer
  useEffect(() => {
    if (!game || screen !== 'game' || !game.turnTimerSetting || game.winnerId !== null) {
      setTurnSecondsLeft(null);
      return;
    }
    setTurnSecondsLeft(game.turnTimerSetting);
    const interval = setInterval(() => {
      setTurnSecondsLeft((sec) => {
        if (sec === null) return null;
        if (sec <= 1) {
          const g = gameRef.current;
          if (g && !g.pendingAction && g.turnIndex === humanSeatIndex) {
            const p = g.players[humanSeatIndex];
            const autoDiscard = p.hand.length > 7 ? p.hand.slice(7).map((c) => c.uid) : [];
            commitGameUpdate((prev) => advanceTurn(prev, autoDiscard));
          }
          return g?.turnTimerSetting || 15;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [game?.turnIndex, game?.turnTimerSetting, screen, humanSeatIndex, advanceTurn, commitGameUpdate]);

  // ============================================================================
  // SMART AI OPPONENT ENGINE
  // ============================================================================
  useEffect(() => {
    if (!game || screen !== 'game' || game.winnerId !== null) return;

    // 1. AI responding to pendingAction (Payment, Sly Deal, Forced Deal, Deal Breaker, or JSN counter)
    if (game.pendingAction) {
      const pending = game.pendingAction;
      const responderId = pending.type === 'jsn_counter' ? pending.responderId : pending.fromId;
      const responder = game.players[responderId];
      if (!responder || !responder.isAI) return;

      aiTimeoutRef.current = setTimeout(() => {
        const hasJsn = responder.hand.some((c) => c.type === 'action' && c.action === 'just_say_no');
        const isHighValueThreat =
          pending.type === 'deal_breaker' ||
          pending.type === 'sly_deal' ||
          (pending.type === 'pay' && pending.amount >= 4) ||
          (pending.type === 'jsn_counter' && (pending.chainCount || 1) % 2 === 1);

        if (hasJsn && isHighValueThreat && Math.random() < 0.78) {
          playJustSayNoResponse(responderId);
          return;
        }

        if (pending.type === 'jsn_counter') {
          acceptJustSayNoOutcome();
          return;
        }

        if (pending.type === 'pay') {
          const assets = getPayableAssets(responder).sort((a, b) => {
            if (a.source !== b.source) return a.source === 'bank' ? -1 : 1;
            return (a.value || 0) - (b.value || 0);
          });
          let sum = 0;
          const chosen = [];
          for (const item of assets) {
            if (sum >= pending.amount) break;
            chosen.push(item.uid);
            sum += item.value || 0;
          }
          resolvePendingAction(chosen);
          return;
        }

        resolvePendingAction([]);
      }, 950);

      return () => clearTimeout(aiTimeoutRef.current);
    }

    // 2. AI taking its active turn
    const activePlayer = game.players[game.turnIndex];
    if (!activePlayer || !activePlayer.isAI) return;

    aiTimeoutRef.current = setTimeout(() => {
      if (game.actionsLeft <= 0) {
        const excess = activePlayer.hand.length > 7
          ? [...activePlayer.hand]
              .sort((a, b) => (a.value || 0) - (b.value || 0))
              .slice(0, activePlayer.hand.length - 7)
              .map((c) => c.uid)
          : [];
        commitGameUpdate((prev) => advanceTurn(prev, excess));
        return;
      }

      const hand = activePlayer.hand;

      // Priority 1: Deal Breaker on any opponent with a completed set
      const dealBreaker = hand.find((c) => c.type === 'action' && c.action === 'deal_breaker');
      if (dealBreaker) {
        for (const opp of game.players) {
          if (opp.id === activePlayer.id) continue;
          const sets = getCompletedSets(opp);
          if (sets.length > 0) {
            executePlayAction(activePlayer.id, dealBreaker.uid, {
              targetPlayerId: opp.id,
              targetColor: sets[0],
            });
            return;
          }
        }
      }

      // Priority 2: Pass Go if hand <= 5
      const passGo = hand.find((c) => c.type === 'action' && c.action === 'pass_go');
      if (passGo && hand.length <= 5) {
        executePlayAction(activePlayer.id, passGo.uid);
        return;
      }

      // Priority 3: Play Property or Wildcard
      const propCard = hand.find((c) => c.type === 'property' || c.type === 'wildcard');
      if (propCard) {
        let bestColor = propCard.color;
        if (propCard.type === 'wildcard') {
          const groups = getGroupedProperties(activePlayer.properties);
          bestColor = [...propCard.colors].sort((a, b) => (groups[b]?.length || 0) - (groups[a]?.length || 0))[0];
        }
        playPropertyCard(activePlayer.id, propCard.uid, bestColor);
        return;
      }

      // Priority 4: Charge Rent (with up to 2 Double The Rent cards if available)
      const rentCard = hand.find((c) => c.type === 'rent');
      if (rentCard) {
        const bestColor = [...rentCard.colors].sort(
          (a, b) => calculateRentForColor(activePlayer, b) - calculateRentForColor(activePlayer, a)
        )[0];
        if (calculateRentForColor(activePlayer, bestColor) > 0) {
          const doubleCards = hand.filter((c) => c.type === 'action' && c.action === 'double_rent');
          const doubleCount = Math.min(doubleCards.length, game.actionsLeft - 1, 2);
          const richestOpp = [...game.players]
            .filter((p) => p.id !== activePlayer.id)
            .sort((a, b) => getBankTotal(b) + b.properties.length * 2 - (getBankTotal(a) + a.properties.length * 2))[0];
          executePlayAction(activePlayer.id, rentCard.uid, {
            color: bestColor,
            doubleCount,
            targetPlayerId: richestOpp?.id,
          });
          return;
        }
      }

      // Priority 5: Birthday / Debt Collector / Sly Deal
      const birthday = hand.find((c) => c.type === 'action' && c.action === 'birthday');
      if (birthday) {
        executePlayAction(activePlayer.id, birthday.uid);
        return;
      }

      const debtCard = hand.find((c) => c.type === 'action' && c.action === 'debt_collector');
      if (debtCard) {
        const target = [...game.players]
          .filter((p) => p.id !== activePlayer.id)
          .sort((a, b) => getBankTotal(b) - getBankTotal(a))[0];
        if (target) {
          executePlayAction(activePlayer.id, debtCard.uid, { targetPlayerId: target.id });
          return;
        }
      }

      const slyCard = hand.find((c) => c.type === 'action' && c.action === 'sly_deal');
      if (slyCard) {
        for (const opp of game.players) {
          if (opp.id === activePlayer.id) continue;
          const fullSets = getCompletedSets(opp);
          const stealable = opp.properties.find((c) => {
            const col = c.assignedColor || c.color || c.colors?.[0];
            return !fullSets.includes(col);
          });
          if (stealable) {
            executePlayAction(activePlayer.id, slyCard.uid, {
              targetPlayerId: opp.id,
              targetCardUid: stealable.uid,
            });
            return;
          }
        }
      }

      // Priority 6: Bank Money or spare Action card
      const bankable = hand.find((c) => c.type === 'money' || (c.type === 'action' && c.action !== 'just_say_no'));
      if (bankable) {
        bankCard(activePlayer.id, bankable.uid);
        return;
      }

      // End turn & discard down to 7 cards if needed
      const excess = activePlayer.hand.length > 7
        ? [...activePlayer.hand]
            .sort((a, b) => (a.value || 0) - (b.value || 0))
            .slice(0, activePlayer.hand.length - 7)
            .map((c) => c.uid)
        : [];
      commitGameUpdate((prev) => advanceTurn(prev, excess));
    }, 900);

    return () => clearTimeout(aiTimeoutRef.current);
  }, [game, screen, advanceTurn, commitGameUpdate]);

  // ============================================================================
  // PERSPECTIVE ROTATION & 6-SEAT LAYOUT MAPPING
  // ============================================================================
  const localPlayer = game?.players?.[humanSeatIndex] || null;

  // Map relative seat offsets (1 .. N-1) around the landscape table perimeter
  const opponentSeatSlots = useMemo(() => {
    if (!game) return {};
    const total = game.players.length;
    const slots = {};
    for (let offset = 1; offset < total; offset++) {
      const p = game.players[(humanSeatIndex + offset) % total];
      if (total === 2) {
        slots.north = p;
      } else if (total === 3) {
        if (offset === 1) slots.westSouth = p;
        if (offset === 2) slots.eastSouth = p;
      } else if (total === 4) {
        if (offset === 1) slots.westSouth = p;
        if (offset === 2) slots.north = p;
        if (offset === 3) slots.eastSouth = p;
      } else if (total === 5) {
        if (offset === 1) slots.westSouth = p;
        if (offset === 2) slots.westNorth = p;
        if (offset === 3) slots.eastNorth = p;
        if (offset === 4) slots.eastSouth = p;
      } else {
        if (offset === 1) slots.westSouth = p;
        if (offset === 2) slots.westNorth = p;
        if (offset === 3) slots.north = p;
        if (offset === 4) slots.eastNorth = p;
        if (offset === 5) slots.eastSouth = p;
      }
    }
    return slots;
  }, [game, humanSeatIndex]);

  // ============================================================================
  // COMPACT ICON-ONLY TABLE MAT & OPPONENT POD RENDERERS
  // ============================================================================
  const renderPropertyChipBar = (player, isSelf = false) => {
    const groups = getGroupedProperties(player.properties);
    const activeColors = ALL_COLORS.filter((c) => (groups[c] || []).length > 0);
    const completed = getCompletedSets(player);
    const bankCount = player.bank?.length || 0;
    const bankSum = getBankTotal(player);

    return (
      <div className="flex flex-wrap items-center gap-1">
        {/* Bank Pill: Known $ for Self, Unknown 🔒 ×N for Opponents */}
        <button
          onClick={() => setInspectPlayerId(player.id)}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-black shadow-sm transition active:scale-95 ${
            isSelf
              ? 'bg-emerald-950/90 border-amber-400/70 text-amber-300'
              : 'bg-slate-900/90 border-slate-600/80 text-slate-200'
          }`}
          title={isSelf ? `Your Bank: $${bankSum}M (${bankCount} bills)` : `Opponent Bank: ${bankCount} face-down bills (Unknown value)`}
        >
          <Coins className="w-2.5 h-2.5 text-amber-400 shrink-0" />
          {isSelf ? (
            <span>${bankSum}M</span>
          ) : (
            <span className="flex items-center gap-0.5 text-amber-200/90">
              <span>×{bankCount}</span>
              <Lock className="w-2.5 h-2.5 text-amber-400" />
            </span>
          )}
        </button>

        {/* Compact Icon-Only Property Set Chips */}
        {activeColors.map((color) => {
          const cards = groups[color];
          const meta = COLOR_META[color];
          const isFull = completed.includes(color);
          const bldg = player.buildings?.[color] || {};
          const wildInGroup = isSelf ? cards.find((c) => c.type === 'wildcard') : null;

          return (
            <div
              key={color}
              onClick={() => setInspectPlayerId(player.id)}
              style={{ backgroundColor: meta.bg, borderColor: isFull ? '#FBBF24' : meta.border, color: meta.text }}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-extrabold shadow-sm cursor-pointer select-none ${
                isFull ? 'ring-1 ring-amber-300' : ''
              }`}
              title={`${meta.name}: ${cards.length}/${meta.req}${isFull ? ' (FULL SET)' : ''}`}
            >
              {/* Miniature card pips */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: meta.req }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-2.5 rounded-[1px] border border-black/30 ${
                      idx < cards.length ? 'bg-white' : 'bg-black/25'
                    }`}
                  />
                ))}
              </div>
              <span className="leading-none">
                {cards.length}/{meta.req}
              </span>
              {isFull && <Crown className="w-2.5 h-2.5 text-amber-300 shrink-0" />}
              {bldg.house && <Home className="w-2.5 h-2.5 text-emerald-200 shrink-0" />}
              {bldg.hotel && <Building2 className="w-2.5 h-2.5 text-rose-200 shrink-0" />}
              {isSelf && wildInGroup && game?.turnIndex === player.id && !game?.pendingAction && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    flipWildcardColor(player.id, wildInGroup.uid);
                  }}
                  className="ml-0.5 px-1 rounded bg-black/35 hover:bg-black/60 text-white text-[9px] leading-tight"
                  title="Flip Wildcard Color (Costs 1 Action)"
                >
                  ↻
                </button>
              )}
            </div>
          );
        })}

        {activeColors.length === 0 && (
          <span className="text-[9px] text-emerald-200/55 italic px-1">No properties</span>
        )}
      </div>
    );
  };

  const renderOpponentPod = (player, align = 'left') => {
    if (!player) return null;
    const isTurn = game.turnIndex === player.id;
    const isSpeaking = speakingPlayerIds.includes(player.id);
    const setsDone = getCompletedSets(player).length;
    const bubble = seatBubbles[player.id];

    return (
      <div
        className={`relative flex flex-col gap-1 px-2 py-1.5 rounded-xl border backdrop-blur-sm transition-all max-w-[235px] ${
          isTurn
            ? 'bg-emerald-950/90 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.45)]'
            : 'bg-black/45 border-emerald-700/60'
        } ${align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
      >
        {/* Floating Speech Bubble */}
        {bubble && (
          <div
            className={`absolute -top-6 z-30 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-lg border whitespace-nowrap animate-bounce ${
              bubble.tone === 'warn'
                ? 'bg-rose-600 text-white border-rose-300'
                : bubble.tone === 'chat'
                ? 'bg-sky-600 text-white border-sky-200'
                : 'bg-amber-400 text-slate-950 border-amber-100'
            }`}
          >
            {bubble.text}
          </div>
        )}

        {/* Header: Avatar + Name + Hand Count + Sets */}
        <div className="flex items-center gap-1.5 w-full justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              style={{ borderColor: isTurn ? '#FBBF24' : player.ring }}
              className={`relative w-7 h-7 rounded-full border-2 bg-slate-900 flex items-center justify-center text-sm shrink-0 ${
                isSpeaking ? 'ring-2 ring-emerald-400 animate-pulse' : ''
              }`}
            >
              <span>{player.emoji}</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] px-1 rounded bg-slate-950 text-amber-300 font-black border border-amber-500/40">
                #{player.id + 1}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-white truncate max-w-[76px]">{player.name}</span>
                {isSpeaking && <Mic className="w-2.5 h-2.5 text-emerald-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-200/80 font-bold">
                <span>🃏 {player.hand.length}</span>
                <span className="text-amber-300">👑 {setsDone}/{game.setsToWin}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setInspectPlayerId(player.id)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100"
            title="Inspect Opponent Table"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>

        {/* Compact Property Icons & Unknown Bank Badge */}
        {renderPropertyChipBar(player, false)}
      </div>
    );
  };

  // ============================================================================
  // RENDER: LOBBY SCREEN (6-Seat Selector + 3–6 Sets + Room/AI Modes)
  // ============================================================================
  if (screen === 'lobby') {
    const lobbySeatPositions = [
      { idx: 0, label: 'Seat #1 (Bottom)', pos: 'bottom-1 left-1/2 -translate-x-1/2' },
      { idx: 1, label: 'Seat #2 (Bot-Left)', pos: 'bottom-6 left-2' },
      { idx: 2, label: 'Seat #3 (Top-Left)', pos: 'top-6 left-2' },
      { idx: 3, label: 'Seat #4 (Top)', pos: 'top-1 left-1/2 -translate-x-1/2' },
      { idx: 4, label: 'Seat #5 (Top-Right)', pos: 'top-6 right-2' },
      { idx: 5, label: 'Seat #6 (Bot-Right)', pos: 'bottom-6 right-2' },
    ];

    const createOnlineRoom = () => {
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      setRoomCode(code);
      setOnlineRole('host');
      setGameMode('online');
    };

    const joinOnlineRoom = () => {
      const cleaned = joinCodeInput.trim().toUpperCase();
      if (cleaned.length < 4) {
        showToast('Enter a valid room code');
        return;
      }
      setRoomCode(cleaned);
      setOnlineRole('guest');
      setGameMode('online');
    };

    return (
      <div className="w-screen h-dvh bg-[#052e16] text-white flex flex-col overflow-hidden select-none">
        {/* Top Wood & Gold Header */}
        <div className="h-11 px-3 bg-gradient-to-b from-[#3d2312] to-[#261409] border-b-2 border-amber-500/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide text-amber-300 leading-none">DEAL ESTIMATION</h1>
              <p className="text-[9px] text-amber-100/70 font-semibold">Pocket Tabletop Edition • 2–6 Players</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setUiZoom((z) => (z === 'auto' ? '90' : z === '90' ? '100' : z === '100' ? '110' : 'auto'))}
              className="px-2 py-1 rounded-lg bg-black/40 border border-amber-500/40 text-[10px] font-bold text-amber-200 flex items-center gap-1"
            >
              <ZoomIn className="w-3 h-3" />
              <span>Zoom: {uiZoom === 'auto' ? 'Auto' : `${uiZoom}%`}</span>
            </button>
            <button
              onClick={toggleFullScreen}
              className="px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 border border-emerald-400/50 text-[10px] font-extrabold flex items-center gap-1"
            >
              {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span>Full Screen</span>
            </button>
            <button
              onClick={() => setShowRulesModal(true)}
              className="p-1.5 rounded-lg bg-black/40 border border-amber-500/40 text-amber-300"
              title="Rules"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Landscape Lobby Grid */}
        <div
          style={{ transform: `scale(${effectiveScale})`, transformOrigin: 'top center' }}
          className="flex-1 grid grid-cols-12 gap-2.5 p-2.5 overflow-y-auto"
        >
          {/* Left Column: Visual 6-Seat Table Selector */}
          <div className="col-span-6 bg-[#094723] rounded-2xl border-2 border-amber-500/40 p-2.5 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Select Seats (2–6 Players)
              </span>
              <div className="flex items-center gap-1">
                {[2, 3, 4, 5, 6].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      setPlayerCount(cnt);
                      if (humanSeatIndex >= cnt) setHumanSeatIndex(0);
                    }}
                    className={`w-6 h-6 rounded-md text-[11px] font-black border transition ${
                      playerCount === cnt
                        ? 'bg-amber-400 text-slate-950 border-amber-200 shadow'
                        : 'bg-black/40 text-emerald-100 border-emerald-600/50'
                    }`}
                  >
                    {cnt}P
                  </button>
                ))}
              </div>
            </div>

            {/* Miniature Baize Table with Interactive 6 Seats */}
            <div className="relative flex-1 my-1.5 rounded-2xl bg-[radial-gradient(circle,#117a3d_0%,#063b1c_100%)] border-4 border-[#3d2312] shadow-inner flex items-center justify-center min-h-[155px]">
              <div className="px-3 py-1 rounded-full bg-black/35 border border-amber-400/30 text-[10px] font-bold text-amber-200">
                Tap a seat to sit there
              </div>

              {lobbySeatPositions.map(({ idx, pos }) => {
                const isActiveSeat = idx < playerCount;
                const isMine = idx === humanSeatIndex;
                const avatar = SEAT_AVATARS[idx];
                const roomOcc = roomSeats[idx];

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isActiveSeat) setPlayerCount(idx + 1);
                      setHumanSeatIndex(idx);
                      if (gameMode === 'online' && roomCode) {
                        sendWsMessage({
                          type: 'seat_claim',
                          seatIndex: idx,
                          playerName: playerName || 'You',
                        });
                      }
                    }}
                    className={`absolute ${pos} flex items-center gap-1 px-2 py-1 rounded-xl border text-[10px] font-extrabold transition ${
                      !isActiveSeat
                        ? 'bg-black/35 border-slate-700/60 text-slate-400 opacity-60'
                        : isMine
                        ? 'bg-amber-400 text-slate-950 border-white shadow-lg scale-105'
                        : 'bg-slate-900/90 text-white border-emerald-500/60 hover:border-amber-300'
                    }`}
                  >
                    <span>{avatar.emoji}</span>
                    <span>
                      #{idx + 1}{' '}
                      {!isActiveSeat
                        ? 'Closed'
                        : isMine
                        ? playerName || 'You'
                        : gameMode === 'online' && roomOcc?.occupied
                        ? roomOcc.name
                        : avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-emerald-200/80">
              <span>Your Seat: <strong className="text-amber-300">Seat #{humanSeatIndex + 1}</strong></span>
              <span>Deck: <strong className="text-white">108 Cards (Auto-Reshuffle)</strong></span>
            </div>
          </div>

          {/* Right Column: Rules, Mode & Launch */}
          <div className="col-span-6 bg-[#094723] rounded-2xl border-2 border-amber-500/40 p-2.5 flex flex-col justify-between gap-2">
            {/* Player Name & Sets to Win (3 to 6) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-amber-200 mb-0.5">Your Nickname</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={14}
                  className="w-full px-2.5 py-1 rounded-lg bg-black/45 border border-emerald-500/50 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-200 mb-0.5">
                  Sets to Win (3–6)
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSetsToWin(num)}
                      className={`py-1 rounded-lg text-xs font-black border transition ${
                        setsToWin === num
                          ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border-white shadow'
                          : 'bg-black/45 text-emerald-100 border-emerald-600/50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Mode Tabs */}
            <div>
              <label className="block text-[10px] font-bold text-amber-200 mb-0.5">Game Mode</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'ai', label: 'Vs Smart AI' },
                  { id: 'pass_play', label: 'Pass & Play' },
                  { id: 'online', label: 'Online Room' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setGameMode(m.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold border transition ${
                      gameMode === m.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-200 shadow'
                        : 'bg-black/40 text-emerald-100 border-emerald-700/60'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Online Room Controls (if Online selected) */}
            {gameMode === 'online' ? (
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/40 flex flex-col gap-1.5">
                {!roomCode ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={createOnlineRoom}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-black shrink-0"
                    >
                      + Create Room
                    </button>
                    <input
                      type="text"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      placeholder="ROOM CODE"
                      maxLength={6}
                      className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-slate-950 border border-emerald-600 text-xs font-mono font-bold uppercase text-amber-300"
                    />
                    <button
                      onClick={joinOnlineRoom}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-black shrink-0"
                    >
                      Join
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Wifi className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <span className="text-[11px] font-bold">Room:</span>
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400 text-amber-300 font-mono font-black text-xs">
                        {roomCode}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(roomCode);
                        setCopiedRoom(true);
                        setTimeout(() => setCopiedRoom(false), 1800);
                      }}
                      className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold flex items-center gap-1"
                    >
                      {copiedRoom ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRoom ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Turn Timer Option */
              <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-black/35 border border-emerald-700/50">
                <span className="text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Turn Timer
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { val: 0, label: 'Off' },
                    { val: 15, label: '15s' },
                    { val: 30, label: '30s' },
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setTurnTimerSetting(t.val)}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        turnTimerSetting === t.val
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-black/40 text-emerald-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Start Table CTA */}
            <button
              onClick={startMatch}
              className="w-full py-2 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 hover:from-emerald-300 hover:to-emerald-600 text-slate-950 font-black text-sm tracking-wide shadow-[0_4px_0_#064e3b] active:translate-y-0.5 flex items-center justify-center gap-2 border border-emerald-200"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START TABLE ({setsToWin} SETS TO WIN)</span>
            </button>
          </div>
        </div>

        {/* Rules Modal in Lobby */}
        {showRulesModal && (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
            <div className="w-full max-w-lg max-h-[88dvh] bg-[#0b3d20] border-2 border-amber-400 rounded-2xl flex flex-col overflow-hidden">
              <div className="px-3 py-2 bg-[#261409] border-b border-amber-500/40 flex items-center justify-between">
                <span className="text-xs font-black text-amber-300">Official Table Rules</span>
                <button onClick={() => setShowRulesModal(false)} className="p-1 rounded bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 overflow-y-auto text-xs space-y-1.5 text-emerald-50">
                <p>• <strong>Victory:</strong> First player to complete <strong>{setsToWin} full property sets</strong> on their turn wins.</p>
                <p>• <strong>Turn Flow:</strong> Draw 2 cards (or 5 if hand is empty) and play up to <strong>3 actions</strong> per turn.</p>
                <p>• <strong>7-Card Hand Limit:</strong> You must end your turn with at most <strong>7 cards</strong> in hand (excess cards are discarded).</p>
                <p>• <strong>Bank Rules:</strong> Only Money and Action/Rent cards can be banked. <strong>Properties cannot be placed in the Bank</strong>, and opponents' bank values stay secret until spent.</p>
                <p>• <strong>Wildcards & Full Sets:</strong> Flipping a wildcard's color on the table costs <strong>1 action</strong>. Properties inside a <strong>Full Set</strong> cannot be stolen by <em>Sly Deal</em> or swapped by <em>Forced Deal</em> (only <em>Deal Breaker</em> takes full sets).</p>
                <p>• <strong>Double The Rent & Just Say No:</strong> Play 1 or 2 <em>Double The Rent!</em> cards together with a Rent card in one charge (×2 or ×4). <em>Just Say No!</em> can be countered back-and-forth if both players hold one.</p>
                <p>• <strong>Endless Deck:</strong> When the Draw Deck empties, all played/discarded cards automatically shuffle into a fresh Draw Deck.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // RENDER: VICTORY PODIUM SCREEN
  // ============================================================================
  if (screen === 'victory' && game) {
    const winner = game.players[game.winnerId] || game.players[0];
    return (
      <div className="w-screen h-dvh bg-[radial-gradient(circle,#117a3d_0%,#042411_100%)] text-white flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-md bg-[#09381d] border-2 border-amber-400 rounded-3xl p-4 text-center shadow-2xl space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase">
              Table Champion
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              {winner.emoji} {winner.name} Wins!
            </h2>
            <p className="text-xs text-emerald-200">
              Completed {getCompletedSets(winner).length} / {game.setsToWin} Property Sets
            </p>
          </div>

          <div className="bg-black/40 rounded-xl p-2 space-y-1 max-h-36 overflow-y-auto text-left">
            {[...game.players]
              .sort((a, b) => getCompletedSets(b).length - getCompletedSets(a).length)
              .map((p, i) => (
                <div key={p.id} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-white/5">
                  <span className="font-bold">
                    #{i + 1} {p.emoji} {p.name}
                  </span>
                  <span className="font-black text-amber-300">
                    {getCompletedSets(p).length}/{game.setsToWin} Sets • ${getBankTotal(p)}M
                  </span>
                </div>
              ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={startMatch}
              className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow"
            >
              Play Again
            </button>
            <button
              onClick={() => setScreen('lobby')}
              className="flex-1 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white font-bold text-xs"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: ACTIVE LANDSCAPE TABLETOP GAMEPLAY
  // ============================================================================
  if (!game || !localPlayer) return null;

  const isMyTurn = game.turnIndex === humanSeatIndex && !game.pendingAction;
  const selectedCard = localPlayer.hand.find((c) => c.uid === selectedCardUid) || null;
  const availableDoubleRentCards = localPlayer.hand.filter(
    (c) => c.type === 'action' && c.action === 'double_rent'
  );
  const myExcessCardsCount = Math.max(0, localPlayer.hand.length - 7);
  const topDiscard = game.discardPile[game.discardPile.length - 1] || null;

  // Pending Action checks for local human player
  const pending = game.pendingAction;
  const isMyJsnCounterDecision =
    pending && pending.type === 'jsn_counter' && pending.responderId === humanSeatIndex;
  const isMyPendingDefense =
    pending && pending.type !== 'jsn_counter' && pending.fromId === humanSeatIndex;
  const myHasJustSayNo = localPlayer.hand.some(
    (c) => c.type === 'action' && c.action === 'just_say_no'
  );

  // Payment calculation when local player must pay
  const myPayableAssets = isMyPendingDefense && pending.type === 'pay' ? getPayableAssets(localPlayer) : [];
  const totalMyPayableValue = myPayableAssets.reduce((s, c) => s + (c.value || 0), 0);
  const selectedPaymentValue = myPayableAssets
    .filter((c) => paymentSelection.includes(c.uid))
    .reduce((s, c) => s + (c.value || 0), 0);
  const canConfirmPayment =
    isMyPendingDefense &&
    pending.type === 'pay' &&
    (selectedPaymentValue >= pending.amount || selectedPaymentValue >= totalMyPayableValue);

  return (
    <div className="relative w-screen h-dvh bg-[#063B1C] text-white overflow-hidden flex flex-col select-none">
      {/* Portrait Orientation Guard */}
      <div className="portrait:flex landscape:hidden fixed inset-0 z-[100] bg-[#052e16] flex-col items-center justify-center p-6 text-center">
        <Smartphone className="w-12 h-12 text-amber-400 animate-bounce mb-3 rotate-90" />
        <h2 className="text-lg font-black text-amber-300">Rotate Device to Landscape</h2>
        <p className="text-xs text-emerald-100/80 mt-1 max-w-xs">
          Deal Estimation is designed for wide landscape tabletop play so you can see all seats and properties clearly.
        </p>
      </div>

      {/* ==================================================================== */}
      {/* TOP COMPACT HUD BAR (Wood & Gold Trim)                               */}
      {/* ==================================================================== */}
      <div className="h-9 px-2.5 bg-gradient-to-b from-[#3d2312] to-[#241308] border-b border-amber-500/60 flex items-center justify-between shrink-0 z-20">
        {/* Left: Match Goal, Turn & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setScreen('lobby')}
            className="px-2 py-0.5 rounded bg-black/45 border border-amber-500/40 text-[10px] font-bold text-amber-200 hover:bg-black/70"
          >
            Lobby
          </button>

          <div className="px-2 py-0.5 rounded bg-emerald-950/90 border border-amber-400/50 flex items-center gap-1 text-[10px] font-black text-amber-300">
            <Trophy className="w-3 h-3" />
            <span>Goal: {game.setsToWin} Sets</span>
          </div>

          <div
            className={`px-2 py-0.5 rounded border text-[10px] font-black flex items-center gap-1 ${
              isMyTurn
                ? 'bg-amber-400 text-slate-950 border-white'
                : 'bg-black/45 text-emerald-100 border-emerald-600/50'
            }`}
          >
            <span>
              {isMyTurn ? 'YOUR TURN' : `${game.players[game.turnIndex].name}'s Turn`}
            </span>
            <span>• {game.actionsLeft}/3 Act</span>
            {turnSecondsLeft !== null && <span>• {turnSecondsLeft}s</span>}
          </div>
        </div>

        {/* Right: Mic, Table Chat, Scoreboard, Zoom, Fullscreen */}
        <div className="flex items-center gap-1">
          {/* Live Mic Button */}
          <button
            onClick={toggleMicrophone}
            className={`px-2 py-0.5 rounded-lg border text-[10px] font-extrabold flex items-center gap-1 transition ${
              micEnabled
                ? 'bg-emerald-500 text-slate-950 border-emerald-200 shadow'
                : 'bg-black/45 text-slate-200 border-slate-600/70'
            }`}
            title="Toggle Live Microphone"
          >
            {micEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-rose-400" />}
            <span>{micEnabled ? `${micLevel}%` : 'Mic'}</span>
          </button>

          {/* Table Chat Button */}
          <button
            onClick={() => {
              setChatDrawerOpen((o) => !o);
              setUnreadChatCount(0);
            }}
            className="relative px-2 py-0.5 rounded-lg bg-black/45 border border-sky-400/50 text-[10px] font-extrabold text-sky-200 flex items-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
            {unreadChatCount > 0 && (
              <span className="px-1 rounded-full bg-rose-500 text-white text-[9px] font-black">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Scoreboard */}
          <button
            onClick={() => setShowScoreboard(true)}
            className="px-2 py-0.5 rounded-lg bg-black/45 border border-amber-400/50 text-[10px] font-extrabold text-amber-200 flex items-center gap-1"
          >
            <Award className="w-3 h-3" />
            <span>Scores</span>
          </button>

          {/* Zoom */}
          <button
            onClick={() => setUiZoom((z) => (z === 'auto' ? '90' : z === '90' ? '100' : z === '100' ? '110' : 'auto'))}
            className="p-1 rounded bg-black/45 border border-amber-500/40 text-amber-200"
            title="Adjust UI Scale"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullScreen}
            className="p-1 rounded bg-emerald-700 border border-emerald-400/50 text-white"
            title="Full Screen"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GREEN BAIZE TABLETOP ARENA                                           */}
      {/* ==================================================================== */}
      <div
        style={{ transform: `scale(${effectiveScale})`, transformOrigin: 'center center' }}
        className="relative flex-1 bg-[radial-gradient(circle_at_center,#128241_0%,#095228_65%,#053318_100%)] border-x-4 border-[#3d2312] flex flex-col justify-between p-1.5 overflow-hidden"
      >
        {/* TOP OPPONENT ROW (North) */}
        <div className="flex items-start justify-center min-h-[54px] z-10">
          {opponentSeatSlots.north && renderOpponentPod(opponentSeatSlots.north, 'center')}
        </div>

        {/* MIDDLE ROW: West Opponents — Center Draw/Discard Decks — East Opponents */}
        <div className="flex-1 grid grid-cols-12 items-center gap-1 my-0.5">
          {/* West Side Seats */}
          <div className="col-span-4 flex flex-col justify-center items-start gap-1.5">
            {opponentSeatSlots.westNorth && renderOpponentPod(opponentSeatSlots.westNorth, 'left')}
            {opponentSeatSlots.westSouth && renderOpponentPod(opponentSeatSlots.westSouth, 'left')}
          </div>

          {/* Center Baize Deck Zone */}
          <div className="col-span-4 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-3">
              {/* Draw Pile */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-12 h-16 rounded-lg bg-gradient-to-br from-[#1b4332] to-[#081c15] border-2 border-amber-400 shadow-lg flex flex-col items-center justify-center ${
                    shuffleBanner ? 'animate-spin' : ''
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span className="text-[11px] font-black text-white mt-0.5">{game.drawPile.length}</span>
                </div>
                <span className="text-[9px] font-extrabold text-amber-200/90 mt-0.5">DRAW</span>
              </div>

              {/* Discard / Played Pile */}
              <div className="relative flex flex-col items-center">
                <div className="w-12 h-16 rounded-lg bg-black/35 border-2 border-dashed border-amber-300/60 shadow-inner flex flex-col items-center justify-center p-1 text-center">
                  {topDiscard ? (
                    <>
                      <span className="text-[8px] font-black text-amber-300 leading-tight line-clamp-2">
                        {topDiscard.name}
                      </span>
                      <span className="text-[9px] font-bold text-white/80 mt-0.5">
                        ({game.discardPile.length})
                      </span>
                    </>
                  ) : (
                    <span className="text-[9px] text-emerald-200/60 font-bold">EMPTY</span>
                  )}
                </div>
                <span className="text-[9px] font-extrabold text-emerald-200/90 mt-0.5">PLAYED</span>
              </div>
            </div>

            {/* Latest Action Ticker */}
            <div className="px-2.5 py-0.5 rounded-full bg-black/45 border border-emerald-500/40 text-[10px] font-semibold text-emerald-100 max-w-[230px] truncate">
              {game.logs[0]}
            </div>
          </div>

          {/* East Side Seats */}
          <div className="col-span-4 flex flex-col justify-center items-end gap-1.5">
            {opponentSeatSlots.eastNorth && renderOpponentPod(opponentSeatSlots.eastNorth, 'right')}
            {opponentSeatSlots.eastSouth && renderOpponentPod(opponentSeatSlots.eastSouth, 'right')}
          </div>
        </div>

        {/* SOUTH (YOUR) COMPACT ICON PROPERTY & BANK BAR + TURN CONTROLS */}
        <div className="relative flex items-center justify-between gap-2 px-2 py-1 rounded-xl bg-black/45 border border-amber-400/50 z-10">
          {/* Your Seat Badge + Icon-Only Properties & Bank */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              style={{ borderColor: isMyTurn ? '#FBBF24' : localPlayer.ring }}
              className={`relative w-7 h-7 rounded-full border-2 bg-slate-900 flex items-center justify-center text-sm shrink-0 ${
                speakingPlayerIds.includes(localPlayer.id) ? 'ring-2 ring-emerald-400 animate-pulse' : ''
              }`}
            >
              <span>{localPlayer.emoji}</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] px-1 rounded bg-amber-400 text-slate-950 font-black">
                #{localPlayer.id + 1}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-black text-amber-300">{localPlayer.name}</span>
                <span className="text-[9px] font-bold text-emerald-200">
                  Sets: {getCompletedSets(localPlayer).length}/{game.setsToWin}
                </span>
                <span className="text-[9px] font-bold text-slate-300">
                  • Hand: {localPlayer.hand.length}/7
                </span>
              </div>
              {renderPropertyChipBar(localPlayer, true)}
            </div>
          </div>

          {/* Right Action Buttons: Show/Hide Hand & End Turn */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setHandMinimized((m) => !m)}
              className="px-2 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-500 text-[10px] font-extrabold text-white flex items-center gap-1"
            >
              {handMinimized ? <Eye className="w-3 h-3 text-amber-300" /> : <EyeOff className="w-3 h-3" />}
              <span>{handMinimized ? `Hand (${localPlayer.hand.length})` : 'Hide'}</span>
            </button>

            {isMyTurn && (
              <button
                onClick={handleEndTurnClick}
                className={`px-3 py-1 rounded-lg font-black text-[11px] shadow transition ${
                  myExcessCardsCount > 0
                    ? 'bg-rose-500 text-white border border-rose-200 animate-pulse'
                    : 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 border border-white'
                }`}
              >
                {myExcessCardsCount > 0 ? `Discard ${myExcessCardsCount}` : 'End Turn'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FLOATING SELECTED CARD ACTION BAR (Above Compact Hand Dock)          */}
      {/* ==================================================================== */}
      {selectedCard && isMyTurn && !handMinimized && (
        <div className="fixed bottom-[64px] left-1/2 -translate-x-1/2 z-30 bg-slate-950/95 border-2 border-amber-400 rounded-2xl px-3 py-1.5 shadow-2xl flex flex-wrap items-center justify-center gap-2 max-w-[94vw]">
          {/* Card Summary */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
              ${selectedCard.value}M
            </span>
            <div>
              <div className="text-[11px] font-black text-white leading-tight">{selectedCard.name}</div>
              {selectedCard.desc && (
                <div className="text-[9px] text-emerald-200/80 leading-tight">{selectedCard.desc}</div>
              )}
            </div>
          </div>

          {/* PROPERTY CARD ACTIONS (No Bank button — Properties cannot be banked) */}
          {selectedCard.type === 'property' && (
            <button
              onClick={() => playPropertyCard(localPlayer.id, selectedCard.uid, selectedCard.color)}
              style={{ backgroundColor: COLOR_META[selectedCard.color].bg, color: COLOR_META[selectedCard.color].text }}
              className="px-3 py-1 rounded-lg font-black text-[11px] border border-white/60 shadow"
            >
              Play {COLOR_META[selectedCard.color].name} Property
            </button>
          )}

          {/* WILDCARD PROPERTY ACTIONS (Pick Color — No Bank button) */}
          {selectedCard.type === 'wildcard' && (
            <div className="flex flex-wrap items-center gap-1">
              {(selectedCard.colors.length >= 10
                ? ALL_COLORS
                : selectedCard.colors
              ).map((col) => (
                <button
                  key={col}
                  onClick={() => playPropertyCard(localPlayer.id, selectedCard.uid, col)}
                  style={{ backgroundColor: COLOR_META[col].bg, color: COLOR_META[col].text }}
                  className="px-2 py-1 rounded-md text-[10px] font-black border border-white/50 shadow"
                >
                  {COLOR_META[col].name}
                </button>
              ))}
            </div>
          )}

          {/* MONEY CARD ACTION */}
          {selectedCard.type === 'money' && (
            <button
              onClick={() => bankCard(localPlayer.id, selectedCard.uid)}
              className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[11px]"
            >
              Bank ${selectedCard.value}M
            </button>
          )}

          {/* RENT CARD ACTION + STACKABLE DOUBLE THE RENT (1x, 2x, 4x) */}
          {selectedCard.type === 'rent' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Double The Rent Stacker (when player holds 1 or 2 Double The Rent cards & has actions) */}
              {availableDoubleRentCards.length > 0 && game.actionsLeft >= 2 && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400">
                  <span className="text-[9px] font-black text-amber-300">Double Rent:</span>
                  {[0, 1, 2].map((lvl) => {
                    if (lvl > availableDoubleRentCards.length || lvl + 1 > game.actionsLeft) return null;
                    const mult = lvl === 2 ? '4×' : lvl === 1 ? '2×' : '1×';
                    return (
                      <button
                        key={lvl}
                        onClick={() => setDoubleRentCount(lvl)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                          doubleRentCount === lvl
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-black/50 text-amber-200'
                        }`}
                      >
                        {mult} ({lvl + 1} act)
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rent Color Selector */}
              {(selectedCard.colors.length >= 10
                ? ALL_COLORS.filter((c) => calculateRentForColor(localPlayer, c) > 0)
                : selectedCard.colors
              ).map((col) => {
                const base = calculateRentForColor(localPlayer, col);
                const mult = doubleRentCount === 2 ? 4 : doubleRentCount === 1 ? 2 : 1;
                const total = base * mult;
                return (
                  <button
                    key={col}
                    disabled={base <= 0}
                    onClick={() => {
                      if (selectedCard.colors.length >= 10) {
                        setTargetModal({
                          type: 'wild_rent_target',
                          cardUid: selectedCard.uid,
                          color: col,
                          doubleCount: doubleRentCount,
                        });
                      } else {
                        executePlayAction(localPlayer.id, selectedCard.uid, {
                          color: col,
                          doubleCount: doubleRentCount,
                        });
                      }
                    }}
                    style={{ backgroundColor: COLOR_META[col].bg, color: COLOR_META[col].text }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black border border-white/60 ${
                      base <= 0 ? 'opacity-40 cursor-not-allowed' : 'shadow'
                    }`}
                  >
                    Charge ${total}M ({COLOR_META[col].name})
                  </button>
                );
              })}

              <button
                onClick={() => bankCard(localPlayer.id, selectedCard.uid)}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-600 text-[10px] font-bold text-amber-300"
              >
                Bank ${selectedCard.value}M
              </button>
            </div>
          )}

          {/* ACTION CARDS */}
          {selectedCard.type === 'action' && (
            <div className="flex items-center gap-1.5">
              {selectedCard.action === 'double_rent' ? (
                <span className="text-[10px] font-bold text-amber-300">
                  Select a Rent card first to stack Double Rent!
                </span>
              ) : selectedCard.action === 'just_say_no' ? (
                <span className="text-[10px] font-bold text-sky-300">
                  Auto-prompts when an opponent targets you!
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (selectedCard.action === 'pass_go' || selectedCard.action === 'birthday') {
                      executePlayAction(localPlayer.id, selectedCard.uid);
                    } else if (selectedCard.action === 'debt_collector') {
                      setTargetModal({ type: 'debt_collector', cardUid: selectedCard.uid });
                    } else if (selectedCard.action === 'sly_deal') {
                      setTargetModal({ type: 'sly_deal', cardUid: selectedCard.uid });
                    } else if (selectedCard.action === 'forced_deal') {
                      setTargetModal({ type: 'forced_deal', cardUid: selectedCard.uid, myCardUid: null });
                    } else if (selectedCard.action === 'deal_breaker') {
                      setTargetModal({ type: 'deal_breaker', cardUid: selectedCard.uid });
                    } else if (selectedCard.action === 'house' || selectedCard.action === 'hotel') {
                      setTargetModal({ type: selectedCard.action, cardUid: selectedCard.uid });
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] shadow"
                >
                  Play {selectedCard.name}
                </button>
              )}

              <button
                onClick={() => bankCard(localPlayer.id, selectedCard.uid)}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 border border-emerald-400/60 text-white font-bold text-[10px]"
              >
                Bank ${selectedCard.value}M
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedCardUid(null);
              setDoubleRentCount(0);
            }}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ULTRA-SLIM BOTTOM HAND DOCK (Pocket Estimation Miniature Fan)        */}
      {/* ==================================================================== */}
      {!handMinimized && (
        <div className="h-[58px] px-2 bg-gradient-to-t from-[#1c0f06] to-[#2e190b] border-t border-amber-500/60 flex items-center justify-center shrink-0 z-20">
          <div className="flex items-end justify-center -space-x-2.5 overflow-x-auto max-w-full py-1 px-4">
            {localPlayer.hand.map((card, idx) => {
              const isSelected = selectedCardUid === card.uid;
              const isDiscardMarked = discardSelection.includes(card.uid);
              const headerColor =
                card.type === 'property'
                  ? COLOR_META[card.color].bg
                  : card.type === 'wildcard'
                  ? '#7C3AED'
                  : card.type === 'rent'
                  ? '#D97706'
                  : card.type === 'money'
                  ? '#059669'
                  : '#DC2626';

              return (
                <button
                  key={card.uid}
                  onClick={() => {
                    if (myExcessCardsCount > 0 && isMyTurn) {
                      setDiscardSelection((prev) =>
                        prev.includes(card.uid)
                          ? prev.filter((u) => u !== card.uid)
                          : prev.length < myExcessCardsCount
                          ? [...prev, card.uid]
                          : prev
                      );
                      return;
                    }
                    setSelectedCardUid((prev) => (prev === card.uid ? null : card.uid));
                    setDoubleRentCount(0);
                  }}
                  style={{ zIndex: isSelected ? 40 : idx + 1 }}
                  className={`relative w-[42px] h-[52px] rounded-md bg-white text-slate-950 border shadow-md flex flex-col justify-between overflow-hidden transition-transform shrink-0 ${
                    isSelected
                      ? '-translate-y-2.5 scale-110 border-amber-400 ring-2 ring-amber-300'
                      : isDiscardMarked
                      ? '-translate-y-2 border-rose-500 ring-2 ring-rose-400'
                      : 'border-slate-400 hover:-translate-y-1'
                  }`}
                >
                  {/* Top Color Header */}
                  <div
                    style={{ backgroundColor: headerColor }}
                    className="w-full h-3 px-0.5 flex items-center justify-between text-[7px] font-black text-white"
                  >
                    <span>${card.value}M</span>
                    {card.type === 'wildcard' && <span>W</span>}
                  </div>

                  {/* Card Name */}
                  <div className="px-0.5 text-[7px] font-extrabold leading-[8px] text-center text-slate-900 line-clamp-3">
                    {card.name}
                  </div>

                  {/* Bottom Tag */}
                  <div className="w-full bg-slate-100 text-[6px] font-black uppercase text-slate-600 text-center py-[1px]">
                    {isDiscardMarked ? 'DISCARD' : card.type === 'wildcard' ? 'WILD' : card.type}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: JUST SAY NO COUNTER-CHAIN PROMPT                            */}
      {/* ==================================================================== */}
      {isMyJsnCounterDecision && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-slate-950 border-2 border-rose-500 rounded-2xl p-4 text-center space-y-3 shadow-2xl">
            <ShieldAlert className="w-9 h-9 text-rose-400 mx-auto animate-bounce" />
            <div>
              <h3 className="text-sm font-black text-white">{pending.reason}</h3>
              <p className="text-xs text-slate-300 mt-1">
                {myHasJustSayNo
                  ? 'You hold a Just Say No! card in your hand. Play it to counter?'
                  : 'You have no Just Say No! card left to counter.'}
              </p>
            </div>
            <div className="flex gap-2">
              {myHasJustSayNo && (
                <button
                  onClick={() => playJustSayNoResponse(humanSeatIndex)}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow"
                >
                  Play Just Say No! 🛑
                </button>
              )}
              <button
                onClick={acceptJustSayNoOutcome}
                className="flex-1 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white font-bold text-xs"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: INCOMING ACTION / PAYMENT WITH COLORED PROPERTY CARDS       */}
      {/* ==================================================================== */}
      {isMyPendingDefense && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2.5">
          <div className="w-full max-w-lg max-h-[88dvh] bg-[#0b381e] border-2 border-amber-400 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-3 py-2 bg-[#261409] border-b border-amber-500/40 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xs font-black text-amber-300">
                  {game.players[pending.toId].name} played {pending.reason}
                </h3>
                {pending.type === 'pay' && (
                  <p className="text-[10px] text-emerald-100">
                    Select assets to pay <strong>${pending.amount}M</strong> (Selected:{' '}
                    <strong className="text-amber-300">${selectedPaymentValue}M</strong>)
                  </p>
                )}
              </div>
              {myHasJustSayNo && (
                <button
                  onClick={() => playJustSayNoResponse(humanSeatIndex)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black shadow animate-pulse"
                >
                  Play Just Say No! 🛑
                </button>
              )}
            </div>

            {/* Body: Payment Asset Picker (Shows Full Property Color Swatches!) */}
            {pending.type === 'pay' ? (
              <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                {myPayableAssets.length === 0 ? (
                  <p className="text-xs text-center text-emerald-200 py-4">
                    You have no bank money or valued properties to pay with!
                  </p>
                ) : (
                  <>
                    {/* Bank Bills Section */}
                    {localPlayer.bank.length > 0 && (
                      <div>
                        <div className="text-[10px] font-black text-amber-300 uppercase mb-1">
                          Your Bank Bills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {localPlayer.bank.map((bill) => {
                            const checked = paymentSelection.includes(bill.uid);
                            return (
                              <button
                                key={bill.uid}
                                onClick={() =>
                                  setPaymentSelection((prev) =>
                                    prev.includes(bill.uid)
                                      ? prev.filter((u) => u !== bill.uid)
                                      : [...prev, bill.uid]
                                  )
                                }
                                className={`px-2.5 py-1.5 rounded-xl border text-xs font-black transition ${
                                  checked
                                    ? 'bg-amber-400 text-slate-950 border-white ring-2 ring-amber-200'
                                    : 'bg-emerald-950/90 text-emerald-200 border-emerald-600'
                                }`}
                              >
                                ${bill.value}M ({bill.name})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Table Properties Section with Explicit Color Swatches & Set Progress */}
                    {localPlayer.properties.filter((c) => (c.value || 0) > 0).length > 0 && (
                      <div>
                        <div className="text-[10px] font-black text-amber-300 uppercase mb-1">
                          Your Table Properties (Color Shown)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {localPlayer.properties
                            .filter((c) => (c.value || 0) > 0)
                            .map((prop) => {
                              const activeCol = prop.assignedColor || prop.color || prop.colors?.[0] || 'brown';
                              const meta = COLOR_META[activeCol];
                              const groups = getGroupedProperties(localPlayer.properties);
                              const countInSet = (groups[activeCol] || []).length;
                              const isFull = countInSet >= meta.req;
                              const checked = paymentSelection.includes(prop.uid);

                              return (
                                <button
                                  key={prop.uid}
                                  onClick={() =>
                                    setPaymentSelection((prev) =>
                                      prev.includes(prop.uid)
                                        ? prev.filter((u) => u !== prop.uid)
                                        : [...prev, prop.uid]
                                    )
                                  }
                                  className={`rounded-xl border overflow-hidden text-left transition flex flex-col ${
                                    checked
                                      ? 'ring-2 ring-amber-300 border-white scale-[1.02]'
                                      : 'border-slate-600 opacity-95'
                                  }`}
                                >
                                  {/* Full Color Header Bar */}
                                  <div
                                    style={{ backgroundColor: meta.bg, color: meta.text }}
                                    className="px-2 py-1 flex items-center justify-between text-[10px] font-black"
                                  >
                                    <span>{meta.name}</span>
                                    <span>${prop.value}M</span>
                                  </div>
                                  <div className="px-2 py-1 bg-slate-900 text-white flex-1">
                                    <div className="text-[10px] font-bold truncate">{prop.name}</div>
                                    <div className="flex items-center gap-1 mt-0.5 text-[9px]">
                                      <span className={isFull ? 'text-amber-300 font-black' : 'text-slate-300'}>
                                        Set: {countInSet}/{meta.req} {isFull ? '👑' : ''}
                                      </span>
                                      {prop.type === 'wildcard' && (
                                        <span className="px-1 rounded bg-purple-600 text-white font-black">
                                          WILD
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-emerald-100">
                {pending.reason} will resolve unless you play <strong>Just Say No!</strong>
              </div>
            )}

            {/* Footer Confirm */}
            <div className="px-3 py-2 bg-black/50 border-t border-emerald-700/50 flex justify-end gap-2 shrink-0">
              {pending.type === 'pay' ? (
                <button
                  disabled={!canConfirmPayment}
                  onClick={() => resolvePendingAction(paymentSelection)}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs ${
                    canConfirmPayment
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Payment (${selectedPaymentValue}M)
                </button>
              ) : (
                <button
                  onClick={() => resolvePendingAction([])}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs"
                >
                  Accept Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: TARGET SELECTION (Sly Deal, Forced Deal, Deal Breaker, etc) */}
      {/* ==================================================================== */}
      {targetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2.5">
          <div className="w-full max-w-lg max-h-[88dvh] bg-[#0b381e] border-2 border-amber-400 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="px-3 py-2 bg-[#261409] border-b border-amber-500/40 flex items-center justify-between shrink-0">
              <span className="text-xs font-black text-amber-300 uppercase">
                Select Target ({targetModal.type.replace('_', ' ')})
              </span>
              <button onClick={() => setTargetModal(null)} className="p-1 rounded bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
              {/* HOUSE / HOTEL: Pick one of your completed sets */}
              {(targetModal.type === 'house' || targetModal.type === 'hotel') && (
                <div className="space-y-1.5">
                  <p className="text-xs text-emerald-100">Choose one of your completed property sets:</p>
                  {getCompletedSets(localPlayer).map((col) => (
                    <button
                      key={col}
                      onClick={() => executePlayAction(localPlayer.id, targetModal.cardUid, { color: col })}
                      style={{ backgroundColor: COLOR_META[col].bg, color: COLOR_META[col].text }}
                      className="w-full py-2 px-3 rounded-xl font-black text-xs text-left border border-white/50"
                    >
                      Add {targetModal.type.toUpperCase()} to {COLOR_META[col].name} Set
                    </button>
                  ))}
                  {getCompletedSets(localPlayer).length === 0 && (
                    <p className="text-xs text-rose-300">You need a completed property set first!</p>
                  )}
                </div>
              )}

              {/* DEBT COLLECTOR OR WILD RENT: Pick 1 Opponent */}
              {(targetModal.type === 'debt_collector' || targetModal.type === 'wild_rent_target') && (
                <div className="grid grid-cols-2 gap-2">
                  {game.players
                    .filter((p) => p.id !== localPlayer.id)
                    .map((opp) => (
                      <button
                        key={opp.id}
                        onClick={() =>
                          executePlayAction(localPlayer.id, targetModal.cardUid, {
                            targetPlayerId: opp.id,
                            color: targetModal.color,
                            doubleCount: targetModal.doubleCount,
                          })
                        }
                        className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/50 text-left"
                      >
                        <div className="text-xs font-black text-white">
                          {opp.emoji} {opp.name} (#{opp.id + 1})
                        </div>
                        <div className="text-[10px] text-emerald-300">
                          Bank: ×{opp.bank.length} 🔒 • Props: {opp.properties.length}
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* DEAL BREAKER: Pick an Opponent's Completed Set */}
              {targetModal.type === 'deal_breaker' && (
                <div className="space-y-2">
                  {game.players
                    .filter((p) => p.id !== localPlayer.id)
                    .map((opp) => {
                      const sets = getCompletedSets(opp);
                      return (
                        <div key={opp.id} className="p-2 rounded-xl bg-black/35 border border-emerald-700/50">
                          <div className="text-xs font-black text-white mb-1">
                            {opp.emoji} {opp.name}
                          </div>
                          {sets.length === 0 ? (
                            <span className="text-[10px] text-slate-400">No completed sets</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {sets.map((col) => (
                                <button
                                  key={col}
                                  onClick={() =>
                                    executePlayAction(localPlayer.id, targetModal.cardUid, {
                                      targetPlayerId: opp.id,
                                      targetColor: col,
                                    })
                                  }
                                  style={{ backgroundColor: COLOR_META[col].bg, color: COLOR_META[col].text }}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-black border border-white"
                                >
                                  Steal {COLOR_META[col].name} Full Set!
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* SLY DEAL & FORCED DEAL: Full Sets are strictly disabled & badged */}
              {(targetModal.type === 'sly_deal' || targetModal.type === 'forced_deal') && (
                <div className="space-y-2.5">
                  {targetModal.type === 'forced_deal' && (
                    <div className="p-2 rounded-xl bg-black/45 border border-amber-400/50">
                      <div className="text-[10px] font-black text-amber-300 mb-1">
                        1. Pick YOUR property to trade (Full sets protected):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {localPlayer.properties.map((c) => {
                          const col = c.assignedColor || c.color || c.colors?.[0];
                          const inFullSet = getCompletedSets(localPlayer).includes(col);
                          return (
                            <button
                              key={c.uid}
                              disabled={inFullSet}
                              onClick={() => setTargetModal((m) => ({ ...m, myCardUid: c.uid }))}
                              style={{ backgroundColor: COLOR_META[col].bg, color: COLOR_META[col].text }}
                              className={`px-2 py-1 rounded text-[10px] font-black border ${
                                inFullSet
                                  ? 'opacity-35 cursor-not-allowed border-slate-500'
                                  : targetModal.myCardUid === c.uid
                                  ? 'ring-2 ring-white border-white'
                                  : 'border-black/40'
                              }`}
                            >
                              {c.name} {inFullSet ? '🔒' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] font-black text-amber-300">
                    {targetModal.type === 'forced_deal'
                      ? '2. Pick OPPONENT property to receive (Full sets protected):'
                      : 'Pick OPPONENT property to steal (Full sets protected):'}
                  </div>

                  {game.players
                    .filter((p) => p.id !== localPlayer.id)
                    .map((opp) => {
                      const oppFullSets = getCompletedSets(opp);
                      return (
                        <div key={opp.id} className="p-2 rounded-xl bg-black/35 border border-emerald-700/50">
                          <div className="text-xs font-black text-white mb-1">
                            {opp.emoji} {opp.name}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {opp.properties.map((c) => {
                              const col = c.assignedColor || c.color || c.colors?.[0];
                              const isProtected = oppFullSets.includes(col);
                              const disabled =
                                isProtected || (targetModal.type === 'forced_deal' && !targetModal.myCardUid);
                              return (
                                <button
                                  key={c.uid}
                                  disabled={disabled}
                                  onClick={() =>
                                    executePlayAction(localPlayer.id, targetModal.cardUid, {
                                      targetPlayerId: opp.id,
                                      targetCardUid: c.uid,
                                      myCardUid: targetModal.myCardUid,
                                    })
                                  }
                                  style={{ backgroundColor: COLOR_META[col].bg, color: COLOR_META[col].text }}
                                  className={`px-2 py-1 rounded text-[10px] font-black border ${
                                    isProtected
                                      ? 'opacity-40 cursor-not-allowed border-slate-500'
                                      : disabled
                                      ? 'opacity-50 cursor-not-allowed'
                                      : 'border-white/70 shadow'
                                  }`}
                                >
                                  {c.name} {isProtected ? '🔒 FULL SET' : ''}
                                </button>
                              );
                            })}
                            {opp.properties.length === 0 && (
                              <span className="text-[10px] text-slate-400">No properties on table</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: INSPECT PLAYER TABLE (Bank Secret for Opponents)            */}
      {/* ==================================================================== */}
      {inspectPlayerId !== null && game.players[inspectPlayerId] && (() => {
        const p = game.players[inspectPlayerId];
        const isSelf = p.id === localPlayer.id;
        const groups = getGroupedProperties(p.properties);
        return (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
            <div className="w-full max-w-md max-h-[85dvh] bg-[#0b381e] border-2 border-amber-400 rounded-2xl flex flex-col overflow-hidden">
              <div className="px-3 py-2 bg-[#261409] border-b border-amber-500/40 flex items-center justify-between">
                <span className="text-xs font-black text-amber-300">
                  {p.emoji} {p.name} (#{p.id + 1}) — Table Assets
                </span>
                <button onClick={() => setInspectPlayerId(null)} className="p-1 rounded bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 overflow-y-auto space-y-2.5 text-xs">
                <div className="p-2 rounded-xl bg-black/40 border border-emerald-600/50 flex items-center justify-between">
                  <span className="font-bold text-emerald-100">Bank Bills ({p.bank.length}):</span>
                  {isSelf ? (
                    <span className="font-black text-amber-300">
                      ${getBankTotal(p)}M ({p.bank.map((b) => `$${b.value}M`).join(', ') || 'Empty'})
                    </span>
                  ) : (
                    <span className="font-black text-amber-200 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{p.bank.length} Face-Down Bills (Unknown Total)</span>
                    </span>
                  )}
                </div>

                {ALL_COLORS.filter((c) => groups[c].length > 0).map((col) => (
                  <div
                    key={col}
                    style={{ borderColor: COLOR_META[col].bg }}
                    className="p-2 rounded-xl bg-black/45 border-l-4"
                  >
                    <div className="flex items-center justify-between font-black text-[11px]">
                      <span>{COLOR_META[col].name}</span>
                      <span>
                        {groups[col].length}/{COLOR_META[col].req} • Rent ${calculateRentForColor(p, col)}M
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {groups[col].map((card) => (
                        <span
                          key={card.uid}
                          className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold"
                        >
                          {card.name} (${card.value}M)
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==================================================================== */}
      {/* MODAL 5: POCKET ESTIMATION SCOREBOARD                                */}
      {/* ==================================================================== */}
      {showScoreboard && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3">
          <div className="w-full max-w-md max-h-[85dvh] bg-[#0b381e] border-2 border-amber-400 rounded-2xl flex flex-col overflow-hidden">
            <div className="px-3 py-2 bg-[#261409] border-b border-amber-500/40 flex items-center justify-between">
              <span className="text-xs font-black text-amber-300">
                Table Scoreboard (First to {game.setsToWin} Sets)
              </span>
              <button onClick={() => setShowScoreboard(false)} className="p-1 rounded bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 overflow-y-auto space-y-1.5 text-xs">
              {game.players.map((p) => {
                const isSelf = p.id === localPlayer.id;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-black/45 border border-emerald-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.emoji}</span>
                      <div>
                        <div className="font-black text-white">
                          {p.name} (#{p.id + 1})
                        </div>
                        <div className="text-[10px] text-emerald-200/80">
                          Hand: {p.hand.length} cards • Bank: {isSelf ? `$${getBankTotal(p)}M` : `${p.bank.length} bills 🔒`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px]">
                        {getCompletedSets(p).length} / {game.setsToWin} Sets
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: LIVE MIC & TABLE CHAT DRAWER                                */}
      {/* ==================================================================== */}
      {chatDrawerOpen && (
        <div className="fixed inset-y-9 right-0 z-40 w-72 max-w-[85vw] bg-slate-950/95 border-l-2 border-amber-400 flex flex-col shadow-2xl">
          <div className="px-3 py-2 bg-[#261409] border-b border-amber-500/40 flex items-center justify-between">
            <span className="text-xs font-black text-amber-300">Table Voice & Chat</span>
            <button onClick={() => setChatDrawerOpen(false)} className="p-1 rounded bg-white/10">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Voice Mic Controls */}
          <div className="p-2 bg-emerald-950/70 border-b border-emerald-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleMicrophone}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${
                  micEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-white border border-slate-600'
                }`}
              >
                {micEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-rose-400" />}
                <span>{micEnabled ? 'Mic Active' : 'Enable Mic'}</span>
              </button>

              <button
                onClick={() => setPttMode((p) => !p)}
                className={`px-2 py-1 rounded text-[9px] font-extrabold border ${
                  pttMode ? 'bg-amber-400 text-slate-950 border-white' : 'bg-black/40 text-slate-300 border-slate-700'
                }`}
              >
                {pttMode ? 'Mode: Push-to-Talk' : 'Mode: Open Mic'}
              </button>
            </div>

            {pttMode && micEnabled && (
              <button
                onMouseDown={() => setPttHolding(true)}
                onMouseUp={() => setPttHolding(false)}
                onMouseLeave={() => setPttHolding(false)}
                onTouchStart={() => setPttHolding(true)}
                onTouchEnd={() => setPttHolding(false)}
                className={`w-full py-1.5 rounded-lg text-[10px] font-black border ${
                  pttHolding
                    ? 'bg-rose-600 text-white border-rose-200'
                    : 'bg-slate-800 text-amber-300 border-amber-400/50'
                }`}
              >
                {pttHolding ? '🎙️ TRANSMITTING...' : 'HOLD TO TALK'}
              </button>
            )}
            {micError && <p className="text-[9px] text-rose-300">{micError}</p>}
          </div>

          {/* Chat Message Feed */}
          <div className="flex-1 p-2 overflow-y-auto space-y-1.5 text-[11px]">
            {chatMessages.map((m) => (
              <div key={m.id} className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[9px] text-amber-300 font-bold">
                  <span>{m.senderName}</span>
                  <span className="text-slate-400">{m.time}</span>
                </div>
                <div className="text-white mt-0.5">{m.text}</div>
              </div>
            ))}
          </div>

          {/* Quick-Chat Pills */}
          <div className="px-2 py-1 border-t border-slate-800 flex gap-1 overflow-x-auto">
            {QUICK_CHATS.map((qc) => (
              <button
                key={qc}
                onClick={() => sendTableChat(qc)}
                className="px-2 py-0.5 rounded-full bg-emerald-900/90 hover:bg-emerald-700 border border-emerald-500/40 text-[9px] font-bold whitespace-nowrap"
              >
                {qc}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendTableChat();
            }}
            className="p-2 border-t border-slate-800 flex gap-1"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Say something..."
              className="flex-1 min-w-0 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PASS & PLAY PRIVACY CURTAIN                                          */}
      {/* ==================================================================== */}
      {passCurtainPlayer && (
        <div className="fixed inset-0 z-50 bg-[#052e16] flex flex-col items-center justify-center p-4 text-center">
          <div className="p-5 rounded-3xl bg-[#0b3d20] border-2 border-amber-400 max-w-sm w-full space-y-3">
            <div className="text-3xl">{passCurtainPlayer.emoji}</div>
            <h3 className="text-base font-black text-amber-300">
              Pass Device to {passCurtainPlayer.name}
            </h3>
            <p className="text-xs text-emerald-100">
              Tap below when ready to reveal your cards.
            </p>
            <button
              onClick={() => {
                setHumanSeatIndex(passCurtainPlayer.id);
                setPassCurtainPlayer(null);
              }}
              className="w-full py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs"
            >
              I am {passCurtainPlayer.name} — Show My Hand
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-11 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-slate-950/95 border border-amber-400 text-amber-300 text-[11px] font-black shadow-xl pointer-events-none">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
