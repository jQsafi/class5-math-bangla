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
import {
  ChatMessage,
  askMathTutor,
  getGroqApiKey,
  setGroqApiKey,
  hasGroqApiKey
} from '../services/groqService';

interface AiTutorModalProps {
  currentChapterTitle?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

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
        'নমস্কার শিক্ষার্থী! আমি তোমার পঞ্চম শ্রেণির এআই "গণিত বন্ধু"। গণিত বইয়ের যেকোনো অধ্যায়, সূত্র বা অংকের সমস্যা নিয়ে আমাকে প্রশ্ন করতে পারো।',
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
      <div className='fixed bottom-6 right-6 z-40 no-print'>
        <button
          onClick={toggleOpen}
          aria-label='গণিত বন্ধু এআই শিক্ষক'
          className='flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full shadow-xl hover:shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 group font-bold text-sm'
        >
          <span className='relative flex h-3.5 w-3.5'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400'></span>
          </span>
          <Sparkles className='w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform' />
          <span>গণিত শিক্ষক (AI)</span>
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
                <div className='w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-emerald-200 shadow-inner'>
                  <Bot className='w-6 h-6' />
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
                    <div className='w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1'>
                      <Bot className='w-4 h-4' />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    <div className='whitespace-pre-wrap'>{msg.content}</div>

                    {msg.role === 'assistant' && (
                      <div className='mt-2 pt-2 border-t border-slate-100 flex items-center justify-between'>
                        <span className='text-[10px] text-slate-400'>NCTB গণিত শিক্ষক</span>
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
                  <div className='w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 animate-pulse'>
                    <Bot className='w-4 h-4' />
                  </div>
                  <div className='bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 rounded-bl-xs flex items-center gap-2'>
                    <span className='animate-spin inline-block w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full'></span>
                    <span>গণিত বন্ধু চিন্তা করছে ও সমাধান সাজাচ্ছে...</span>
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
