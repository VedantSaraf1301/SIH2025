import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, BarChart3, Map, FileText } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "system";
  content: string;
  timestamp: Date;
  attachments?: {
    type: "chart" | "map" | "table";
    title: string;
    description: string;
  }[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: "Hello! I'm your AI assistant for exploring ARGO ocean data. I can help you find information about ocean temperature, salinity, float locations, and much more. What would you like to know?",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "user",
      content: "Show me temperature profiles for the North Atlantic in the last 30 days",
      timestamp: new Date(),
    },
    {
      id: "3",
      type: "system",
      content: "I found 47 active ARGO floats in the North Atlantic region over the past 30 days. Here's a summary of the temperature profiles and their locations:",
      timestamp: new Date(),
      attachments: [
        {
          type: "chart",
          title: "Temperature vs Depth Profile",
          description: "Average temperature profile for North Atlantic region",
        },
        {
          type: "map",
          title: "Float Locations",
          description: "47 active floats in the specified region",
        },
      ],
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "I'm analyzing the ARGO data for your query. Here are the results I found:",
          attachments: [
            {
              type: "chart" as const,
              title: "Data Visualization",
              description: "Interactive chart showing your requested data",
            },
          ],
        },
        {
          content: "Based on the ARGO float network data, here's what I discovered about your query:",
          attachments: [
            {
              type: "table" as const,
              title: "Data Summary",
              description: "Tabular view of the relevant measurements",
            },
          ],
        },
        {
          content: "I found several interesting patterns in the ocean data. Let me break this down for you with some visualizations:",
        },
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: randomResponse.content,
        timestamp: new Date(),
        attachments: randomResponse.attachments,
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderAttachment = (attachment: Message["attachments"][0]) => {
    const icons = {
      chart: BarChart3,
      map: Map,
      table: FileText,
    };
    
    const Icon = icons[attachment.type];
    
    return (
      <Card key={attachment.title} className="mt-3 bg-muted/50 border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">{attachment.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{attachment.description}</p>
              <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                View {attachment.type === "chart" ? "Chart" : attachment.type === "map" ? "Map" : "Table"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Chat Assistant
        </h1>
        <p className="text-sm text-muted-foreground">
          Ask questions about ARGO ocean data in natural language
        </p>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-6">
        <div className="py-6 space-y-6 max-w-4xl">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[80%] ${message.type === "user" ? "text-right" : "text-left"}`}>
                <div className={`rounded-lg px-4 py-3 ${
                  message.type === "user"
                    ? "message-user"
                    : "message-system"
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                {/* Attachments */}
                {message.attachments && (
                  <div className="space-y-2">
                    {message.attachments.map(renderAttachment)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 px-6 py-4">
        <div className="flex gap-3 max-w-4xl">
          <Input
            placeholder="Ask about ocean temperature, salinity, float locations, or any ARGO data..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputValue.trim()}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3 max-w-4xl">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputValue("Show me global temperature anomalies")}
            className="text-xs"
          >
            Global Temperature Anomalies
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputValue("Find floats near the Gulf Stream")}
            className="text-xs"
          >
            Gulf Stream Floats
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputValue("Compare salinity in Pacific vs Atlantic")}
            className="text-xs"
          >
            Pacific vs Atlantic Salinity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;