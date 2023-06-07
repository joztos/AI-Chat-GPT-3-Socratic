import { useEffect, useState, useRef } from 'react'
import { Button } from './Button'
import { Message, ChatLine, LoadingChatLine } from './ChatLine'
import { useCookies } from 'react-cookie'

type InputMessageProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => Promise<void>;
  start: () => void;
  stop: () => void;
};

const COOKIE_NAME = 'nextjs-example-ai-chat-gpt3-steamship'

// default first message to display in UI (not necessary to define the prompt)
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
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }

    // Voice to text conversion
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setInput(text);
    }

    recognition.onspeechend = () => {
      setListening(false);
      recognition.stop();
    }

    recognition.onerror = (event) => {
      console.error(event.error);
    }

    recognition.onaudiostart = () => {
      setListening(true);
    }

  }, [cookie, setCookie])

  const start = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  }

  const stop = () => {
    if (recognitionRef.current) {
      setListening(false);
      recognitionRef.current.stop();
    }
  }

  const pollMessage = async (taskId: string, workspace: string) => {
    console.log("Polling", taskId, workspace)
    const response = await fetch('/api/check_job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({taskId, workspace})
    })

    if (!response.ok) {
      setLoading(false);
      setError(response.statusText);
      return;
    }

    const {state, statusMessage, output} = await response.json()

    if (state == 'succeeded') {
      setLoading(false);
      setMessages((oldMessages) => [
        ...oldMessages,
        { message: output.trim(), who: 'bot' } as Message
      ])
    } else if (state == 'failed') {
      setLoading(false);
      setError(statusMessage);
      return;
    } else if (state == 'running') {
      setTimeout(async () => {
        pollMessage(taskId, workspace)
      }, 300);
    }

  }

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true)
    setError(undefined);
    const newMessages = [
      ...messages,
      { message: message, who: 'user' } as Message,
    ]
    setMessages(newMessages)
    const last10messages = newMessages.slice(-10)

    const response = await fetch('/api/submit_job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: last10messages,
        user: cookie[COOKIE_NAME],
      }),
    })

    if (!response.ok) {
      setLoading(false);
      setError(response.statusText);
      return;
    }

    const {taskId, workspace, error} = await response.json()

    if (error) {
      setLoading(false);
      setError(error)
    } else {
      pollMessage(taskId, workspace)
    }
  }

  return (
    <div className="rounded-2xl border-zinc-100  lg:border lg:p-6">
      {messages.map(({ message, who }, index) => (
        <ChatLine key={index} who={who} message={message} />
      ))}

      {loading && <LoadingChatLine />}

      {messages.length < 2 && (
        <span className="mx-auto flex flex-grow text-gray-600 clear-both">
          Write a question to start the conversation..
        </span>
      )}
      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        start={start}
        stop={stop}
      />

      { error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}
