import { Message } from '../types/chat';

interface ChatGPTResponse {
  response: string;
  sources?: string[];
}

/**
 * Serviço para gerenciar a comunicação com a API do ChatGPT
 */
export class ChatService {
  private static apiUrl = 'https://api.seuservidor.com/chat'; // URL real do seu backend
  private static apiKey = 'sua_chave_api'; // Substitua pela sua chave real
  private static userId = 'id_do_usuario'; // ID único do usuário
  private static sessionId = 'sessao_chat'; // ID da sessão atual
  
  /**
   * Envia uma mensagem para a API do ChatGPT e retorna a resposta
   * 
   * @param message Texto da mensagem do usuário
   * @returns Resposta da API do ChatGPT
   */
  static async sendMessage(message: string): Promise<ChatGPTResponse> {
    try {
      // Em ambiente de produção, descomente o código abaixo para fazer a chamada real à API
      /*
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          message,
          userId: this.userId,
          sessionId: this.sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      return await response.json();
      */
      
      // Em ambiente de desenvolvimento, usamos o mock
      return await this.mockChatGPTAPI(message);
      
    } catch (error) {
      console.error('Erro ao chamar a API do ChatGPT:', error);
      throw error;
    }
  }
  
  /**
   * Versão simulada da API do ChatGPT para desenvolvimento
   * 
   * @param message Texto da mensagem do usuário
   * @returns Resposta simulada
   */
  private static async mockChatGPTAPI(message: string): Promise<ChatGPTResponse> {
    // Simulando um delay de rede (entre 1 e 3 segundos)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    // Aguardar o delay para simular o tempo de resposta da API
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Respostas baseadas em palavras-chave
    const lowerCaseInput = message.toLowerCase();
    
    // Simular diferentes respostas baseadas no conteúdo da mensagem
    if (lowerCaseInput.includes('dieta') || lowerCaseInput.includes('alimentação') || lowerCaseInput.includes('comer')) {
      return { 
        response: "Sua dieta deve incluir uma variedade de alimentos como frutas, vegetais, proteínas magras e grãos integrais. É importante manter um equilíbrio dos grupos alimentares e se atentar às porções recomendadas para suas necessidades nutricionais específicas."
      };
    } 
    else if (lowerCaseInput.includes('exercício') || lowerCaseInput.includes('atividade') || lowerCaseInput.includes('treino')) {
      return { 
        response: "Para complementar sua alimentação saudável, recomendo atividades físicas regulares, como caminhadas de 30 minutos diários, natação ou ciclismo. O ideal é combinar exercícios aeróbicos com treinos de força, adaptados à sua condição física atual."
      };
    }
    else if (lowerCaseInput.includes('água') || lowerCaseInput.includes('hidratação') || lowerCaseInput.includes('beber')) {
      return { 
        response: "A hidratação adequada é essencial para seu bem-estar e saúde. Recomendo beber pelo menos 2 litros de água por dia, ajustando conforme seu nível de atividade física e condições climáticas. Lembre-se que sucos naturais e chás também contribuem para sua hidratação diária."
      };
    }
    else if (lowerCaseInput.includes('substituir') || lowerCaseInput.includes('substituição') || lowerCaseInput.includes('trocar')) {
      return { 
        response: "Para substituir alimentos em seu plano, procure por opções com perfil nutricional semelhante. Por exemplo, você pode trocar arroz branco por quinoa ou arroz integral, frango por peixe, ou leite animal por bebidas vegetais fortificadas."
      };
    }
    else if (lowerCaseInput.includes('fome') || lowerCaseInput.includes('apetite')) {
      return {
        response: "A sensação de fome entre as refeições pode indicar que você precisa ajustar o tamanho das porções ou a composição das suas refeições. Tente aumentar o consumo de proteínas e fibras, que promovem maior saciedade. Pequenos lanches saudáveis entre as refeições principais também podem ajudar a controlar o apetite."
      };
    }
    else if (lowerCaseInput.includes('peso') || lowerCaseInput.includes('emagrecer') || lowerCaseInput.includes('perder')) {
      return {
        response: "Para uma perda de peso saudável, recomendo focar em uma dieta equilibrada com déficit calórico moderado, combinada com atividade física regular. O ideal é uma perda de 0,5 a 1kg por semana. Lembre-se que mudanças sustentáveis de estilo de vida são mais eficazes que dietas restritivas de curto prazo."
      };
    }
    // Resposta padrão caso nenhuma palavra-chave seja encontrada
    else {
      return { 
        response: "Entendi sua mensagem. Como nutricionista virtual, posso ajudar com orientações sobre alimentação saudável, dicas nutricionais específicas e esclarecimentos sobre seu plano alimentar personalizado. Tem alguma dúvida específica sobre nutrição?"
      };
    }
  }
} 