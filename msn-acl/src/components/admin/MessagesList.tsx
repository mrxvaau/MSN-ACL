"use client";

import { useState } from "react";
import { ContactMessage } from "@prisma/client";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen, Calendar, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function MessagesList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      const updated = await res.json();
      setMessages(prev => prev.map(m => m.id === id ? updated : m));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleExpand = (message: ContactMessage) => {
    if (expandedId === message.id) {
      setExpandedId(null);
    } else {
      setExpandedId(message.id);
      if (!message.isRead) {
        toggleReadStatus(message.id, false);
      }
    }
  };

  if (messages.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No messages found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={cn(
            "border rounded-lg overflow-hidden transition-colors",
            message.isRead ? "bg-white dark:bg-zinc-950" : "bg-primary/5 border-primary/20"
          )}
        >
          {/* Header row */}
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900/50"
            onClick={() => handleExpand(message)}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="shrink-0 text-muted-foreground">
                {message.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5 text-primary" />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                <div className="font-medium truncate col-span-1 md:col-span-1">
                  {message.name}
                </div>
                <div className="text-sm text-muted-foreground truncate col-span-1 md:col-span-1">
                  {message.subject || "No Subject"}
                </div>
                <div className="text-sm text-muted-foreground truncate col-span-1 md:col-span-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-2" />
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleReadStatus(message.id, message.isRead)}
                title={message.isRead ? "Mark as unread" : "Mark as read"}
              >
                {message.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteMessage(message.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedId === message.id && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t bg-gray-50/50 dark:bg-zinc-900/20"
              >
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <User className="w-4 h-4 mr-2" /> Sender Details
                      </div>
                      <p className="font-medium">{message.name}</p>
                      <a href={`mailto:${message.email}`} className="text-primary hover:underline">{message.email}</a>
                    </div>
                    {message.phone && (
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="w-4 h-4 mr-2" /> Phone Number
                        </div>
                        <a href={`tel:${message.phone}`} className="hover:underline">{message.phone}</a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Message</div>
                    <div className="p-4 bg-white dark:bg-zinc-950 rounded-md border text-sm whitespace-pre-wrap">
                      {message.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
