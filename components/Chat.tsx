import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Message, ChatLine, LoadingChatLine } from './ChatLine';
import { useCookies } from 'react-cookie';
import annyang from 'annyang';

const COOKIE_NAME = 'nextjs-example-ai-chat-gpt3-steamship';

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: Message[] = [
  {
    who: 'bot',
    message: "Hello! I'm Navi, your study companion! Ask me a question.",
  },
];

const InputMessage = ({ input, setInput, sendMessage, startListening, stopListening }) => (
  <div className="mt-6 flex clear-both">
    <input
      type="text"
      aria-label="chat input"
      required
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(input);
          setInput('');
        }
      }}
      onChange={(e) => setInput(e.target.value)}
    />
    <Button className="ml-4 flex-none" onClick={() => { sendMessage(input); setInput(''); }}>Send</Button>
    <Button className="ml-4 flex-none" onClick={startListening}>Start Listening</Button>
    <Button className="ml-4 flex-none" onClick={stopListening}>Stop Listening</Button>
  </div>
);

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);
  const [error, setError] = useState<String | undefined>(undefined);

  useEffect(() => {
    // ... the rest of your useEffect hook
  }, [cookie, setCookie]);

  const startListening = () => {
    // ... your implementation of startListening
  };

  const stopListening = () => {
    // ... your implementation of stopListening
  };

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await fetch('/api/handler', {   // Update with your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ message: message, who: 'user' }] }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { taskId, workspace } = await response.json();
      const taskResponse = await fetch('/api/getTask', {  // Update with your API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, workspace }),
      });

      if (!taskResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const task = await taskResponse.json();

      if (task.status === 'completed') {
        const botMessage = task.result;
        setMessages((prevMessages) => [...prevMessages, { message: botMessage, who: 'bot' }]);
      } else {
        setError("Task is not yet complete. Please try again later.");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        startListening={startListening}
        stopListening={stopListening}
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
  );
}
