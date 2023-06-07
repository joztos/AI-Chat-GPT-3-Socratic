import { useEffect, useState, useRef } from 'react'
import { Button } from './Button'
import { Message, ChatLine, LoadingChatLine } from './ChatLine'
import { useCookies } from 'react-cookie'
import annyang from 'annyang';

type InputMessageProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => Promise<void>;
  start: () => void;
  stop: () => void;
};

const COOKIE_NAME = 'nextjs-example-ai-chat-gpt3-steamship'

export const initialMessages: Message[] = [
  {
    who: 'bot',
    message: "Hello! I'm Navi, your study companion! Ask me a question.",
  },
];

const InputMessage = ({ input, setInput, sendMessage, start, stop }: InputMessageProps) => (
  <div className="mt-6 flex clear-both">
    <input
      type="text"
      aria-label="chat input"
      required
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(input)
          setInput('')
        }
      }}
      onChange={(e) => {
        setInput(e.target.value)
      }}
    />
    <Button
      type="submit"
      className="ml-4 flex-none"
      onClick={() => {
        sendMessage(input)
        setInput('')
      }}
    >
      Enviar
    </Button>
    <Button
      type="button"
      className="ml-4 flex-none"
      onClick={start}
    >
      Start
    </Button>
    <Button
      type="button"
      className="ml-4 flex-none"
      onClick={stop}
    >
      Stop
    </Button>
  </div>
)

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cookie, setCookie] = useCookies([COOKIE_NAME])
  const [error, setError] = useState<String | undefined>(undefined);
  const [listening, setListening] = useState(false)

  useEffect(() => {
    const cookieValue = cookie[COOKIE_NAME];
    if (!cookieValue) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }

    // Voice to text conversion
    if (annyang) {
      annyang.addCallback('result', function(phrases) {
        setInput(phrases[0]);
      });

      annyang.addCallback('start', function() {
        setListening(true);
      });

      annyang.addCallback('end', function() {
        setListening(false);
      });

      annyang.addCallback('error', function() {
        console.error("There was an error with annyang speech recognition.");
      });
    }

  }, [])

  const start = () => {
    if (annyang) {
      annyang.start();
    }
  }

  const stop = () => {
    if (annyang) {
      annyang.abort();
    }
  }

  // Rest of your code...
  // ...

}
