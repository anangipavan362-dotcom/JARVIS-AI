import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  RotateCw,
  Download,
  Bot,
  User,
  Mic,
  MicOff,
  Sparkles,
  StopCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ApiClient } from '../services/api';
import { Conversation, Message, ConversationSummary } from '../types';
import { ArcReactor } from '../components/hud/ArcReactor';
import { WaveformVisualizer } from '../components/hud/WaveformVisualizer';
import { sound } from '../utils/sound';

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const [currentConvo, setCurrentConvo] = useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<number | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load conversation list
  const loadConversations = async () => {
    try {
      const list = await ApiClient.getConversations();
      setConversations(list);
      if (list.length > 0 && activeConvoId === null) {
        setActiveConvoId(list[0].id);
      }
    } catch {}
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load active conversation details
  useEffect(() => {
    if (activeConvoId) {
      const fetchDetail = async () => {
        try {
          const detail = await ApiClient.getConversation(activeConvoId);
          setCurrentConvo(detail);
        } catch {}
      };
      fetchDetail();
    } else {
      setCurrentConvo(null);
    }
  }, [activeConvoId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConvo?.messages, isGenerating]);

  // Handle Speech Recognition for voice input in chat
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onstart = () => {
        setIsListening(true);
        sound.playProcessing();
      };

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
      recog.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsGenerating(true);
    sound.playClick();

    // Optimistically append user message
    const tempUserMsg: Message = {
      id: Date.now(),
      conversation_id: activeConvoId || 0,
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    if (currentConvo) {
      setCurrentConvo({
        ...currentConvo,
        messages: [...currentConvo.messages, tempUserMsg],
      });
    }

    try {
      sound.playProcessing();
      const res = await ApiClient.sendChatMessage(userText, activeConvoId || undefined);

      if (!activeConvoId) {
        setActiveConvoId(res.conversation_id);
        await loadConversations();
      }

      // Reload updated messages
      const updated = await ApiClient.getConversation(res.conversation_id);
      setCurrentConvo(updated);
      await loadConversations();
    } catch (err: any) {
      sound.playAlert();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewConversation = async () => {
    sound.playClick();
    try {
      const newC = await ApiClient.createConversation('New Mission');
      await loadConversations();
      setActiveConvoId(newC.id);
    } catch {}
  };

  const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    try {
      await ApiClient.deleteConversation(id);
      if (activeConvoId === id) {
        setActiveConvoId(null);
      }
      await loadConversations();
    } catch {}
  };

  const handleSaveTitle = async (id: number) => {
    if (!editTitleText.trim()) {
      setEditingTitleId(null);
      return;
    }
    try {
      await ApiClient.updateConversation(id, editTitleText.trim());
      setEditingTitleId(null);
      await loadConversations();
      if (currentConvo && currentConvo.id === id) {
        setCurrentConvo({ ...currentConvo, title: editTitleText.trim() });
      }
    } catch {}
  };

  const handleCopy = (id: number, text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingText === text) {
      window.speechSynthesis.cancel();
      setSpeakingText(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleExport = (format: 'txt' | 'json' | 'md') => {
    if (!currentConvo) return;
    sound.playClick();
    let content = '';
    let mimeType = 'text/plain';
    let ext = format;

    if (format === 'json') {
      content = JSON.stringify(currentConvo, null, 2);
      mimeType = 'application/json';
    } else if (format === 'md') {
      content = `# ${currentConvo.title}\nDate: ${currentConvo.created_at}\n\n` +
        currentConvo.messages.map((m) => `### ${m.role === 'user' ? 'USER' : 'J.A.R.V.I.S.'} (${new Date(m.created_at).toLocaleTimeString()}):\n${m.content}\n`).join('\n---\n\n');
    } else {
      content = `CONVERSATION: ${currentConvo.title}\nDate: ${currentConvo.created_at}\n\n` +
        currentConvo.messages.map((m) => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JARVIS_Mission_${currentConvo.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4 select-none max-w-7xl mx-auto">
      {/* Left Drawer: Conversation History */}
      <div className="hidden md:flex flex-col w-72 cyber-panel rounded-lg tech-corner-tl tech-corner-br p-3 overflow-hidden">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-cyan-950/60 border border-cyan-400 text-xs font-hud font-bold text-cyan-300 hover:text-white hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all mb-3"
        >
          <Plus className="w-4 h-4" />
          <span>NEW CONSULTATION</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {conversations.length === 0 ? (
            <p className="text-xs font-mono text-gray-500 py-6 text-center">
              No mission history.
            </p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  setActiveConvoId(c.id);
                }}
                className={`group flex items-center justify-between p-2.5 rounded border cursor-pointer text-xs font-mono transition-all ${
                  activeConvoId === c.id
                    ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                    : 'bg-black/40 border-cyan-500/20 text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-950/20'
                }`}
              >
                <div className="flex-1 min-w-0 mr-2">
                  {editingTitleId === c.id ? (
                    <input
                      type="text"
                      value={editTitleText}
                      autoFocus
                      onChange={(e) => setEditTitleText(e.target.value)}
                      onBlur={() => handleSaveTitle(c.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(c.id)}
                      className="w-full bg-black border border-cyan-400 px-1 py-0.5 text-xs text-cyan-200 focus:outline-none"
                    />
                  ) : (
                    <p className="truncate font-bold text-cyan-200">{c.title}</p>
                  )}
                  <span className="text-[9px] text-cyan-500/60 block">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitleId(c.id);
                      setEditTitleText(c.title);
                    }}
                    className="p-1 hover:text-cyan-300 text-gray-400"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className="p-1 hover:text-red-400 text-gray-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Area: Active Chat Interface */}
      <div className="flex-1 flex flex-col cyber-panel rounded-lg tech-corner-tl tech-corner-br overflow-hidden">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-cyan-400/50 bg-cyan-950/60 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-sm font-hud font-bold text-cyan-200 uppercase tracking-wider">
                {currentConvo?.title || 'JARVIS AI CORE'}
              </h2>
              <p className="text-[10px] font-mono text-cyan-400/60">
                ACTIVE CONVERSATION THREAD • FULL CONTEXT RETENTION
              </p>
            </div>
          </div>

          {/* Export Actions */}
          {currentConvo && currentConvo.messages.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-gray-400 mr-1">EXPORT:</span>
              <button
                onClick={() => handleExport('md')}
                className="px-2 py-0.5 rounded border border-cyan-500/30 text-[10px] font-mono hover:bg-cyan-950 text-cyan-300"
              >
                MD
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-2 py-0.5 rounded border border-cyan-500/30 text-[10px] font-mono hover:bg-cyan-950 text-cyan-300"
              >
                JSON
              </button>
              <button
                onClick={() => handleExport('txt')}
                className="px-2 py-0.5 rounded border border-cyan-500/30 text-[10px] font-mono hover:bg-cyan-950 text-cyan-300"
              >
                TXT
              </button>
            </div>
          )}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentConvo || currentConvo.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <ArcReactor state="IDLE" size={180} subtext="NEURAL CORE IDLE" />
              <div>
                <h3 className="text-base font-hud font-bold text-cyan-300 uppercase tracking-widest">
                  JARVIS AI CORE ACTIVE
                </h3>
                <p className="text-xs font-mono text-gray-400 max-w-md mt-1">
                  Ready for instructions. Ask for complex calculations, software engineering, mission summaries, or situation briefings.
                </p>
              </div>
            </div>
          ) : (
            currentConvo.messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-full border border-cyan-400/60 bg-cyan-950 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-cyan-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-lg p-3.5 text-xs font-mono leading-relaxed relative group ${
                      isAssistant
                        ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 tech-corner-tl'
                        : 'bg-blue-950/60 border border-blue-500/40 text-blue-100 ml-auto tech-corner-br'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-cyan-500/15">
                      <span className="text-[10px] font-hud font-bold uppercase tracking-wider text-cyan-300">
                        {isAssistant ? 'J.A.R.V.I.S.' : 'OPERATIVE'}
                      </span>
                      <span className="text-[9px] text-cyan-500/60">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {isAssistant && (
                      <div className="mt-2 pt-1 flex items-center justify-end gap-3 border-t border-cyan-500/10 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSpeak(m.content)}
                          className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 transition-colors"
                          title="Vocal Playback"
                        >
                          {speakingText === m.content ? (
                            <>
                              <VolumeX className="w-3 h-3 text-amber-400 animate-pulse" />
                              <span className="text-amber-400">STOP</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>SPEAK</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-full border border-blue-400/60 bg-blue-950 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-blue-300" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isGenerating && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-cyan-400/60 bg-cyan-950 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-300 animate-spin-slow" />
              </div>
              <div className="cyber-panel p-3 rounded-lg flex items-center gap-3">
                <WaveformVisualizer active={true} barCount={12} />
                <span className="text-xs font-mono text-cyan-300 animate-pulse">
                  J.A.R.V.I.S. COMPUTING RESPONSE...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-cyan-500/20 bg-black/60">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded border transition-all ${
                isListening
                  ? 'border-green-400 bg-green-950/60 text-green-300 animate-pulse shadow-[0_0_15px_#00FF66]'
                  : 'border-cyan-500/30 bg-black/40 text-cyan-400 hover:border-cyan-400'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input'}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening to voice command...' : 'Inquire with J.A.R.V.I.S. AI Core...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/70 border border-cyan-500/30 rounded text-xs font-mono text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            />

            <button
              type="submit"
              disabled={isGenerating || !inputMessage.trim()}
              className="px-4 py-2 rounded bg-cyan-950/80 border border-cyan-400 text-xs font-hud font-bold text-cyan-300 hover:text-white hover:bg-cyan-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SEND</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
