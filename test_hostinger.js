import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    const logMsg = `[${new Date().toISOString()}] Requisição recebida em: ${req.url}\n`;
    fs.appendFileSync('test_deployment.log', logMsg);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('O Node.js está funcionando na Hostinger! Porta: ' + process.env.PORT);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    fs.appendFileSync('test_deployment.log', `Servidor iniciado na porta ${PORT}\n`);
    console.log(`Servidor rodando na porta ${PORT}`);
});
