// apps.config.ts
export interface AppConfig {
    name: string;
    icon: string;
    path: string;
  }
  
  export const apps: AppConfig[] = [
    { name: "Dropbox", icon: "📁", path: "dropbox" },
    { name: "Chat", icon: "💬", path: "chat" },
    { name: "PasteBin", icon:  "📋", path: "pastebin" },
    { name: "ShortURL", icon: "🔗", path: "shorturl" }
  ];