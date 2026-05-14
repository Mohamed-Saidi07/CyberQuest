"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  "What is phishing?",
  "How do I create a strong password?",
  "What is a VPN and why should I use one?",
  "How do I spot a scam email?",
  "What is two-factor authentication?",
  "What should I do if my account is hacked?",
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Welcome to CyberBot. I am your cybersecurity learning assistant. Ask me anything about staying safe online, or try one of the suggested topics below.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(text?: string) {
    const msg = text || input.trim()
    if (!msg) return

    console.log("\n=== DÉBUT ENVOI MESSAGE ===")
    console.log("Message utilisateur:", msg)

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: msg,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    try {
      const payloadMessages = updatedMessages
        .filter((message) => message.id !== "welcome")
        .map((message) => ({
          role: message.role === "bot" ? "assistant" : "user",
          content: message.content,
        }))

      console.log("Payload envoyé à /api/chat:", JSON.stringify(payloadMessages, null, 2))
      console.log("URL de l'API:", "/api/chat")

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      })

      console.log(`Statut réponse: ${response.status} ${response.statusText}`)
      
      const data = await response.json()
      console.log("Données reçues:", data)

      if (!response.ok) {
        console.log(`❌ Erreur HTTP ${response.status}:`, data.error)
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      console.log("✅ Réponse du bot:", data.reply?.substring(0, 100) + "...")

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: data.reply || "I could not generate a response.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      
    } catch (error) {
      console.error("❌ Erreur dans handleSend:", error)
      
      let errorMessage = "Unable to contact the chatbot service right now."
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: errorMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
      console.log("=== FIN ENVOI MESSAGE ===\n")
    }
  }

  function handleClear() {
    setMessages([{
      id: "welcome",
      role: "bot",
      content: "Welcome to CyberBot. I am your cybersecurity learning assistant. Ask me anything about staying safe online, or try one of the suggested topics below.",
      timestamp: new Date(),
    }])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">CyberBot</h1>
                <p className="text-xs text-cyber-green flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClear} className="border-border text-muted-foreground hover:text-foreground">
              <RefreshCw className="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>

          {/* Messages */}
          <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-border bg-card/50 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    msg.role === "bot"
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "bg-secondary border border-border text-foreground"
                  )}>
                    {msg.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-xl px-4 py-3",
                    msg.role === "bot"
                      ? "bg-secondary text-foreground"
                      : "bg-primary/10 text-foreground"
                  )}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="mt-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask CyberBot a question..."
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              size="icon"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}