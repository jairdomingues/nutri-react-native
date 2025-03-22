import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { 
  Card, 
  List, 
  FAB, 
  Surface, 
  useTheme,
  Avatar,
  Portal,
  Dialog,
  Button,
  Appbar
} from 'react-native-paper';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Nutrient progress component
const NutrientProgress = ({ label, current, max, color }) => {
  const progress = Math.min(current / max, 1);
  
  return (
    <View style={styles.nutrientContainer}>
      <View style={styles.nutrientLabelRow}>
        <Text style={styles.nutrientLabel}>{label}</Text>
        <Text style={styles.nutrientValue}>
          {current}/{max}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${progress * 100}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
};

// Meal component
const MealItem = ({ title, time, foods, calories, image }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card style={styles.mealCard} mode="outlined">
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={styles.mealHeader}
      >
        <View style={styles.mealInfo}>
          <Text style={styles.mealTime}>{time}</Text>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealCalories}>{calories} cal</Text>
        </View>
        
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666"
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.foodList}>
          {foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodName}>{food.name}</Text>
              <View style={styles.foodDetails}>
                <Text style={styles.foodQuantity}>{food.quantity}</Text>
                <Text style={styles.foodCalories}>{food.calories} cal</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState({
    title: "Hidratação",
    content: "Lembre-se de beber pelo menos 2 litros de água por dia. A hidratação adequada ajuda na digestão e absorção de nutrientes."
  });
  
  const tips = [
    {
      title: "Hidratação",
      content: "Lembre-se de beber pelo menos 2 litros de água por dia. A hidratação adequada ajuda na digestão e absorção de nutrientes."
    },
    {
      title: "Proteínas vegetais",
      content: "Considere adicionar mais fontes de proteína vegetal à sua alimentação, como tofu, lentilhas e grão-de-bico."
    },
    {
      title: "Fibras",
      content: "Aumente a ingestão de alimentos ricos em fibras, como frutas, vegetais e grãos integrais, para melhorar a saúde intestinal."
    }
  ];
  
  const showRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentTip(tips[randomIndex]);
    setShowTip(true);
  };
  
  // Sample data
  const meals = [
    {
      id: 1,
      title: 'Café da manhã',
      time: '07:30',
      calories: 350,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
      foods: [
        { name: 'Iogurte grego', quantity: '100g', calories: 130 },
        { name: 'Granola', quantity: '30g', calories: 120 },
        { name: 'Banana', quantity: '1 unidade', calories: 100 },
      ]
    },
    {
      id: 2,
      title: 'Almoço',
      time: '12:00',
      calories: 550,
      image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
      foods: [
        { name: 'Peito de frango grelhado', quantity: '120g', calories: 180 },
        { name: 'Arroz integral', quantity: '80g', calories: 150 },
        { name: 'Brócolis', quantity: '100g', calories: 55 },
        { name: 'Azeite de oliva', quantity: '1 colher', calories: 45 },
        { name: 'Salada verde', quantity: '1 porção', calories: 120 },
      ]
    },
    {
      id: 3,
      title: 'Lanche',
      time: '16:00',
      calories: 200,
      image: 'https://images.unsplash.com/photo-1568093858174-0f391ea21c45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
      foods: [
        { name: 'Maçã', quantity: '1 unidade', calories: 80 },
        { name: 'Castanhas', quantity: '30g', calories: 120 },
      ]
    },
    {
      id: 4,
      title: 'Jantar',
      time: '20:00',
      calories: 450,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
      foods: [
        { name: 'Salmão', quantity: '100g', calories: 180 },
        { name: 'Batata doce assada', quantity: '100g', calories: 120 },
        { name: 'Legumes', quantity: '150g', calories: 150 },
      ]
    },
    {
      id: 5,
      title: 'Ceia',
      time: '22:30',
      calories: 100,
      image: null,
      foods: [
        { name: 'Chá de camomila', quantity: '200ml', calories: 0 },
        { name: 'Torrada integral', quantity: '2 unidades', calories: 70 },
        { name: 'Queijo cottage', quantity: '30g', calories: 30 },
      ]
    }
  ];
  
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6ABF69"
      />
      
      {/* Custom Header for better iOS compatibility */}
      <View style={[
        styles.customHeader, 
        Platform.OS === 'ios' 
          ? { paddingTop: insets.top } 
          : { paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 16 }
      ]}>
        <Text style={styles.headerTitle}>NutriAI</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => {}}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => {}}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Welcome Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.welcomeCardContent}>
            <View style={styles.welcomeTopSection}>
              <View style={styles.welcomeNameSection}>
                <Text style={styles.welcomeTitle}>Bom dia, Marina!</Text>
                <View style={styles.avatarContainer}>
                  <Avatar.Image 
                    size={50} 
                    source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
                  />
                </View>
              </View>
              <Text style={styles.planDayText}>7º dia seguindo o plano 🎉</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={styles.progressBarFill} />
              <Text style={styles.progressText}>75%</Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Indicadores Card */}
        <Card style={styles.indicatorsCard}>
          <Card.Content style={styles.indicatorsCardContent}>
            <View style={styles.indicatorItem}>
              <View style={[styles.indicatorCircle, { borderColor: '#4CAF50' }]}>
                <Text style={styles.indicatorNumber}>7</Text>
              </View>
              <Text style={styles.indicatorLabel}>Dias</Text>
            </View>
            
            <View style={styles.indicatorItem}>
              <View style={[styles.indicatorCircle, { borderColor: '#FFA726' }]}>
                <Text style={styles.indicatorNumber}>85%</Text>
              </View>
              <Text style={styles.indicatorLabel}>Meta</Text>
            </View>
            
            <View style={styles.indicatorItem}>
              <View style={[styles.indicatorCircle, { borderColor: '#2196F3' }]}>
                <Text style={styles.indicatorNumber}>2</Text>
              </View>
              <Text style={styles.indicatorLabel}>Dias p/ consulta</Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Meal Plan Card */}
        <Card style={styles.mealPlanCard}>
          <Card.Content style={styles.mealPlanCardContent}>
            <Text style={styles.cardTitle}>Seu Plano Alimentar</Text>
            <Text style={styles.cardSubtitle}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            
            <View style={styles.mealList}>
              {meals.map((meal) => (
                <MealItem
                  key={meal.id}
                  title={meal.title}
                  time={meal.time}
                  foods={meal.foods}
                  calories={meal.calories}
                  image={meal.image}
                />
              ))}
            </View>
          </Card.Content>
        </Card>
        
        {/* Suggestions Card */}
        <Card style={styles.suggestionsCard}>
          <Card.Content style={styles.suggestionsCardContent}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.cardTitle}>Dicas Personalizadas</Text>
              <TouchableOpacity onPress={showRandomTip}>
                <MaterialIcons name="lightbulb" size={24} color="#FFB300" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tipContainer}>
              <View style={styles.tipIconContainer}>
                <FontAwesome5 name="seedling" size={24} color="#4CAF50" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Hidratação</Text>
                <Text style={styles.tipText}>
                  Lembre-se de beber pelo menos 2 litros de água por dia. A hidratação adequada ajuda na digestão e absorção de nutrientes.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Botão de chat - Solução universal que deve funcionar em ambas plataformas */}
      <View style={[
        styles.absoluteButtonContainer,
        Platform.OS === 'ios' 
          ? { bottom: 100, right: 20 } // Posição ajustada para iOS
          : { bottom: 16 }
      ]}>
        <TouchableOpacity
          style={styles.testChatButton}
          onPress={() => router.push('/chat')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="chatbubble" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Tip Dialog */}
      <Portal>
        <Dialog visible={showTip} onDismiss={() => setShowTip(false)}>
          <Dialog.Title>{currentTip.title}</Dialog.Title>
          <Dialog.Content>
            <Text>{currentTip.content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowTip(false)}>Entendi</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Custom Header styles for better iOS compatibility
  customHeader: {
    backgroundColor: '#6ABF69',
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIconButton: {
    padding: 8,
    marginLeft: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  // Header Card
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeCardContent: {
    padding: 16,
  },
  welcomeTopSection: {
    marginBottom: 12,
  },
  welcomeNameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  avatarContainer: {
    marginLeft: 'auto',
  },
  planDayText: {
    fontSize: 16,
    color: '#757575',
    marginVertical: 4,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    width: '75%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  progressText: {
    position: 'absolute',
    right: 8,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
    top: 0,
    lineHeight: 16,
  },
  // Nutrient Progress - mantendo estas propriedades para evitar erros
  nutrientProgressContainer: {
    marginTop: 8,
  },
  nutrientContainer: {
    marginBottom: 8,
  },
  nutrientLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#616161',
  },
  nutrientValue: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  // Stats Section
  statsSurface: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  statsLabel: {
    fontSize: 14,
    color: '#757575',
  },
  statsDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e0e0e0',
  },
  // Meal Plan Card
  mealPlanCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#f1f8e9', // Light green background
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mealPlanCardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  mealList: {
    gap: 12,
  },
  // Meal Card
  mealCard: {
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealTime: {
    fontSize: 12,
    color: '#757575',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  mealCalories: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  // Food List
  foodList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  foodName: {
    fontSize: 14,
    color: '#424242',
  },
  foodDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodQuantity: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  foodCalories: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  // Suggestions Card
  suggestionsCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#f1f8e9', // Verde claro para manter o padrão
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionsCardContent: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    padding: 16,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  // Solução universal para o botão de chat
  absoluteButtonContainer: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  testChatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: Platform.OS === 'ios' ? 3 : 0,
    borderColor: 'white',
  },
  // Indicators Card
  indicatorsCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  indicatorsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  indicatorItem: {
    alignItems: 'center',
  },
  indicatorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  indicatorNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // Bottom spacing
  bottomSpacing: {
    height: 80,
  },
});

