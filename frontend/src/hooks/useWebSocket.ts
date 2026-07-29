import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketOptions {
  autoReconnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

export function useWebSocket<T>(url: string, options: WebSocketOptions = {}) {
  const {
    autoReconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 10000,
  } = options;

  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const heartbeatTimerRef = useRef<number>(0);
  const reconnectTimerRef = useRef<number>(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setStatus('connecting');
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      reconnectCountRef.current = 0;
      
      // Start heartbeat
      if (heartbeatInterval > 0) {
        heartbeatTimerRef.current = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
          }
        }, heartbeatInterval);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'PONG') {
          setLastMessage(data);
        }
      } catch (e) {
        console.error('WebSocket parse error', e);
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      clearInterval(heartbeatTimerRef.current);
      
      if (autoReconnect && reconnectCountRef.current < reconnectAttempts) {
        reconnectTimerRef.current = window.setTimeout(() => {
          reconnectCountRef.current += 1;
          connect();
        }, reconnectInterval);
      }
    };

    ws.onerror = () => {
      setStatus('error');
    };
  }, [url, autoReconnect, reconnectAttempts, reconnectInterval, heartbeatInterval]);

  const disconnect = useCallback(() => {
    clearInterval(heartbeatTimerRef.current);
    clearTimeout(reconnectTimerRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { status, lastMessage, sendMessage, connect, disconnect };
}
