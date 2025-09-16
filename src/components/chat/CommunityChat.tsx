import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Users, MessageCircle, Clock } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
  community?: string;
}

interface CommunityChannel {
  id: string;
  name: string;
  description: string;
  members: number;
}

export const CommunityChat = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: CommunityChannel[] = [
    {
      id: "general",
      name: "General Discussion",
      description: "Open discussions about blue carbon projects",
      members: 42
    },
    {
      id: "mangrove",
      name: "Mangrove Projects",
      description: "Share experiences with mangrove restoration",
      members: 28
    },
    {
      id: "verification",
      name: "Verification Support",
      description: "Get help with report verification",
      members: 15
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
    
    // Set up real-time subscription for messages
    const channel = supabase
      .channel('community-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `channel=eq.${selectedChannel}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChannel]);

  const loadMessages = async () => {
    try {
      // Since we don't have a messages table yet, we'll simulate with local data
      const mockMessages: Message[] = [
        {
          id: "1",
          user_id: "user1",
          user_name: "Priya Sharma",
          message: "Just submitted our Q1 mangrove restoration report! 2.5 hectares planted in Sundarbans.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          community: selectedChannel
        },
        {
          id: "2", 
          user_id: "user2",
          user_name: "Amit Kumar",
          message: "Great work Priya! We're working on seagrass restoration in Mandarmani. Any tips on documentation?",
          created_at: new Date(Date.now() - 1800000).toISOString(),
          community: selectedChannel
        },
        {
          id: "3",
          user_id: "user3", 
          user_name: "Dr. Maya Sen",
          message: "For documentation, make sure to include GPS coordinates, progress photos, and species count. The verification team loves detailed reports!",
          created_at: new Date(Date.now() - 900000).toISOString(),
          community: selectedChannel
        }
      ];

      if (selectedChannel === "mangrove") {
        mockMessages.push({
          id: "4",
          user_id: "user4",
          user_name: "Rajesh Patel",
          message: "We're seeing 80% survival rate in our mangrove saplings after 6 months. Best practices: plant during monsoon and use local species.",
          created_at: new Date(Date.now() - 300000).toISOString(),
          community: selectedChannel
        });
      }

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    try {
      const messageData: Message = {
        id: Date.now().toString(),
        user_id: user.id,
        user_name: user.fullName || user.firstName || "Anonymous",
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        community: selectedChannel
      };

      // Add message locally (in real implementation, this would go to database)
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");

      toast({
        title: "Message Sent",
        description: "Your message has been shared with the community",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Channels Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={selectedChannel === channel.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedChannel(channel.id)}
            >
              <div className="text-left">
                <div className="font-medium">#{channel.name}</div>
                <div className="text-xs text-muted-foreground">
                  {channel.members} members
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              #{channels.find(c => c.id === selectedChannel)?.name}
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {channels.find(c => c.id === selectedChannel)?.members} members
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {channels.find(c => c.id === selectedChannel)?.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(message.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.user_name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};