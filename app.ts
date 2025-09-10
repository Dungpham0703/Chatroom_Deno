
type Client = {
  id: string;
  name: string;
  room: string;
  socket: WebSocket;
};

const clients = new Map<string, Client>();

function broadcast(room: string, payload: unknown) {
  const msg = JSON.stringify(payload);
  for (const c of clients.values()) {
    if (c.room === room) {
      c.socket.send(msg);
    }
  }
}

Deno.serve({ port: 3000 }, async (req) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/ws" && req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);

    const id = crypto.randomUUID().slice(0, 8);
    let name = `user-${id}`;
    let room = "1";

    socket.onopen = () => {
      clients.set(id, { id, name, room, socket });
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "join") {
        name = msg.name || name;
        room = msg.room || room;
        clients.set(id, { id, name, room, socket });
        broadcast(room, { type: "system", text: `${name} joined room ${room}` });
        return;
      }

      if (msg.type === "chat") {
        broadcast(room, { type: "chat", name, text: msg.text });
      }
    };

    socket.onclose = () => {
      clients.delete(id);
      broadcast(room, { type: "system", text: `${name} left room ${room}` });
    };

    return response;
  }

  if (pathname === "/" || pathname === "/index.html") {
    const html = await Deno.readTextFile("./public/index.html");
    return new Response(html, { headers: { "content-type": "text/html" } });
  }

  return new Response("Not found", { status: 404 });
});
