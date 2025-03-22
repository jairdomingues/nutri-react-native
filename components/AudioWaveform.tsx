import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing,
  withDelay,
  cancelAnimation
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AudioWaveformProps {
  isPlaying: boolean;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
}

/**
 * Componente que mostra uma visualização de ondas sonoras animadas
 * similar à animação do Siri no iPhone
 */
const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  isPlaying, 
  onPress, 
  color = '#ffffff',
  backgroundColor = '#4CAF50'
}) => {
  // Exatamente 7 barras como na imagem
  const BAR_COUNT = 7;
  
  // Valores iniciais das alturas das barras
  const barHeights = Array.from({ length: BAR_COUNT }).map(() => useSharedValue(10));
  
  useEffect(() => {
    // Quando a reprodução começa ou para, atualizamos a animação
    if (isPlaying) {
      // Para cada barra, criamos uma animação diferente para criar um efeito orgânico
      barHeights.forEach((bar, index) => {
        // Cancelamos animações anteriores
        cancelAnimation(bar);
        
        // Cada barra terá um atraso ligeiramente diferente
        const delay = index * 60;
        
        // Alturas variadas para um efeito mais natural
        const randomHeight = () => {
          // Barras centrais mais altas, como na imagem
          if (index === 3) return 30 + Math.random() * 5;
          else if (index === 2 || index === 4) return 25 + Math.random() * 5;
          else return 15 + Math.random() * 10;
        };
        
        // Criamos uma sequência de animações que se repete
        bar.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withTiming(randomHeight(), { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
              withTiming(randomHeight(), { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
              withTiming(randomHeight(), { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
            ),
            -1, // Repetir infinitamente
            true // Alternar direção para um efeito mais suave
          )
        );
      });
    } else {
      // Quando a reprodução para, animamos todas as barras para o tamanho mínimo
      barHeights.forEach(bar => {
        cancelAnimation(bar);
        bar.value = withTiming(10, { duration: 300 });
      });
    }
    
    // Limpeza ao desmontar o componente
    return () => {
      barHeights.forEach(bar => {
        cancelAnimation(bar);
      });
    };
  }, [isPlaying]);
  
  // Criamos estilos animados para cada barra
  const barStyles = barHeights.map(height => 
    useAnimatedStyle(() => ({
      height: height.value,
      opacity: isPlaying ? withTiming(1, { duration: 300 }) : withTiming(0.8, { duration: 300 }),
    }))
  );
  
  return (
    <View style={styles.waveContainer}>
      {barStyles.map((style, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            style,
            { backgroundColor: color }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 0,
    width: 170,
  },
  bar: {
    width: 8,
    backgroundColor: 'white',
    borderRadius: 3,
    marginHorizontal: 4,
  }
});

export default AudioWaveform; 