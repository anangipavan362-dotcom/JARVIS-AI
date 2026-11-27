import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Bot,
  User,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  MessageSquare,
  X,
} from 'lucide-react';
import { ApiClient } from '../services/api';
import { voiceEngine } from '../services/voiceEngine';
import { Conversation, Message, ConversationSummary } from '../types';
import { JarvisAvatar } from '../components/3d/JarvisAvatar';
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
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

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
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      const newC = await ApiClient.createConversation('New Consultation');
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
    if (speakingText === text) {
      voiceEngine.stopSpeaking();
      setSpeakingText(null);
      return;
    }
    setSpeakingText(text);
    voiceEngine.speak(text).then(() => setSpeakingText(null));
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
      content =
        `# ${currentConvo.title}\nDate: ${currentConvo.created_at}\n\n` +
        currentConvo.messages
          .map(
            (m) =>
              `### ${m.role === 'user' ? 'USER' : 'J.A.R.V.I.S.'} (${new Date(
                m.created_at
              ).toLocaleTimeString()}):\n${m.content}\n`
          )
          .join('\n---\n\n');
    } else {
      content =
        `CONVERSATION: ${currentConvo.title}\nDate: ${currentConvo.created_at}\n\n` +
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
      {/* Left Drawer: Conversation History (Monochrome) */}
      <div className="hidden md:flex flex-col w-72 bg-[#080808]/90 border border-white/10 rounded-3xl p-3.5 overflow-hidden backdrop-blur-2xl">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white text-black font-black text-xs font-hud uppercase tracking-wider hover:bg-[#E5E5E5] hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all mb-3 cursor-pointer"
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
                className={`group flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer text-xs font-mono transition-all ${
                  activeConvoId === c.id
                    ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
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
                      className="w-full bg-black border border-white px-2 py-0.5 text-xs text-white focus:outline-none rounded"
                    />
                  ) : (
                    <p className="truncate font-bold text-white">{c.title}</p>
                  )}
                  <span className="text-[9px] text-gray-500 block">
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
                    className="p-1 hover:text-white text-gray-400"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(c.id, e)}
                    className="p-1 hover:text-white text-gray-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Drawer: Conversation History Overlay */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setShowMobileDrawer(false)}
          />
          <div className="relative z-10 w-4/5 max-w-xs h-full bg-[#080808] border-r border-white/10 p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="font-hud text-xs font-bold text-white uppercase tracking-wider">
                MISSION THREADS
              </span>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="p-1.5 rounded-xl text-gray-300 hover:text-white border border-white/15"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                handleNewConversation();
                setShowMobileDrawer(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white text-black font-black text-xs font-hud mb-3 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>NEW CONSULTATION</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
                      setShowMobileDrawer(false);
                    }}
                    className={`group flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs font-mono transition-all min-h-[44px] ${
                      activeConvoId === c.id
                        ? 'bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="truncate font-bold text-white">{c.title}</p>
                      <span className="text-[9px] text-gray-500 block">
                        {new Date(c.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteConversation(c.id, e)}
                      className="p-1.5 hover:text-white text-gray-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Right Area: Active Chat Interface (Strict Monochrome) */}
      <div className="flex-1 flex flex-col bg-[#080808]/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setShowMobileDrawer(true)}
              className="md:hidden p-2 rounded-xl border border-white/15 bg-white/5 text-gray-200 hover:text-white shrink-0"
              title="Open Conversation History"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-hud font-bold text-white uppercase tracking-wider truncate">
                {currentConvo?.title || 'JARVIS // DIGITAL HUMAN INTELLIGENCE'}
              </h2>
              <p className="text-[9px] sm:text-[10px] font-mono text-gray-400 truncate">
                ACTIVE CONVERSATION THREAD • FULL MEMORY RETENTION
              </p>
            </div>
          </div>

          {/* Export Actions & Mobile New Chat */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleNewConversation}
              className="md:hidden p-2 rounded-xl bg-white text-black font-bold"
              title="New Consultation"
            >
              <Plus className="w-4 h-4" />
            </button>

            {currentConvo && currentConvo.messages.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-gray-400 mr-1">EXPORT:</span>
                <button
                  onClick={() => handleExport('md')}
                  className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono hover:bg-white/10 text-gray-200 hover:text-white"
                >
                  MD
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono hover:bg-white/10 text-gray-200 hover:text-white"
                >
                  JSON
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono hover:bg-white/10 text-gray-200 hover:text-white"
                >
                  TXT
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!currentConvo || currentConvo.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden bg-[#050505] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                <JarvisAvatar state="IDLE" interactive={true} className="w-full h-full" />
              </div>
              <div>
                <h3 className="text-base font-hud font-black text-white uppercase tracking-widest">
                  JARVIS DIGITAL INTELLIGENCE READY
                </h3>
                <p className="text-xs font-mono text-gray-400 max-w-md mt-1">
                  Ready for instructions. Ask for complex reasoning, mission execution, system analytics, or voice directives.
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
                    <div className="w-8 h-8 rounded-full border border-white/30 bg-[#111111] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs font-mono leading-relaxed relative group shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${
                      isAssistant
                        ? 'bg-[#111111] border border-white/15 text-gray-200'
                        : 'bg-white text-black border border-white ml-auto font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10">
                      <span
                        className={`text-[10px] font-hud font-bold uppercase tracking-wider ${
                          isAssistant ? 'text-white' : 'text-black'
                        }`}
                      >
                        {isAssistant ? 'J.A.R.V.I.S.' : 'OPERATIVE'}
                      </span>
                      <span
                        className={`text-[9px] ${isAssistant ? 'text-gray-400' : 'text-black/60'}`}
                      >
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {isAssistant && (
                      <div className="mt-2.5 pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                        <button
                          onClick={() => handleSpeak(m.content)}
                          className="text-[10px] px-3 py-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Vocal Playback (Tap to hear JARVIS)"
                        >
                          {speakingText === m.content ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                              <span>STOP</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>HEAR</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="text-[10px] px-3 py-1 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-full border border-white/30 bg-white flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-black" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isGenerating && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/40 bg-white/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-[#111111] border border-white/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span className="text-xs font-mono text-white animate-pulse">
                  J.A.R.V.I.S. COMPUTING RESPONSE...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2.5 sm:p-2 min-w-[46px] min-h-[46px] sm:min-w-0 sm:min-h-0 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'border-white bg-white text-black animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:text-white hover:border-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input'}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-gray-400" />}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? 'Listening to voice directive...'
                  : 'Transmit instruction to J.A.R.V.I.S. Digital Intelligence...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 sm:py-2.5 min-h-[46px] sm:min-h-0 bg-[#0F0F0F] border border-white/15 rounded-2xl text-base sm:text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            />

            <button
              type="submit"
              disabled={isGenerating || !inputMessage.trim()}
              className="px-5 py-2.5 sm:py-2.5 min-h-[46px] sm:min-h-0 rounded-2xl bg-white text-black font-black text-xs font-hud uppercase hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.25)] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">TRANSMIT</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
