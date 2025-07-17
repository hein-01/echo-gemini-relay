import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: number;
  content: string;
  is_ai: boolean;
  created_at: string;
  user_id: string;
  conversation_id: string | null;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert({
          content,
          is_ai: false,
          user_id: user.id,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Update local state with user message
      setMessages(prev => [...prev, userMessage]);

      // Call Gemini API
      const { data: geminiResponse, error: geminiError } = await supabase.functions.invoke('gemini-chat', {
        body: { message: content }
      });

      if (geminiError) throw geminiError;

      // Save AI response
      const { data: aiMessage, error: aiError } = await supabase
        .from('messages')
        .insert({
          content: geminiResponse.reply,
          is_ai: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (aiError) throw aiError;

      // Update local state with AI message
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};