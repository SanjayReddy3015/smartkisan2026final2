import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAiChat } from "@/hooks/use-ai";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type Message = { role: "user" | "bot"; text: string };

const LANGUAGES = [
  { code: "en", label: "English", speechCode: "en-IN" },
  { code: "hi", label: "हिंदी", speechCode: "hi-IN" },
  { code: "te", label: "తెలుగు", speechCode: "te-IN" },
  { code: "ta", label: "தமிழ்", speechCode: "ta-IN" },
  { code: "kn", label: "ಕನ್ನಡ", speechCode: "kn-IN" },
  { code: "mr", label: "मराठी", speechCode: "mr-IN" },
  { code: "gu", label: "ગુજરાતી", speechCode: "gu-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ", speechCode: "pa-IN" },
  { code: "bn", label: "বাংলা", speechCode: "bn-IN" },
  { code: "ml", label: "മലയാളം", speechCode: "ml-IN" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Namaste! I am SmartKisan AI, powered by Gemini. Ask me anything about farming, crops, fertilizers, weather, or market prices in your language!" }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const chatMutation = useAiChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLang.speechCode;
    utter.rate = 0.9;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [voiceEnabled, currentLang.speechCode]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang.speechCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    try {
      const response = await chatMutation.mutateAsync({ message: userMessage, language });
      setMessages(prev => [...prev, { role: "bot", text: response.reply }]);
      if (voiceEnabled) speak(response.reply);
    } catch {
      const errMsg = "Sorry, I am having trouble connecting right now. Please try again.";
      setMessages(prev => [...prev, { role: "bot", text: errMsg }]);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 z-50 p-0"
        size="icon"
        data-testid="button-open-chatbot"
      >
        <MessageCircle className="w-7 h-7" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[380px] z-50 shadow-2xl shadow-black/20"
          >
            <Card className="border-border/50 overflow-hidden flex flex-col h-[540px]">
              <CardHeader className="bg-primary text-primary-foreground p-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <CardTitle className="text-sm text-white">SmartKisan AI</CardTitle>
                    <p className="text-xs text-white/70">Powered by Gemini</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-7 w-[88px] bg-white/20 border-0 text-xs focus:ring-0 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(l => (
                        <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={() => { setVoiceEnabled(v => !v); stopSpeaking(); }}
                    title={voiceEnabled ? "Disable voice" : "Enable voice"}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {isSpeaking && (
                <div className="px-3 py-1.5 bg-primary/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    <span>Speaking in {currentLang.label}...</span>
                  </div>
                  <button onClick={stopSpeaking} className="text-muted-foreground hover:text-foreground">Stop</button>
                </div>
              )}

              <CardContent className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "bot" && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-sm max-w-[80%] shadow-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-white dark:bg-slate-800 border border-border/50 text-foreground rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 rounded-bl-sm flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Thinking with Gemini...
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-3 border-t bg-white dark:bg-slate-950 flex-col gap-2">
                <div className="flex w-full gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder={isListening ? "Listening..." : `Ask in ${currentLang.label}...`}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend(e as any)}
                      className={`rounded-full bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-white transition-all pr-10 ${isListening ? "border-red-400 bg-red-50" : ""}`}
                      data-testid="input-chat-message"
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className="rounded-full flex-shrink-0"
                    onClick={isListening ? stopListening : startListening}
                    title={isListening ? "Stop listening" : "Voice input"}
                    data-testid="button-voice-input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full flex-shrink-0"
                    disabled={!input.trim() || chatMutation.isPending}
                    onClick={handleSend}
                    data-testid="button-send-chat"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {isListening ? "Speak now..." : "Type or tap mic to speak"}
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
