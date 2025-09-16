// api/ws.ts
export const runtime = 'edge';

type Client = { id: string; name: string; room: string; socket: WebSocket };

// Simple in-memory room → Set<WebSocket> (per-instance)
const rooms = new Map<string, Set<WebSocket>>();

function broadcast(room: string, payload: unknown) {
  const set = rooms.get(room);
  if (!set) return;
  const msg = JSON.stringify(payload);
  for (const ws of set) {
    try { ws.send(msg); } catch {}
  }
}

export async function GET(req: Request) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  // Create standard-compliant WS pair
  const { 0: client, 1: server } = new (globalThis as any).WebSocketPair() as [WebSocket, WebSocket];
  server.accept();

  // Per-connection state
  const id = Math.random().toString(36).slice(2, 10);
  let name = `user-${id}`;
  let room = '1';

  // Ensure default room
  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room)!.add(server);

  server.addEventListener('message', (ev: MessageEvent) => {
    try {
      const msg = JSON.parse(ev.data as string);

      if (msg.type === 'join') {
        // leave old room
        rooms.get(room)?.delete(server);

        name = msg.name || name;
        room = msg.room || room;

        if (!rooms.has(room)) rooms.set(room, new Set());
        rooms.get(room)!.add(server);

        broadcast(room, { type: 'system', text: `${name} joined room ${room}` });
        return;
      }

      if (msg.type === 'chat') {
        broadcast(room, { type: 'chat', name, text: msg.text ?? '' });
        return;
      }
    } catch {
      // ignore invalid message
    }
  });

  server.addEventListener('close', () => {
    rooms.get(room)?.delete(server);
    broadcast(room, { type: 'system', text: `${name} left room ${room}` });
  });

  return new Response(null, { status: 101, webSocket: client as any });
}
