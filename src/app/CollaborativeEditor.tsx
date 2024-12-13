"use client"


import { useState, useEffect, useCallback } from 'react';

const CollaborativeEditor = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [content, setContent] = useState<string>('');
  const [lastEdit, setLastEdit] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    const socket = new WebSocket('wss://notepadplusapp.onrender.com/'); // notepadplus-api.onrender.com

    socket.onopen = () => {
      setConnected(true);
      setError(null);
    };

    socket.onclose = () => {
      setConnected(false);
      setError('Disconnected from server');
      // Try to reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    socket.onerror = (error) => {
      setError('Failed to connect to server');
      console.log(error);
      setConnected(false);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'initialContent':
            setContent(data.content);
            setLastEdit(data.lastEditTime);
            break;
          case 'contentUpdate':
            setContent(data.content);
            setLastEdit(data.lastEditTime);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  const sendMessage = useCallback((type: string, payload: Record<string, unknown>) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, ...payload }));
    }
  }, [ws]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    sendMessage('contentChange', {
      content: newContent,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-black-500">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-2">
            {error}
          </div>
        )}
      </div>
      
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        placeholder="Start typing..."
      />
      
      {lastEdit && (
        <div className="mt-2 text-sm text-black-500">
          Last edited: {new Date(lastEdit).toLocaleString()}
        </div>
      )}
    </div>
  );
};


export default CollaborativeEditor;