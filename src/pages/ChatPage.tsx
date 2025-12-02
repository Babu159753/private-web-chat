import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const { user, otherUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState(() => {
    return localStorage.getItem("targetLanguage") || "English";
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    loadMessages();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("messages").insert({
        sender: user.username,
        content,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (lang: string) => {
    setTargetLanguage(lang);
    localStorage.setItem("targetLanguage", lang);
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader
        targetLanguage={targetLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse-soft text-muted-foreground">
            Loading messages...
          </div>
        </div>
      ) : (
        <MessageList
          messages={messages}
          currentUser={user.username}
          targetLanguage={targetLanguage}
        />
      )}
      
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
