"use client";

import { useEffect, useRef, useState } from "react";

type Handlers = {
  onMessage?: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (e: Event) => void;
};

export default function useWebSocket(url: string, handlers?: Handlers) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Handlers | undefined>(handlers);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!url) return;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      handlersRef.current?.onOpen?.();
    };

    ws.onclose = () => {
      setConnected(false);
      handlersRef.current?.onClose?.();
    };

    ws.onerror = (e) => {
      handlersRef.current?.onError?.(e);
    };

    ws.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data);
        handlersRef.current?.onMessage?.(parsed);
      } catch {
        handlersRef.current?.onMessage?.(ev.data);
      }
    };

    return () => {
      try {
        ws.close();
      } catch {
        // noop
      }
    };
  }, [url]);

  const send = (payload: unknown) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;
    wsRef.current.send(JSON.stringify(payload));
    return true;
  };

  return { connected, send, ws: wsRef.current };
}

