import React from "react";
import { LogOut, Moon, Sun, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  targetLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Japanese", label: "日本語 (Japanese)" },
  { code: "French", label: "Français (French)" },
  { code: "Spanish", label: "Español (Spanish)" },
  { code: "German", label: "Deutsch (German)" },
  { code: "Korean", label: "한국어 (Korean)" },
  { code: "Chinese", label: "中文 (Chinese)" },
  { code: "Portuguese", label: "Português (Portuguese)" },
  { code: "Italian", label: "Italiano (Italian)" },
  { code: "Russian", label: "Русский (Russian)" },
];

export function ChatHeader({ targetLanguage, onLanguageChange }: ChatHeaderProps) {
  const { user, logout, otherUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {otherUser?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-card" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">{otherUser}</h1>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-secondary hover:bg-muted rounded-lg transition-colors">
              <span>🌐</span>
              <span className="text-muted-foreground">Translate to:</span>
              <span className="font-medium">{targetLanguage}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={targetLanguage === lang.code ? "bg-accent" : ""}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2 text-sm">
              <p className="font-medium">{user?.username}</p>
              <p className="text-muted-foreground text-xs">Logged in</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
