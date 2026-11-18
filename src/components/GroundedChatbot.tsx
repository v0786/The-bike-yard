import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, LoaderCircle, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  links?: { label: string; href: string }[];
}
interface GroundedChatbotProps { isOpen: boolean; onClose: () => void; }
const welcome: Message = {
  id: 'welcome', sender: 'bot',
  text: 'Namaste! I’m your Bike Yard customer assistant. Ask about our listed bikes, colours, prices, offers, test rides or showroom details. Bike prices are negotiable and confirmed by our staff or owner. Ask us for a quote.',
};
const suggestions = ['Hunter 350 price?', 'Compare Hunter 350 and Speed 400', 'Where is your showroom?', 'How do I request a test ride?'];

export const GroundedChatbot: React.FC<GroundedChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'ai' | 'help' | null>(null);
  const [accepted, setAccepted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => { if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy, isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
    return () => triggerRef.current?.focus();
  }, [isOpen]);

  async function handleSend(text = input) {
    const query = text.trim();
    if (!query || query.length > 1000 || pendingRef.current || !accepted) return;
    pendingRef.current = true;
    setBusy(true); setError(''); setInput('');
    const userMessage: Message = { id: crypto.randomUUID(), sender: 'user', text: query };
    const history = messages.filter(m => m.id !== 'welcome').slice(-6).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', text: m.text }));
    setMessages(previous => [...previous.slice(-29), userMessage]);
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/customer-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }), signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Chat is unavailable. Please try again.');
      if (typeof data.text !== 'string' || !['ai', 'help'].includes(data.mode)) throw new Error('Chat is unavailable. Please try again.');
      setMode(data.mode);
      setMessages(previous => [...previous, { id: crypto.randomUUID(), sender: 'bot', text: data.text, links: data.links }]);
    } catch (err) {
      setError(err instanceof Error && err.name !== 'AbortError' ? err.message : 'The reply took too long. Please try again or contact the showroom.');
      setMessages(previous => previous.filter(m => m.id !== userMessage.id));
      setInput(query);
    } finally { clearTimeout(timeout); pendingRef.current = false; setBusy(false); }
  }

  if (!isOpen) return null;
  return (
    <section role="dialog" aria-modal="false" aria-labelledby="chat-title"
      onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
      className="fixed inset-x-2 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 flex h-[640px] max-h-[calc(100dvh-5rem-env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl sm:left-auto sm:right-6 sm:w-[420px] md:bottom-6">
      <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
          <div><h2 id="chat-title" className="text-base font-bold text-white">Ask Bike Yard</h2>
            <p className="text-sm text-slate-400">Customer service · No login needed</p></div>
        </div>
        <div className="flex gap-1">
          <button type="button" aria-label="Clear conversation" disabled={busy} onClick={() => { setMessages([welcome]); setError(''); setMode(null); setInput(''); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-40"><RotateCcw className="h-4 w-4" /></button>
          <button type="button" aria-label="Close chat" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </div>
      </header>
      <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-base">
        {messages.map(m => (
          <div key={m.id} className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className="mt-1 shrink-0 text-slate-400" aria-label={m.sender === 'user' ? 'You' : 'Bike Yard'}>{m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}</span>
            <div className={`max-w-[88%] rounded-2xl p-3 leading-relaxed [overflow-wrap:anywhere] ${m.sender === 'user' ? 'bg-amber-500 font-medium text-slate-950' : 'border border-slate-800 bg-slate-950 text-slate-200'}`}>
              <p className="whitespace-pre-line">{m.text}</p>
              {m.links && <div className="mt-3 flex flex-wrap gap-2">{m.links.map(link => link.href.startsWith('/bike/') || link.href === '/#catalogue-section' || link.href.startsWith('/?q=')
                ? <Link key={link.href} to={link.href} onClick={onClose} className="rounded-lg border border-slate-700 px-2 py-1 text-sm text-amber-400 underline">{link.label}</Link>
                : link.href.startsWith('tel:') ? <a key={link.href} href={link.href} className="rounded-lg border border-slate-700 px-2 py-1 text-sm text-amber-400 underline">{link.label}</a> : null)}</div>}
            </div>
          </div>
        ))}
        {busy && <p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin" />Finding showroom information…</p>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-slate-800 px-3 py-2">
        {suggestions.map(q => <button key={q} type="button" disabled={busy || !accepted} onClick={() => handleSend(q)} className="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-amber-500 disabled:opacity-40">{q}</button>)}
      </div>
      <form onSubmit={e => { e.preventDefault(); void handleSend(); }} className="space-y-2 border-t border-slate-800 bg-slate-950 p-3">
        {!accepted && <label className="flex items-start gap-2 text-sm text-slate-300"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 accent-amber-500" />
          <span>I agree to the <Link to="/terms-and-conditions" className="text-amber-400 underline">terms</Link> and understand my question and recent chat may be sent to OpenAI. <Link to="/privacy-policy" className="text-amber-400 underline">Privacy</Link></span></label>}
        {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}
        <div className="flex gap-2">
          <label htmlFor="customer-chat-input" className="sr-only">Your Bike Yard question</label>
          <input id="customer-chat-input" ref={inputRef} value={input} onChange={e => setInput(e.target.value)} maxLength={1000} autoComplete="off" placeholder="Ask about Bike Yard…" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-base text-white focus:border-amber-500 focus:outline-none" />
          <button type="submit" aria-label="Send question" disabled={busy || !accepted || !input.trim()} className="rounded-xl bg-amber-500 p-3 text-slate-950 hover:bg-amber-400 disabled:opacity-40"><Send className="h-5 w-5" /></button>
        </div>
        <p className="text-sm text-slate-400">{mode === 'ai' ? 'AI-assisted showroom answers.' : mode === 'help' ? 'Showroom help mode · AI is unavailable for this reply.' : 'Answers from Bike Yard’s published information.'} Don’t share personal or payment details.</p>
      </form>
    </section>
  );
};
