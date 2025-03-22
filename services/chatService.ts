import { Message } from '../types/chat';

// Interface para a resposta da API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Simulação de delay da API
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ChatService {
  // Função para obter a mensagem de boas-vindas
  static async getWelcomeMessage(): Promise<ApiResponse<Message>> {
    // Simula o delay de uma chamada real à API
    await apiDelay(800);

    // Simula a resposta da API
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        text: `Olá, Maria! Como posso te ajudar hoje?\nVocê pode me perguntar sobre seu plano alimentar, substituições de alimentos ou tirar dúvidas nutricionais.`,
        isUser: false,
        timestamp: new Date(),
      }
    };
  }

  // Função para simular erro na API (útil para testes)
  static async getWelcomeMessageWithError(): Promise<ApiResponse<Message>> {
    await apiDelay(800);
    return {
      success: false,
      error: "Erro ao obter mensagem de boas-vindas",
      data: null
    };
  }
} 