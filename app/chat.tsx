import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Clipboard,
  Alert,
  AppState,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import AudioWaveform from '../components/AudioWaveform';
import { Message as ChatMessage, MessageStatus } from '../types/chat';
import { ChatService } from '../services/chatService';
import { useRouter } from 'expo-router';

// Interface para status de áudio local para evitar conflito com o tipo importado
interface LocalAudioStatus {
  isLoaded: boolean;
  didJustFinish?: boolean;
  error?: string;
  durationMillis?: number;
  positionMillis?: number;
  shouldPlay?: boolean;
  isPlaying?: boolean;
}

// Interface para as props do componente AudioWave
interface AudioWaveProps {
  isPlaying: boolean;
  onPress: () => void;
}

// Interface local para status do áudio
interface AudioStatus {
  isLoaded: boolean;
  error?: string;
}

// Definindo interfaces para as props e tipos
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUri?: string;
  audioDuration?: number;
  status?: string;
  hidden?: boolean; // Propriedade para indicar se a mensagem deve ser escondida
}

// Modificar a interface MessageBubbleProps para remover propriedades de animação
interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  audioUri?: string;
  audioDuration?: number;
  playAudio?: () => void;
  isPlaying?: boolean;
  timestamp: Date;
  status?: string;
  onReply?: () => void;
  onCopy?: () => void;
}

// Tipos para status de reprodução
interface AVPlaybackStatusSuccess {
  isLoaded: true;
  didJustFinish?: boolean;
  durationMillis?: number;
  positionMillis?: number;
  isPlaying?: boolean;
  isBuffering?: boolean;
  rate?: number;
  shouldCorrectPitch?: boolean;
  volume?: number;
  shouldPlay?: boolean;
  isLooping?: boolean;
}

interface AVPlaybackStatusError {
  isLoaded: false;
  error: string | undefined;
}

type AVPlaybackStatus = AVPlaybackStatusSuccess | AVPlaybackStatusError;

// Tipos para erros
interface AudioError extends Error {
  code?: string;
  message: string;
}

// Atualizar o componente MessageBubble para remover a lógica de animação
const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser,
  audioUri,
  audioDuration,
  playAudio,
  isPlaying,
  timestamp,
  status,
  onReply,
  onCopy,
}) => {
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  
  const getStatusIcon = () => {
    if (!isUser || !status) return null;
    
    switch (status) {
      case 'sent':
        return <Ionicons name="checkmark" size={14} color="#919191" />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={14} color="#919191" />;
      case 'read':
        return <Ionicons name="checkmark-done" size={14} color="#4fc3f7" />;
      default:
        return null;
    }
  };
  
  return (
    <View style={[
      styles.bubbleContainer,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble
      ]}>
        <Text style={styles.messageText}>{message.text}</Text>
        
        {audioUri && (
          <View style={styles.audioPlayer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={playAudio}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={18}
                color="#4CAF50"
              />
            </TouchableOpacity>
            
            <View style={styles.waveContainer}>
              {[...Array(10)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.waveformBar,
                    i % 2 === 0 && styles.tallBar,
                    i % 3 === 0 && styles.mediumBar
                  ]} 
                />
              ))}
            </View>
            
            <Text style={styles.duration}>{audioDuration || '0:00'}</Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.actions}>
            {!isUser && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  console.log('Botão de fala acionado para mensagem');
                  // Parar qualquer fala anterior
                  Speech.stop();
                  // Usar configuração simplificada para maior compatibilidade
                  Speech.speak(message.text, {
                    language: 'pt-BR',
                    pitch: 1.0,
                    rate: 0.9,
                    onStart: () => console.log('Fala iniciada com sucesso para mensagem individual'),
                    onDone: () => console.log('Fala finalizada com sucesso para mensagem individual'),
                    onError: (err) => {
                      console.error('Erro ao reproduzir fala individual:', err);
                      Alert.alert('Erro', 'Não foi possível reproduzir áudio.');
                    }
                  });
                }}
              >
                <Ionicons name="play" size={14} color="#666" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={onReply}
            >
              <Ionicons name="arrow-undo" size={14} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onCopy}
            >
              <Ionicons name="copy" size={14} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.status}>
            <Text style={styles.time}>{formattedTime}</Text>
            {getStatusIcon()}
          </View>
        </View>
      </View>
    </View>
  );
};

// Audio wave component for TTS
const AudioWave: React.FC<AudioWaveProps> = ({ isPlaying, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.audioWaveContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.audioWaveInner}>
        {/* Avatar à esquerda */}
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }} 
            style={styles.avatarImage}
          />
        </View>
        
        {/* Ondas sonoras ao centro */}
        <View style={styles.waveContainer}>
          <AudioWaveform
            isPlaying={isPlaying}
            color="#ffffff"
            backgroundColor="transparent"
            onPress={onPress}
          />
        </View>
        
        {/* Botão de pause à direita */}
        <View style={styles.playButtonContainer}>
          {isPlaying ? (
            <View style={styles.pauseIconContainer}>
              <View style={styles.pauseBar}></View>
              <View style={styles.pauseBar}></View>
            </View>
          ) : (
            <Ionicons name="play" size={24} color="#ffffff" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Adicionar a função handleKeyPress que foi removida
const handleKeyPress = (e: any, inputText: string, sendMessage: () => void) => {
  // No iOS e Android, verificamos o KeyCode 13 (Enter)
  if (e.nativeEvent.key === 'Enter') {
    // Prevenimos quebra de linha se Shift não estiver pressionado
    if (!e.nativeEvent.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        sendMessage();
      }
      return false;
    }
  }
  return true;
};

// Adicionar um novo componente para exibir o texto sincronizado
const SpeechBubble: React.FC<{ text: string; visible: boolean }> = ({ text, visible }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.integratedSpeechBubble}>
      <View style={styles.speechBubbleInner}>
        <Text style={styles.speechBubbleText}>{text}</Text>
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showAudioWave, setShowAudioWave] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const [playingMessageUri, setPlayingMessageUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speechProgress, setSpeechProgress] = useState<number>(0);
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<string | null>(null);
  const [displaySpeechText, setDisplaySpeechText] = useState<string>('');
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(false);
  
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const textAnimationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configuração inicial de áudio e permissões
  useEffect(() => {
    console.log('#### INICIALIZAÇÃO PRINCIPAL DO ÁUDIO ####');
    
    // Primeiro, garantimos que qualquer reprodução de áudio anterior seja interrompida
    try {
      Speech.stop();
    } catch (e) {
      console.log('Erro ao tentar parar fala anterior (não crítico):', e);
    }
    
    // No iOS, é crucial configurar o áudio corretamente
    if (Platform.OS === 'ios') {
      // Configuração de áudio específica para iOS
      const initIosAudio = async () => {
        try {
          console.log('#### INICIANDO CONFIGURAÇÃO CRÍTICA DE ÁUDIO IOS ####');
          
          // SOLUÇÃO: Solicitar permissões de microfone PROATIVAMENTE
          console.log('iOS: Solicitando permissões de microfone proativamente...');
          const permissionResult = await Audio.requestPermissionsAsync();
          console.log('iOS: Resultado da permissão de microfone:', permissionResult);
          
          // NOVA ABORDAGEM: Configuração mais agressiva para iOS
          // Primeiro garantimos que o sistema de áudio está habilitado
          await Audio.setIsEnabledAsync(true);
          
          // Em seguida, configuramos o AVAudioSession com mais prioridade
          console.log('iOS: Configurando AVAudioSession com ALTA PRIORIDADE');
          try {
            // Tentativa de usar a categoria PlayAndRecord, que tem mais prioridade no sistema
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true, // Habilitar gravação temporariamente
              playsInSilentModeIOS: true,
              staysActiveInBackground: true,
              interruptionModeIOS: 1, // 1 = MIX_WITH_OTHERS
              shouldDuckAndroid: false,
            });
            
            // Aguardar um momento para que as configurações sejam aplicadas
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Vamos tentar utilizar o TTS com um volume baixo mas audível para inicializar o sistema de áudio
            console.log('iOS: Tentando acordar o sistema de áudio com TTS de baixo volume');
            try {
              // Utilizar um espaço em branco com volume baixo
              await Speech.speak('   ', { 
                volume: 0.3, 
                rate: 0.5,
                onDone: () => console.log('iOS: TTS inicial de baixo volume concluído')
              });
              
              // Aguardar um momento para o sistema processar
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
              console.log('Erro ao reproduzir TTS inicial (não crítico):', e);
            }
          } catch (e) {
            console.log('Erro na configuração AVAudioSession inicial:', e);
          }
          
          // Agora, voltar para o modo de reprodução
          console.log('iOS: Voltando para modo de reprodução padrão após ativação');
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false, // Voltar para modo de reprodução
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            interruptionModeIOS: 1, // 1 = MIX_WITH_OTHERS
            shouldDuckAndroid: false,
          });
          
          // Garantir novamente que o áudio está habilitado
          await Audio.setIsEnabledAsync(true);
          
          // Forçar a atualização do app state
          AppState.currentState = 'active';
          
          // Inicializar o TTS - verificar vozes disponíveis
          try {
            const voices = await Speech.getAvailableVoicesAsync();
            console.log(`iOS: Vozes disponíveis: ${voices.length}`);
            if (voices.length > 0) {
              console.log('iOS: Primeira voz disponível:', voices[0]);
            }
            
            // IMPORTANTE: Teste explícito de volume para garantir que o sistema está configurado
            console.log('iOS: Realizando teste de TTS com volume mais alto...');
            await Speech.speak('  ', {
              volume: 0.5, // Volume mais alto para testar
              pitch: 1.0,
              rate: 0.5,
              onDone: () => console.log('iOS: Teste de TTS concluído com sucesso')
            });
          } catch (e) {
            console.log('Erro ao testar TTS (não crítico):', e);
          }
          
          // Configurar flag para indicar que o áudio está pronto
          setTimeout(() => {
            setAudioInitialized(true);
            console.log('iOS: Áudio inicializado com sucesso após configuração completa');
          }, 800);
        } catch (err) {
          console.log('Erro na inicialização de áudio iOS:', err);
          setAudioInitialized(true); // Mesmo com erro, precisamos continuar
        }
      };
      
      // Iniciar o processo imediatamente
      initIosAudio();
    } else {
      // Para Android, o processo é mais simples
      setupAudio();
    }
    
    // Monitor app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        if (Platform.OS === 'ios') {
          console.log('Aplicativo voltou ao primeiro plano, reativando áudio');
          // Reativar áudio ao voltar para o primeiro plano no iOS
          Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            interruptionModeIOS: 1, // 1 = MIX_WITH_OTHERS
            shouldDuckAndroid: false,
          }).catch(e => console.log('Erro ao reativar áudio:', e));
          
          // Ativar sistema de áudio explicitamente
          Audio.setIsEnabledAsync(true).catch(e => console.log('Erro ao ativar áudio:', e));
        } else {
          setupAudio();
        }
      }
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
      cleanupAudio();
    };
  }, []);
  
  const setupAudio = async () => {
    try {
      console.log('Inicializando configuração de áudio...');
      
      // Para iOS, precisamos configurar o AVAudioSession corretamente
      if (Platform.OS === 'ios') {
        console.log('Configurando AVAudioSession para iOS...');
        try {
          // SOLUÇÃO: Solicitar permissões de microfone PROATIVAMENTE
          console.log('iOS (setupAudio): Solicitando permissões de microfone proativamente...');
          const permissionResult = await Audio.requestPermissionsAsync();
          console.log('iOS (setupAudio): Resultado da permissão de microfone:', permissionResult);
          
          // Mesma sequência: primeiro ativar gravação para "acordar" o sistema
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true, // Ativar temporariamente
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            interruptionModeIOS: 1, // 1 = MIX_WITH_OTHERS
            shouldDuckAndroid: false,
          });
          
          // Pequena pausa para o sistema processar
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Depois desativar gravação para voltar ao modo de reprodução
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false, // Voltar para modo de reprodução
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            interruptionModeIOS: 1, // 1 = MIX_WITH_OTHERS
            shouldDuckAndroid: false,
          });
          
          // Verificar se o AVAudioSession está ativo
          console.log('iOS: Verificando se o AVAudioSession está ativo');
          const isAudioEnabled = await Audio.getPermissionsAsync();
          console.log('iOS: Status do áudio:', isAudioEnabled);
          
          // No iOS, precisamos ativar explicitamente o áudio 
          await Audio.setIsEnabledAsync(true);
          console.log('iOS: Audio.setIsEnabledAsync(true) executado');
          
          // Teste silencioso de TTS
          await Speech.speak(' ', {
            volume: 0,
            onDone: () => console.log('iOS (setupAudio): Teste silencioso de TTS concluído')
          });
        } catch (e) {
          console.error('Erro na configuração do AVAudioSession:', e);
        }
      }
      
      // Solicitar permissões APÓS configurar o modo de áudio
      const { status: micPermission } = await Audio.requestPermissionsAsync();
      console.log('Status da permissão de microfone:', micPermission);
      setHasAudioPermission(micPermission === 'granted');
      
      if (micPermission !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Este aplicativo precisa de acesso ao microfone para enviar mensagens de áudio.',
          [{ text: 'OK' }]
        );
      }
      
      // Inicialização específica para iOS
      if (Platform.OS === 'ios') {
        setAudioInitialized(true);
        console.log('iOS: Audio inicializado via setupAudio');
      } else {
        // Em outros sistemas, consideramos já inicializado
        setAudioInitialized(true);
      }
      
      console.log('Configuração de áudio concluída com sucesso');
    } catch (error) {
      console.error('Erro ao configurar áudio:', error);
      // Mesmo com erro, marcamos como inicializado para não bloquear a experiência
      setAudioInitialized(true);
    }
  };
  
  const cleanupAudio = () => {
    if (isSpeaking) {
      console.log('Limpando recursos de fala...');
      Speech.stop();
    }
    if (sound) {
      console.log('Limpando recursos de som...');
      sound.unloadAsync();
    }
    if (recording) {
      console.log('Limpando recursos de gravação...');
      recording.stopAndUnloadAsync();
    }
  };
  
  // Função para lidar com erros
  const handleError = (error: unknown, context: string = 'operação') => {
    console.error(`Erro em ${context}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
    Alert.alert('Erro', errorMessage);
  };
  
  // Initialize chat
  const initializeChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Não carrega mais mensagem de boas-vindas, inicia com chat vazio
      setMessages([]);
      setIsLoading(false);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao inicializar chat:', errorMessage);
      setError('Não foi possível carregar o chat. Tente novamente mais tarde.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();

    // Cleanup function
    return () => {
      if (isSpeaking) {
        Speech.stop();
      }
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      // Adicionar o cleanup do intervalo de animação aqui
      if (textAnimationIntervalRef.current) {
        clearInterval(textAnimationIntervalRef.current);
        textAnimationIntervalRef.current = null;
      }
    };
  }, [initializeChat]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 200);
    }
  }, [messages]);
  
  // Função para parar a fala - movida para ANTES de sendMessage
  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
    setIsAudioPlaying(false);
    setSpeechProgress(1);
    setCurrentSpeakingMessageId(null);
    setShowSpeechBubble(false);
    
    if (textAnimationIntervalRef.current) {
      clearInterval(textAnimationIntervalRef.current);
      textAnimationIntervalRef.current = null;
    }
  };
  
  // Agora a função sendMessage pode usar stopSpeaking sem problemas
  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;
    
    // Stop any speech when user sends message
    stopSpeaking();
    setShowAudioWave(false);
    
    // Clear any pending speaking state
    setCurrentSpeakingMessageId(null);
    setSpeechProgress(0);
    
    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sent',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Scroll to the newly added message
    scrollToBottom();
    
    // Simulate status changing to delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: 'delivered'} : msg
        )
      );
      
      // Simulate assistant response
      setTimeout(() => {
        // Update status to read
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id ? {...msg, status: 'read'} : msg
          )
        );
        
        // Generate assistant response based on user message
        let responseText = "Obrigado por sua mensagem. Estou processando sua pergunta e logo terei uma resposta para você.";
        
        // Simple keyword-based responses
        const lowerCaseInput = inputText.toLowerCase();
        if (lowerCaseInput.includes('substituir') || lowerCaseInput.includes('substituição')) {
          responseText = "Para substituir um alimento, procure por opções com perfil nutricional semelhante. Por exemplo, você pode trocar arroz por quinoa, ou frango por peixe.";
        } else if (lowerCaseInput.includes('refeição') || lowerCaseInput.includes('próxima')) {
          responseText = "Sua próxima refeição está programada conforme seu plano alimentar. Lembre-se de manter o intervalo de 3-4 horas entre as refeições para melhor metabolismo.";
        }
        
        // Variável para guardar a ID da mensagem temporária
        const tempId = 'temp-' + Date.now().toString();
        
        // Iniciar reprodução de áudio e mostrar o componente de onda
        setShowAudioWave(true);
        setAudioFinished(false);
        
        // Criar uma mensagem temporária invisível (somente para sincronização)
        const hiddenMessage: ChatMessage = {
          id: tempId,
          text: responseText,
          isUser: false,
          timestamp: new Date(),
          hidden: true // Propriedade adicional para indicar mensagem escondida
        };
        
        // Adicionar a mensagem temporária escondida
        setMessages(prev => [...prev, hiddenMessage]);
        
        // Iniciar a sincronização de texto e áudio
        setTimeout(() => {
          speakMessage(responseText, tempId);
        }, 100);
      }, 1000);
    }, 1000);
  }, [inputText]);

  // Modificar a função speakMessage para receber o ID da mensagem temporária
  const speakMessage = async (text: string, tempId?: string) => {
    try {
      setIsSpeaking(true);
      setIsAudioPlaying(true);
      setSpeechProgress(0);
      setDisplaySpeechText(''); // Iniciar com texto vazio
      setShowSpeechBubble(true); // Mostrar o balão de fala
      
      // Estima a duração total da fala (aproximadamente 15 caracteres por segundo)
      const estimatedDuration = Math.max(3000, text.length * 65); // Mínimo 3 segundos
      const updateInterval = 50; // Atualização a cada 50ms
      const totalSteps = estimatedDuration / updateInterval;
      
      let currentStep = 0;
      
      // Limpa intervalos anteriores
      if (textAnimationIntervalRef.current) {
        clearInterval(textAnimationIntervalRef.current);
      }
      
      // Inicia a animação de texto
      textAnimationIntervalRef.current = setInterval(() => {
        currentStep++;
        const progress = Math.min(1, currentStep / totalSteps);
        setSpeechProgress(progress);
        
        // Atualizar o texto exibido no balão de fala
        const charsToShow = Math.ceil(text.length * progress);
        setDisplaySpeechText(text.substring(0, charsToShow));
        
        if (progress >= 1) {
          if (textAnimationIntervalRef.current) {
            clearInterval(textAnimationIntervalRef.current);
            textAnimationIntervalRef.current = null;
          }
        }
      }, updateInterval);
      
      await Speech.speak(text, {
        language: 'pt-BR',
        pitch: 1.0,
        rate: 0.9,
        onStart: () => {
          console.log('Fala iniciada com sucesso');
        },
        onDone: () => {
          setIsSpeaking(false);
          setIsAudioPlaying(false);
          setAudioFinished(true);
          setSpeechProgress(1);
          setCurrentSpeakingMessageId(null);
          
          // Atualizar o texto completo final
          setDisplaySpeechText(text);
          
          // Após completar a sincronia, substituir a mensagem temporária pela definitiva
          if (tempId) {
            // Substituir a mensagem temporária pela definitiva
            setMessages(prev => prev.map(msg => {
              if (msg.id === tempId) {
                // Retornar uma nova mensagem usando os mesmos dados, mas sem a flag hidden
                return {
                  ...msg,
                  hidden: false
                };
              }
              return msg;
            }));
            
            // Scroll to bottom após mostrar a mensagem
            scrollToBottom();
            
            // Ocultar o balão após um tempo
            setTimeout(() => {
              setShowSpeechBubble(false);
            }, 1000);
          }
          
          // Limpa o intervalo se existir
          if (textAnimationIntervalRef.current) {
            clearInterval(textAnimationIntervalRef.current);
            textAnimationIntervalRef.current = null;
          }
        },
        onError: () => {
          setIsSpeaking(false);
          setIsAudioPlaying(false);
          setAudioFinished(true);
          setSpeechProgress(1);
          setCurrentSpeakingMessageId(null);
          setShowSpeechBubble(false);
          
          // Mostrar a mensagem definitiva mesmo em caso de erro
          if (tempId) {
            setMessages(prev => prev.map(msg => {
              if (msg.id === tempId) {
                return {
                  ...msg,
                  hidden: false
                };
              }
              return msg;
            }));
            scrollToBottom();
          }
          
          // Limpa o intervalo se existir
          if (textAnimationIntervalRef.current) {
            clearInterval(textAnimationIntervalRef.current);
            textAnimationIntervalRef.current = null;
          }
        }
      });
    } catch (error) {
      handleError(error, 'reprodução de voz');
      setIsSpeaking(false);
      setIsAudioPlaying(false);
      setSpeechProgress(1);
      setCurrentSpeakingMessageId(null);
      setShowSpeechBubble(false);
      
      // Mostrar a mensagem definitiva mesmo em caso de erro
      if (tempId) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === tempId) {
            return {
              ...msg,
              hidden: false
            };
          }
          return msg;
        }));
        scrollToBottom();
      }
      
      if (textAnimationIntervalRef.current) {
        clearInterval(textAnimationIntervalRef.current);
        textAnimationIntervalRef.current = null;
      }
    }
  };
  
  // Play audio message
  const playAudio = async (uri: string) => {
    try {
      if (playingMessageUri === uri && sound) {
        const status = await sound.getStatusAsync() as AVPlaybackStatus;
        
        if (status.isLoaded && !status.didJustFinish) {
          await sound.stopAsync();
          setPlayingMessageUri(null);
          return;
        }
      }
      
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      console.log('Loading Sound');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setPlayingMessageUri(uri);
      
      // Listen for status updates
      newSound.setOnPlaybackStatusUpdate((status: import('expo-av').AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingMessageUri(null);
        }
      });
      
      await newSound.playAsync();
    } catch (error) {
      handleError(error, 'reprodução de áudio');
      setPlayingMessageUri(null);
    }
  };
  
  // Message interaction handlers
  const handleReplyToMessage = (message: ChatMessage) => {
    const quotePrefix = message.isUser ? 'Você: ' : 'Assistente: ';
    const quotedText = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
    
    setInputText(`[Resposta à "${quotePrefix}${quotedText}"] \n`);
    
    // Try to focus the input
    if (Platform.OS === 'ios') {
      Keyboard.dismiss();
      setTimeout(() => {
        const input = document.querySelector('input');
        if (input) {
          input.focus();
        }
      }, 100);
    }
  };
  
  const handleCopyMessage = (text: string) => {
    Clipboard.setString(text);
    Alert.alert("Copiado", "Mensagem copiada para a área de transferência");
  };
  
  // Modificar a função renderMessage para esconder mensagens temporárias
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    // Se a mensagem estiver marcada como escondida, não renderizá-la
    if (item.hidden) {
      return null;
    }
    
    return (
      <MessageBubble
        message={item}
        isUser={item.isUser}
        audioUri={item.audioUri}
        audioDuration={item.audioDuration}
        playAudio={() => item.audioUri ? playAudio(item.audioUri) : undefined}
        isPlaying={playingMessageUri === item.audioUri}
        timestamp={item.timestamp}
        status={item.status}
        onReply={() => handleReplyToMessage(item)}
        onCopy={() => handleCopyMessage(item.text)}
      />
    );
  };
  
  // Função segura para scroll com verificação de nulidade
  const scrollToBottom = (): void => {
    const list = flatListRef.current;
    if (!list) return;
    
    setTimeout(() => {
      if (list && messages.length > 0) {
        list.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  // Função segura para teclado com verificação de plataforma
  const handleKeyboardDismiss = (): void => {
    if (Platform.OS === 'ios') {
      Keyboard.dismiss();
    }
  };
  
  // Audio recording functions
  const startRecording = useCallback(async () => {
    try {
      console.log('Requesting permissions..');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Você precisa permitir o acesso ao microfone para enviar mensagens de áudio.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      handleError(error, 'gravação de áudio');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      if (uri) {
        sendAudioMessage(uri);
      }
      
      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      handleError(error, 'parar gravação');
      setIsRecording(false);
      setRecording(null);
    }
  }, [recording]);

  const sendAudioMessage = useCallback((audioUri: string) => {
    // Create audio message
    const audioMessage: ChatMessage = {
      id: Date.now().toString(),
      text: "🎤 Mensagem de áudio",
      isUser: true,
      timestamp: new Date(),
      status: 'sent',
      audioUri: audioUri,
      audioDuration: 15, // Duração em segundos
    };
    
    setMessages(prev => [...prev, audioMessage]);
    
    // Simulate status changing to delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === audioMessage.id ? {...msg, status: 'delivered'} : msg
        )
      );
      
      // Simulate assistant response
      setTimeout(() => {
        // Update status to read
        setMessages(prev => 
          prev.map(msg => 
            msg.id === audioMessage.id ? {...msg, status: 'read'} : msg
          )
        );
        
        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "Recebi seu áudio. O que mais posso fazer por você?",
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Start speaking the response
        setShowAudioWave(true);
        setAudioFinished(false);
        speakMessage(assistantMessage.text);
      }, 1000);
    }, 1000);
  }, []);
  
  // Renderiza estado de carregamento
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Renderiza mensagem de erro
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setMessages([]);
            setError(null);
            initializeChat();
          }}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Audio Wave Button integrado com o balão de texto */}
      {showAudioWave && messages.length > 0 && !audioFinished && (
        <View style={styles.audioIntegratedContainer}>
          {/* Componente de áudio */}
          <View style={styles.audioWaveContainer}>
            <AudioWave
              isPlaying={isAudioPlaying}
              onPress={stopSpeaking}
            />
          </View>
          
          {/* Balão de texto como parte contínua do áudio */}
          {showSpeechBubble && (
            <View style={styles.integratedSpeechBubble}>
              <View style={styles.speechBubbleInner}>
                <Text style={styles.speechBubbleText}>{displaySpeechText}</Text>
              </View>
            </View>
          )}
        </View>
      )}
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
        />
        
        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isRecording && styles.recordingInput
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            multiline
            blurOnSubmit={false}
            onSubmitEditing={() => {
              if (inputText.trim()) {
                sendMessage();
              }
            }}
            onKeyPress={(e) => handleKeyPress(e, inputText, sendMessage)}
            returnKeyType="send"
          />
          
          {inputText.trim() ? (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.micButton,
                isRecording && styles.recordingButton
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons 
                name={isRecording ? "stop-circle" : "mic"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  messageList: {
    padding: 8,
    paddingBottom: 16,
  },
  audioIntegratedContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  audioWaveContainer: {
    width: 290,
    marginBottom: 0, // Zero para aproximar o balão
    zIndex: 2, // Para ficar acima do balão
  },
  audioWaveInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
  },
  recordingInput: {
    borderWidth: 2,
    borderColor: '#f44336',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#f44336',
    transform: [{scale: 1.1}],
  },
  // Message bubble styles
  bubbleContainer: {
    maxWidth: '85%',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 18,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    borderBottomRightRadius: 5,
  },
  assistantBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    opacity: 0.7,
  },
  actionButton: {
    marginRight: 8,
    padding: 2,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#919191',
    marginRight: 4,
  },
  // Audio player styles
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 4,
    padding: 4,
    height: 40,
  },
  playButton: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  waveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingRight: 0,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  waveformBar: {
    height: 15,
    width: 3,
    backgroundColor: '#888',
    borderRadius: 3,
    opacity: 0.6,
  },
  tallBar: {
    height: 22,
  },
  mediumBar: {
    height: 18,
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    minWidth: 36,
  },
  // Audio wave button styles
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  playButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  pauseIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  pauseBar: {
    width: 4,
    height: 16,
    backgroundColor: 'white',
    borderRadius: 2,
    marginHorizontal: 3,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  combinedContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  // Estilos para o balão de fala
  integratedSpeechBubble: {
    width: 290, // Exatamente a mesma largura do audioWaveContainer
    marginTop: -15, // Sobrepor levemente para dar impressão de continuidade
  },
  speechBubbleInner: {
    backgroundColor: '#e8f5e9', // Cor de fundo verde claro para destacar do chat
    padding: 15,
    borderRadius: 15,
    borderTopLeftRadius: 0, // Cantos superiores retos para dar sensação de continuidade
    borderTopRightRadius: 0, // Cantos superiores retos para dar sensação de continuidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1, // Borda em todos os lados
    borderColor: 'rgba(76, 175, 80, 0.5)', // Borda verde mais visível
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.5)', // Cor verde para combinar com o áudio
  },
  speechBubbleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
}); 