import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { chatbotApi } from '../api/chatbot.api';
import type { ChatMessageRequest } from '../types/chatbot.type';
import { getErrorMessage } from '../utils/errors';

export function useChatbot(sessionId?: string | null) {
  return {
    sessions: useQuery({ queryKey: ['chatbot', 'sessions'], queryFn: chatbotApi.sessions }),
    history: useQuery({
      queryKey: ['chatbot', 'history', sessionId],
      queryFn: () => chatbotApi.sessionHistory(sessionId as string),
      enabled: Boolean(sessionId),
    }),
  };
}

export function useChatbotActions() {
  const queryClient = useQueryClient();
  return {
    sendMessage: useMutation({
      mutationFn: (payload: ChatMessageRequest) => chatbotApi.message(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chatbot'] });
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    uploadDoc: useMutation({
      mutationFn: (file: File) => chatbotApi.uploadDoc(file),
      onSuccess: () => toast.success('Policy document imported'),
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
