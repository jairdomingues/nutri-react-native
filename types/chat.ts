import { AVPlaybackStatus } from 'expo-av';

// Status possíveis para uma mensagem
export type MessageStatus = 'sent' | 'delivered' | 'read';

// Interface para uma mensagem
export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    status?: MessageStatus;
    audioUri?: string;
    audioDuration?: number;
    hidden?: boolean;
}

// Interface para as props do componente MessageBubble
export interface MessageBubbleProps {
    message: Message;
    isUser: boolean;
    audioUri?: string;
    audioDuration?: number;
    playAudio?: (uri: string) => void;
    isPlaying?: boolean;
    timestamp: Date;
    status?: MessageStatus;
    onReply?: () => void;
    onCopy?: () => void;
}

// Interface para as props do componente AudioWave
export interface AudioWaveProps {
    isPlaying: boolean;
    onPress: () => void;
    isMuted?: boolean;
}

// Interface para status de áudio
export interface AudioPlaybackStatus {
    isLoaded: boolean;
    didJustFinish?: boolean;
    error?: string;
    durationMillis?: number;
    positionMillis?: number;
    shouldPlay?: boolean;
    isPlaying?: boolean;
    isBuffering?: boolean;
    rate?: number;
    shouldCorrectPitch?: boolean;
    volume?: number;
    isMuted?: boolean;
    isLooping?: boolean;
} 