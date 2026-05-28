import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { ChatMessage, ChatMessageRequest, ChatMessageResponse, ChatSession } from '../types/chatbot.type';

export const chatbotApi = {
  async message(payload: ChatMessageRequest) {
    return responseData<ChatMessageResponse>(await apiClient.post<ApiResponse<ChatMessageResponse>>('/chatbot/message', payload));
  },
  async sessions() {
    return responseData<ChatSession[]>(await apiClient.get<ApiResponse<ChatSession[]>>('/chatbot/sessions'));
  },
  async sessionHistory(id: string) {
    return responseData<ChatMessage[]>(await apiClient.get<ApiResponse<ChatMessage[]>>(`/chatbot/sessions/${id}`));
  },
  async uploadDoc(file: File) {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post<boolean>('/chatbot/add/document', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  async policyOnly(message: string) {
    const response = await apiClient.post<string>('/chatbot/api/chatbot/policy-only', message, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  async rawModel(message: string) {
    const response = await apiClient.post<string>('/chatbot/chat/vs/mode', message, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
};
