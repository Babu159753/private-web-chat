import React, { useState } from "react";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMOJI_CATEGORIES = {
  "Smileys": ["😊", "😂", "🥰", "😍", "🤗", "😎", "🥺", "😢", "😤", "😴", "🤔", "🙄"],
  "Gestures": ["👋", "👍", "👎", "✌️", "🤞", "👏", "🙏", "💪", "🤝", "👀", "❤️", "💕"],
  "Animals": ["🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🦄", "🐝", "🦋"],
  "Food": ["🍕", "🍔", "🍟", "🍣", "🍜", "🍩", "🍪", "🍰", "🧁", "☕", "🍵", "🧃"],
  "Activities": ["⚽", "🏀", "🎮", "🎬", "🎵", "🎨", "📚", "✈️", "🏖️", "🎉", "🎁", "✨"],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-2"
        align="start"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 px-1">
                {category}
              </p>
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelect(emoji)}
                    className="w-9 h-9 flex items-center justify-center text-lg hover:bg-muted rounded-md transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
