import React, { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  targetLanguage: string;
}

export function MessageBubble({ message, isOwnMessage, targetLanguage }: MessageBubbleProps) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (translation) {
      setShowTranslation(!showTranslation);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("translate", {
        body: { text: message.content, targetLanguage },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setTranslation(data.translatedText);
      setShowTranslation(true);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[80%] animate-slide-up",
        isOwnMessage ? "self-end items-end" : "self-start items-start"
      )}
    >
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl shadow-sm",
          isOwnMessage
            ? "bg-chat-self text-chat-text-self rounded-br-md"
            : "bg-chat-other text-chat-text-other rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>

      {showTranslation && translation && (
        <div className="px-4 py-2 rounded-xl bg-translation-bg border border-translation-border mt-1 max-w-full">
          <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
            {translation}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] text-muted-foreground">
          {formatTime(message.created_at)}
        </span>

        {!isOwnMessage && (
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className={cn(
              "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors",
              showTranslation && "text-primary"
            )}
          >
            {isTranslating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Languages className="w-3 h-3" />
            )}
            <span>{showTranslation ? "Hide" : "Translate"}</span>
          </button>
        )}

        {error && (
          <span className="text-[10px] text-destructive">{error}</span>
        )}
      </div>
    </div>
  );
}
