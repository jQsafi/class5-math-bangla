import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Key,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  ChatMessage,
  askMathTutor,
  getGroqApiKey,
  setGroqApiKey,
  hasGroqApiKey
} from '../services/groqService';
import { MathBuddyAvatar } from './MathBuddyAvatar';

interface AiTutorModalProps {
  currentChapterTitle?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

// ── Math pre-processing ──────────────────────────────────────────────────────
// The AI sometimes uses \[...\] or [ \frac ] (square brackets) for display math
// instead of $$...$$, and \(...\) for inline math instead of $...$.
// KaTeX also can't render Bengali digits — convert them to Western inside math.
const BANGLA_TO_WESTERN: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

function westernizeInsideMath(expr: string): string {
  return expr.replace(/[০-৯]/g, (ch) => BANGLA_TO_WESTERN[ch] ?? ch);
}

export function preprocessMathContent(text: string): string {
  // 1. \[...\]  →  $$...$$
  text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_m, inner) =>
    `$$${westernizeInsideMath(inner.trim())}$$`
  );

  // 2. \(...\)  →  $...$
  text = text.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_m, inner) =>
    `$${westernizeInsideMath(inner.trim())}$`
  );

  // 3. Lone [ \frac{...}... ] lines (square bracket display math from AI)
  //    Match lines that start with optional whitespace + [ and end with ]
  text = text.replace(/^\s*\[\s*(\\[a-zA-Z][\s\S]*?)\s*\]\s*$/gm, (_m, inner) =>
    `$$${westernizeInsideMath(inner.trim())}$$`
  );

  // 4. Westernize digits inside already-correct $$ ... $$ blocks
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_m, inner) =>
    `$$${westernizeInsideMath(inner)}$$`
  );

  // 5. Westernize digits inside inline $ ... $ blocks
  text = text.replace(/\$([^$\n]+?)\$/g, (_m, inner) =>
    `$${westernizeInsideMath(inner)}$`
  );

  return text;
}
// ─────────────────────────────────────────────────────────────────────────────

export const MarkdownMessage: React.FC<{ content: string; isBot: boolean }> = ({ content, isBot }) => {
  const processed = isBot ? preprocessMathContent(content) : content;
  return (
    <div className={`space-y-1 font-bangla ${isBot ? 'text-slate-800' : 'text-white'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h2 className={`font-extrabold text-base sm:text-lg mt-3 mb-1.5 ${isBot ? 'text-emerald-950 border-b border-emerald-100 pb-1' : 'text-white'}`}>
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className={`font-bold text-sm sm:text-base mt-2.5 mb-1 ${isBot ? 'text-emerald-900 border-b border-emerald-50 pb-0.5' : 'text-white'}`}>
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className={`font-bold text-xs sm:text-sm mt-2 mb-1 ${isBot ? 'text-emerald-800' : 'text-white'}`}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className='text-xs sm:text-sm leading-relaxed my-1'>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className={`font-bold ${isBot ? 'text-slate-900' : 'text-white'}`}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className={`italic ${isBot ? 'text-slate-700' : 'text-emerald-100'}`}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className={`list-disc list-outside ml-4 my-1.5 space-y-1 text-xs sm:text-sm ${isBot ? 'text-slate-800 marker:text-emerald-600' : 'text-white marker:text-emerald-200'}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-outside ml-4 my-1.5 space-y-1 text-xs sm:text-sm ${isBot ? 'text-slate-800 marker:font-bold marker:text-emerald-700' : 'text-white marker:text-emerald-200'}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className='pl-0.5 leading-relaxed'>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className={`my-2 pl-3 py-1 border-l-3 rounded-r-lg text-xs sm:text-sm italic ${
              isBot
                ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950'
                : 'border-white/60 bg-white/10 text-white'
            }`}>
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className={`my-2.5 border-t ${isBot ? 'border-slate-200' : 'border-white/20'}`} />
          ),
          table: ({ children }) => (
            <div className='my-2 overflow-x-auto rounded-xl border border-slate-200 shadow-xs'>
              <table className='w-full text-left text-xs border-collapse'>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className={isBot ? 'bg-emerald-50 text-emerald-950 font-bold border-b border-emerald-100' : 'bg-white/20 text-white font-bold'}>
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className={`divide-y ${isBot ? 'divide-slate-100 bg-white' : 'divide-white/10'}`}>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className={isBot ? 'hover:bg-slate-50/80 transition-colors' : 'hover:bg-white/5 transition-colors'}>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className='px-3 py-2 font-bold whitespace-nowrap'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`px-3 py-1.5 ${isBot ? 'text-slate-700' : 'text-emerald-50'}`}>
              {children}
            </td>
          ),
          code: ({ node, children, ...props }) => {
            // In react-markdown v10, inline code has no parent <pre>; block code does.
            const isBlock = node?.position && node.data && (node.data as any).isBlock;
            const parentName = (node as any)?.parent?.tagName;
            const isInPre = parentName === 'pre';
            if (isInPre) {
              return (
                <code className='block p-2.5 text-xs font-mono overflow-x-auto whitespace-pre rounded-lg bg-slate-900 text-emerald-300' {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className={
                  isBot
                    ? 'px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-xs border border-emerald-100'
                    : 'px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-xs'
                }
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <div className='my-2 overflow-hidden rounded-lg'>
              {children}
            </div>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className={isBot ? 'text-emerald-600 hover:text-emerald-800 underline font-medium' : 'text-white underline font-medium'}
            >
              {children}
            </a>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
};

const DEFAULT_QUESTIONS = [
  'সহজ পদ্ধতিতে গুণ কীভাবে করে?',
  'ভগ্নাংশের যোগ ও বিয়োগ কীভাবে করব?',
  'ল.সা.গু ও গ.সা.গু এর মধ্যে পার্থক্য কী?',
  'ঐকিক নিয়মের সমাধান কৌশল কী?',
  'ত্রিভুজ ও চতুর্ভুজের ক্ষেত্রফল নির্ণয়ের সূত্র কী?'
];

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  currentChapterTitle,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = controlledOnToggle || (() => setInternalIsOpen(!internalIsOpen));

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'স্বাগতম বন্ধু! আমি তোমার পঞ্চম শ্রেণির এআই "গণিত বন্ধু"। গণিত বইয়ের যেকোনো অধ্যায়, সূত্র বা অংকের সমস্যা নিয়ে আমাকে প্রশ্ন করতে পারো।',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // API Key modal state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleOpenSettings = () => {
    setTempApiKey(getGroqApiKey());
    setShowKeyModal(true);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGroqApiKey(tempApiKey.trim());
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyModal(false);
      setErrorMsg(null);
    }, 1200);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputPrompt).trim();
    if (!messageText || loading) return;

    if (!hasGroqApiKey()) {
      setShowKeyModal(true);
      return;
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: messageText },
    ];

    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await askMathTutor(newMessages, currentChapterTitle);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'উত্তরে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'নতুন কথোপকথন শুরু হলো! পঞ্চম শ্রেণির গণিতের কোন বিষয়ে তোমার সাহায্য প্রয়োজন?',
      },
    ]);
    setErrorMsg(null);
  };

  return (
    <>
      {/* Floating Action Button */}
      {/* Mobile: bottom-left, icon-only circle — avoids overlapping Next/Prev chapter buttons at bottom-right */}
      {/* Desktop (sm+): bottom-right, full labeled pill */}
      <div className='fixed bottom-6 left-4 sm:left-auto sm:right-6 z-40 no-print'>
        <button
          onClick={toggleOpen}
          aria-label='গণিত বন্ধু এআই শিক্ষক'
          className='flex items-center gap-3 sm:pl-3 sm:pr-5 p-2.5 sm:py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full shadow-2xl hover:shadow-emerald-600/40 transition-all transform hover:scale-105 active:scale-95 group font-bold text-sm border-2 border-emerald-400/40 backdrop-blur-sm'
        >
          <div className='relative'>
            <span className='animate-ping absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-80'></span>
            <span className='absolute -top-0.5 -right-0.5 inline-flex rounded-full h-3 w-3 bg-amber-400 border-2 border-emerald-700'></span>
            <MathBuddyAvatar size={36} animated={true} mood='excited' className='group-hover:rotate-6 transition-transform' />
          </div>
          {/* Text label hidden on mobile to keep the button compact */}
          <div className='hidden sm:flex flex-col items-start leading-tight text-left'>
            <div className='flex items-center gap-1.5'>
              <span className='text-sm font-black tracking-wide'>গণিত বন্ধু</span>
              <span className='text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider'>AI</span>
            </div>
            <span className='text-[10px] text-emerald-100/90 font-medium'>যে কোনো অংক জিজ্ঞেস করো! 📐✨</span>
          </div>
        </button>
      </div>

      {/* Main Chat Drawer / Modal */}
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-slate-900/40 backdrop-blur-xs'>
          <div
            className='bg-white w-full sm:max-w-lg h-[90vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0 shadow-sm'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-emerald-200 shadow-inner p-1'>
                  <MathBuddyAvatar size={42} mood='happy' animated={true} />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold text-base text-white'>গণিত বন্ধু</h3>
                    <span className='text-[10px] bg-emerald-500/80 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold'>
                      স্মার্ট এআই
                    </span>
                  </div>
                  <p className='text-xs text-emerald-100/80'>
                    {currentChapterTitle
                      ? `${currentChapterTitle} সহায়তা`
                      : '৫ম শ্রেণি পাঠ্যবই সহায়ক'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-1'>
                <button
                  onClick={handleResetChat}
                  title='নতুন আলাপ শুরু করো'
                  className='p-2 hover:bg-white/10 rounded-xl text-emerald-100 transition-colors'
                >
                  <RotateCcw className='w-4 h-4' />
                </button>
                <button
                  onClick={handleOpenSettings}
                  title='এআই সেটিংস'
                  className='p-2 hover:bg-white/10 rounded-xl text-emerald-100 transition-colors'
                >
                  <Key className='w-4 h-4' />
                </button>
                <button
                  onClick={toggleOpen}
                  className='p-2 hover:bg-white/10 rounded-xl text-emerald-100 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Sub-banner if no API key */}
            {!hasGroqApiKey() && (
              <div
                onClick={handleOpenSettings}
                className='p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors'
              >
                <div className='flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4 text-amber-600 shrink-0' />
                  <span>AI সক্রিয় করতে আপনার API Key যুক্ত করুন।</span>
                </div>
                <span className='font-bold underline text-amber-800'>যুক্ত করুন</span>
              </div>
            )}

            {/* Chat Messages */}
            <div className='flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70'>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className='w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200/90 flex items-center justify-center shrink-0 shadow-xs mt-0.5 p-0.5'>
                      <MathBuddyAvatar size={32} mood='happy' />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <MarkdownMessage content={msg.content} isBot={msg.role === 'assistant'} />

                    {msg.role === 'assistant' && (
                      <div className='mt-2 pt-2 border-t border-slate-100 flex items-center justify-between'>
                        <span className='text-[10px] text-slate-400'>গণিত বন্ধু ✨</span>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className='w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1'>
                      <User className='w-4 h-4' />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className='flex gap-3 justify-start'>
                  <div className='w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 p-0.5 animate-bounce'>
                    <MathBuddyAvatar size={32} mood='thinking' />
                  </div>
                  <div className='bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 rounded-bl-xs flex items-center gap-2 shadow-xs'>
                    <span className='animate-spin inline-block w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full'></span>
                    <span className='font-medium'>গণিত বন্ধু চিন্তা করছে ও সমাধান সাজাচ্ছে... 🤔📐</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className='p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2'>
                  <AlertCircle className='w-4 h-4 shrink-0' />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick suggested chips */}
            <div className='px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar'>
              <span className='text-[11px] text-slate-400 shrink-0 font-medium'>
                প্রশ্ন করো:
              </span>
              {DEFAULT_QUESTIONS.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSendMessage(q)}
                  disabled={loading}
                  className='shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-full text-xs font-medium transition-colors border border-slate-200'
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className='p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0'
            >
              <input
                type='text'
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder='গণিতের যেকোনো প্রশ্ন লেখো (যেমন: ৩/৪ + ১/২)...'
                disabled={loading}
                className='flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs md:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all'
              />
              <button
                type='submit'
                disabled={loading || !inputPrompt.trim()}
                className='p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl shadow-md transition-all shrink-0'
              >
                <Send className='w-4 h-4' />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* API Key Configuration Modal */}
      {showKeyModal && (
        <div className='fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs'>
          <div
            className='bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center'>
                  <Key className='w-4 h-4' />
                </div>
                <h3 className='font-bold text-slate-900 text-base'>
                  এআই সেটিংস ও কনফিগারেশন
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className='p-1.5 text-slate-400 hover:text-slate-600 rounded-lg'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <p className='text-xs text-slate-600 leading-relaxed'>
              স্মার্ট এআই অত্যন্ত দ্রুতগতিতে সমাধান ও বিস্তারিত গণিত সহায়তা প্রদান করে। কাস্টম API Key ব্যবহার করতে চাইলে নিচে যুক্ত করতে পারো।
            </p>

            <form onSubmit={handleSaveApiKey} className='space-y-4'>
              <div>
                <label className='block text-xs font-bold text-slate-700 mb-1.5'>
                  কাস্টম API Key (ঐচ্ছিক)
                </label>
                <input
                  type='password'
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder='API Key এখানে পেস্ট করুন...'
                  className='w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              </div>

              <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-relaxed'>
                💡 শিক্ষার্থীদের জন্য প্ল্যাটফর্মে বিল্ট-ইন স্মার্ট এআই ইতিমধ্যে সক্রিয় রয়েছে।
              </div>

              {keySavedMessage && (
                <div className='p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5'>
                  <Check className='w-4 h-4' /> Key সফলভাবে সংরক্ষিত হয়েছে!
                </div>
              )}

              <div className='flex items-center justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowKeyModal(false)}
                  className='px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors'
                >
                  বাতিল
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all'
                >
                  সংরক্ষণ করো
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
