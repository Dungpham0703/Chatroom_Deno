# 💬 Simple Chatroom (Deno + Tailwind)

A lightweight **real-time chatroom** application built with the powerful **Deno runtime**:

* **Frontend**: The user interface is developed with **HTML + JavaScript**, styled with **TailwindCSS**.  
* **Backend**: The server is built with **Deno**, using the standard **HTTP** and **WebSocket** APIs.  
* **Features**: Multiple rooms, named users, real-time broadcasting, and XSS-safe messages.  

---

## ✨ Key Features

The application provides core functionalities for users to chat in real-time:

* 🧑‍🤝‍🧑 **Multiple rooms**: Users can join different rooms by room number.  
* ✍️ **Named users**: Each user must enter a name before joining.  
* 💬 **Real-time messaging**: Messages are instantly broadcasted to everyone in the same room.  
* 🔒 **Safe messaging**: All messages are HTML-escaped to prevent XSS attacks.  
* 🎨 **Responsive UI**: The interface works smoothly on both desktop and mobile devices.  

---

## 🗂 Project Structure

The project is organized into two main parts:

```bash
deno-chat/
├── server.ts    # Deno HTTP + WebSocket server
├── deno.json    # Deno tasks & configuration
├── public/
│   ├── index.html   # Client-side UI (Tailwind + JS)
│   └── app.js       # Client logic (connect WS, render messages)
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to get the application up and running on your local machine.

### 1. Backend (Deno server)

1.  Navigate to the project directory:
    ```bash
    cd deno-chat
    ```
2.  Start the server using the task defined in `deno.json`:
    ```bash
    deno task dev
    ```
    > This usually runs `deno run --allow-net --allow-read server.ts`

The server will start on:
```
http://localhost:3000
```

### 2. Frontend

1.  Open your browser and navigate to:
    ```
    http://localhost:3000
    ```
2.  Enter your **name** and a **room number**, then click **Join** to start chatting.

---

The application will be ready to use instantly! 🎉  
