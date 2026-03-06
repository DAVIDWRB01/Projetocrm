import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectToWhatsApp } from './utils/whatsapp.js';
import clientesRouter from './routes/clientes.js';
import managementRouter from './routes/management.js';
import atendimentosRouter from './routes/atendimentos.js';
import kanbanRouter from './routes/kanban.js';
import chatbotRouter from './routes/chatbot.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Rota de Teste Simples para ver se o Node subiu
app.get('/test-node', (req, res) => {
    res.send('<h1>O Node.js está Online na Hostinger!</h1><p>Se você vê isso, o servidor iniciou corretamente.</p>');
});

// Redirecionar rotas amigáveis para arquivos HTML reais
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/clientes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'clientes.html')));
app.get('/fornecedores', (req, res) => res.sendFile(path.join(__dirname, 'public', 'fornecedores.html')));
app.get('/funcionarios', (req, res) => res.sendFile(path.join(__dirname, 'public', 'funcionarios.html')));
app.get('/setores', (req, res) => res.sendFile(path.join(__dirname, 'public', 'setores.html')));
app.get('/atendimentos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'atendimentos.html')));
app.get('/kanban', (req, res) => res.sendFile(path.join(__dirname, 'public', 'kanban.html')));
app.get('/configuracoes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'configuracoes.html')));

// API Routes
app.use('/api/clientes', clientesRouter);
app.use('/api/management', managementRouter);
app.use('/api/atendimentos', atendimentosRouter);
app.use('/api/kanban', kanbanRouter);
app.use('/api/chatbot', chatbotRouter);

// Rota padrão (Dashboard)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io
io.on('connection', (socket) => {
    socket.on('sendMessage', (data) => {
        socket.broadcast.emit('newMessage', data);
    });
});

// A Hostinger define a porta dinamicamente via process.env.PORT
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
    connectToWhatsApp(io).catch(err => console.error("Erro WhatsApp:", err));
});
