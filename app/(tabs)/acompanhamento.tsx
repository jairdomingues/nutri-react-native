import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { 
  Card, 
  Button, 
  Avatar,
  Divider,
  Badge,
  IconButton,
  Appbar
} from 'react-native-paper';
import { Ionicons, FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

export default function AcompanhamentoNutricionalScreen() {
  const [isPremium, setIsPremium] = useState(true); // Definir como true para mostrar a interface premium por padrão
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Console log para debugging
  useEffect(() => {
    console.log('AcompanhamentoNutricionalScreen montada');
  }, []);
  
  // Dados da nutricionista atual
  const nutricionista = {
    nome: "Dra. Camila Oliveira",
    foto: "https://randomuser.me/api/portraits/women/68.jpg",
    especialidade: "Nutrição Clínica",
    status: "Online",
    bio: "Especialista em nutrição funcional e emagrecimento. Mais de 10 anos de experiência clínica."
  };
  
  // Dados da próxima consulta
  const proximaConsulta = {
    data: "15/03",
    hora: "14:00",
    tipo: "Acompanhamento mensal",
    link: "https://meet.nutriai.com/dr-camila"
  };

  // Histórico de consultas
  const historicoConsultas = [
    {
      id: 1,
      data: "15/02/2023",
      hora: "14:00",
      tipo: "Acompanhamento",
      resumo: "Discutimos ajustes no plano alimentar e novas estratégias para aumentar a ingestão proteica.",
      recomendacoes: "Aumentar consumo de proteínas vegetais e incluir mais legumes nas refeições principais."
    },
    {
      id: 2,
      data: "15/01/2023",
      hora: "14:00",
      tipo: "Consulta inicial",
      resumo: "Avaliação inicial, definição de objetivos e desenvolvimento do primeiro plano alimentar.",
      recomendacoes: "Seguir plano alimentar estabelecido e beber pelo menos 2L de água por dia."
    }
  ];

  if (!isPremium) {
    return (
      <View style={styles.container}>
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

        <ScrollView style={styles.scrollView}>
          <View style={styles.premiumContainer}>
            <View style={styles.premiumHeader}>
              <FontAwesome5 name="crown" size={60} color="#FFD700" style={styles.crownIcon} />
              <Text style={styles.premiumTitle}>Tele-Nutrição Exclusiva</Text>
              <Text style={styles.premiumSubtitle}>
                Tenha acesso a consultas com nutricionistas especializados e receba um plano alimentar personalizado
              </Text>
            </View>
            
            <Card style={styles.benefitsCard}>
              <Card.Content>
                <Text style={styles.benefitsTitle}>Benefícios exclusivos:</Text>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.benefitText}>Consultas online mensais</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.benefitText}>Plano alimentar personalizado</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.benefitText}>Chat exclusivo com nutricionista</Text>
                </View>
                
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.benefitText}>Análise detalhada do seu progresso</Text>
                </View>
              </Card.Content>
            </Card>
            
            <Button 
              mode="contained" 
              style={styles.upgradeButton}
              labelStyle={styles.upgradeButtonLabel}
              onPress={() => setIsPremium(true)} // Simulando upgrade
            >
              Tornar-se Premium
            </Button>
            
            <Text style={styles.pricingText}>
              Por apenas R$ 89,90/mês, cancele quando quiser
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.teleNutricaoContainer}>
          {/* Seção da Nutricionista */}
          <View style={styles.nutricionistaSection}>
            <View style={styles.avatarWrapper}>
              <Avatar.Image 
                source={{ uri: nutricionista.foto }} 
                size={80}
                style={styles.avatar}
              />
            </View>
            <View style={styles.nutricionistaInfo}>
              <Text style={styles.nutricionistaTitle}>Sua Nutricionista</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.nutricionistaNome}>{nutricionista.nome}</Text>
                <Text style={styles.nutricionistaStatus}>{nutricionista.status}</Text>
              </View>
            </View>
          </View>

          {/* Seção da Próxima Consulta */}
          <Card style={styles.consultaCard}>
            <Card.Content>
              <Text style={styles.consultaTitle}>Próxima Consulta:</Text>
              <Text style={styles.consultaData}>
                {proximaConsulta.data} às {proximaConsulta.hora} - {proximaConsulta.tipo}
              </Text>
              
              <Button 
                mode="contained" 
                style={styles.entrarConsultaButton}
                labelStyle={styles.entrarConsultaLabel}
                onPress={() => {}}
              >
                Entrar na Consulta
              </Button>
            </Card.Content>
          </Card>

          {/* Histórico de Consultas */}
          <Card style={styles.historicoCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.historicoTitle}>Última Consulta</Text>
                <TouchableOpacity style={styles.verTodasButton} onPress={() => {}}>
                  <Text style={styles.verTodasText}>Ver todas</Text>
                  <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              
              {historicoConsultas.length > 0 && (
                <View style={styles.historicoItem}>
                  <View style={styles.historicoHeader}>
                    <View style={styles.historicoData}>
                      <MaterialIcons name="event" size={18} color="#4CAF50" />
                      <Text style={styles.historicoDataText}>
                        {historicoConsultas[0].data} - {historicoConsultas[0].hora}
                      </Text>
                    </View>
                    <Text style={styles.historicoTipo}>{historicoConsultas[0].tipo}</Text>
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  <Text style={styles.historicoLabel}>Resumo:</Text>
                  <Text style={styles.historicoText}>{historicoConsultas[0].resumo}</Text>
                  
                  <Text style={styles.historicoLabel}>Recomendações:</Text>
                  <Text style={styles.historicoText}>{historicoConsultas[0].recomendacoes}</Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Menu de Opções */}
          <View style={styles.menuOptions}>
            <TouchableOpacity style={styles.menuOption} onPress={() => router.push('/chat')}>
              <View style={styles.menuIconContainer}>
                <FontAwesome5 name="comment-dots" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.menuOptionTitle}>Chat com Nutricionista</Text>
              <Text style={styles.menuOptionSubtitle}>Tire dúvidas rápidas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuOption} onPress={() => {}}>
              <View style={styles.menuIconContainer}>
                <FontAwesome5 name="calendar-alt" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.menuOptionTitle}>Agendar Consulta</Text>
              <Text style={styles.menuOptionSubtitle}>Marque online</Text>
            </TouchableOpacity>
          </View>

          {/* Recursos Adicionais */}
          <View style={styles.additionalResources}>
            <TouchableOpacity style={styles.resourceCard}>
              <View style={styles.resourceIconContainer}>
                <FontAwesome5 name="file-medical-alt" size={20} color="white" />
              </View>
              <Text style={styles.resourceTitle}>Meu Plano Alimentar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard}>
              <View style={styles.resourceIconContainer}>
                <FontAwesome5 name="chart-line" size={20} color="white" />
              </View>
              <Text style={styles.resourceTitle}>Meu Progresso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resourceCard}>
              <View style={styles.resourceIconContainer}>
                <FontAwesome5 name="book" size={20} color="white" />
              </View>
              <Text style={styles.resourceTitle}>Material Educativo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
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
  // Tela Premium
  premiumContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  premiumHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  crownIcon: {
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  benefitsCard: {
    width: '100%',
    marginBottom: 30,
    elevation: 3,
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 30,
    width: '80%',
  },
  upgradeButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pricingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  
  // Tela da nutricionista (conforme imagem)
  teleNutricaoContainer: {
    padding: 16,
  },
  teleNutricaoTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  nutricionistaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    marginRight: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
    padding: 5,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  nutricionistaInfo: {
    flex: 1,
  },
  nutricionistaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  nutricionistaNome: {
    fontSize: 18,
    color: '#4CAF50',
    marginRight: 8,
  },
  nutricionistaStatus: {
    fontSize: 18,
    color: '#4CAF50',
  },
  consultaCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  consultaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  consultaData: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  entrarConsultaButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
  },
  entrarConsultaLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Menu de opções
  menuOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuOption: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  menuOptionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Histórico de consultas
  historicoCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#f1f8e9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historicoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  verTodasButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verTodasText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginRight: 2,
  },
  historicoItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historicoData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historicoDataText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  historicoTipo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  divider: {
    marginBottom: 8,
  },
  historicoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  historicoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  
  // Recursos adicionais
  additionalResources: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  resourceCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  
  // Estilos para o botão flutuante (para futura implementação)
  chatButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  // Estilos antigos que não serão mais utilizados
  fabContainer: {
    display: 'none',
  },
  iosFabContainer: {
    display: 'none',
  },
  fab: {
    display: 'none',
  },
}); 