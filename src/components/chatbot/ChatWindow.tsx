import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Paperclip, Send, Sparkles, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { useChatbot, useChatbotActions } from '../../hooks/useChatbot';
import { useTranslation } from '../../context/LanguageContext';

function MessageBubble({
  role,
  content,
  index,
}: {
  role: string;
  content: string;
  index: number;
}) {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1f108e]">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isAssistant
            ? 'rounded-bl-sm border border-[#c8c4d5] bg-[#f6f2fc] text-[#1b1b22]'
            : 'rounded-br-sm bg-[#1f108e] text-white'
        }`}
      >
        {content}
      </div>

      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c8c4d5] bg-white">
          <User className="h-3.5 w-3.5 text-muted" />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1f108e]">
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-[#c8c4d5] bg-[#f6f2fc] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatWindow() {
  const { t } = useTranslation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [localReplies, setLocalReplies] = useState<Array<{ role: string; content: string }>>([]);
  const { sessions, history } = useChatbot(sessionId);
  const actions = useChatbotActions();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickReplies = useMemo(() => [
    t('chatbot.reply1'),
    t('chatbot.reply2'),
    t('chatbot.reply3'),
    t('chatbot.reply4'),
  ], [t]);

  const faqs = useMemo(() => [
    t('chatbot.faq1'),
    t('chatbot.faq2'),
    t('chatbot.faq3'),
    t('chatbot.faq4'),
  ], [t]);

  const messages = useMemo(() => {
    const remote = history.data?.map((item) => ({ role: item.role, content: item.content })) || [];
    return remote.length ? remote : localReplies;
  }, [history.data, localReplies]);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = (text = message) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLocalReplies((prev) => [...prev, { role: 'user', content: trimmed }]);
    setMessage('');
    actions.sendMessage.mutate(
      { sessionId, message: trimmed },
      {
        onSuccess: (response) => {
          setSessionId(response.sessionId);
          setLocalReplies((prev) => [...prev, { role: 'assistant', content: response.reply }]);
        },
      },
    );
    inputRef.current?.focus();
  };

  return (
    <div className="grid h-[calc(100vh-11rem)] gap-0 rounded-lg border border-[#c8c4d5] bg-white lg:grid-cols-[269px_1fr]">
      {/* Sessions sidebar */}
      <aside className="flex flex-col overflow-hidden border-r border-[#c8c4d5] bg-[#f6f2fc]">
        <div className="border-b border-[#c8c4d5] px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">{t('chatbot.history')}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* New session button */}
          <button
            onClick={() => { setSessionId(null); setLocalReplies([]); }}
            className="mb-4 flex w-full items-center gap-2 rounded-lg border border-dashed border-[#c8c4d5] p-3 text-xs text-[#58566a] transition hover:border-[#1f108e] hover:bg-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t('chatbot.newChat')}
          </button>

          <div className="space-y-1">
            {sessions.data?.map((session) => (
              <button
                key={session.id}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-xs transition-all duration-200 ${
                  sessionId === session.id
                    ? 'border border-[#1f108e] bg-[rgba(55,48,163,0.1)] text-[#1f108e]'
                    : 'text-[#464553] hover:bg-white'
                }`}
                onClick={() => setSessionId(session.id)}
              >
                <span className="block truncate font-medium">
                  {session.id.slice(0, 20)}…
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-[#c8c4d5] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#58566a]">{t('chatbot.faqs')}</p>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <button
                key={faq}
                type="button"
                onClick={() => send(faq)}
                className="w-full rounded-lg border border-[#c8c4d5] bg-white px-3 py-2 text-left text-xs text-[#464553] hover:bg-[#fdfbff]"
              >
                {faq}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#c8c4d5] px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f108e]">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1b1b22]">{t('chatbot.title')}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1f108e]" />
              <p className="text-xs text-[#58566a]">{t('chatbot.ready')}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-brand/20">
                <MessageCircle className="h-7 w-7 text-[#1f108e]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#1b1b22]">{t('chatbot.askAnything')}</p>
                <p className="mt-1 max-w-xs text-sm text-[#58566a]">
                  {t('chatbot.welcomeDesc')}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((item, index) => (
                <MessageBubble key={index} role={item.role} content={item.content} index={index} />
              ))}
            </AnimatePresence>
            {actions.sendMessage.isPending && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-[#c8c4d5] bg-[#f6f2fc] p-4">
          {/* Quick replies */}
          <div className="mb-3 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => send(reply)}
                className="rounded-full border border-[#c8c4d5] bg-white px-3 py-1.5 text-xs text-[#58566a] transition hover:border-[#1f108e] hover:text-[#1f108e]"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input row */}
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => { event.preventDefault(); send(); }}
          >
            {/* File upload */}
            <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#c8c4d5] bg-white text-[#58566a] transition hover:bg-[#fdfbff]">
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                className="hidden"
                onChange={(event) =>
                  event.target.files?.[0] && actions.uploadDoc.mutate(event.target.files[0])
                }
              />
            </label>

            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 rounded-xl border border-[#c8c4d5] bg-white px-4 py-2.5 text-sm text-[#1b1b22] outline-none transition-all placeholder:text-[#8a8898] focus:border-[#1f108e] focus:ring-2 focus:ring-[rgba(31,16,142,0.15)]"
            />

            <Button
              type="submit"
              size="md"
              className="shrink-0"
              loading={actions.sendMessage.isPending}
              icon={<Send className="h-4 w-4" />}
            >
              {t('common.submit')}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
