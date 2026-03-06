import pool from './config/db.js';

async function setup() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS chatbot_regras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                gatilho VARCHAR(255) NOT NULL,
                resposta TEXT NOT NULL,
                acao VARCHAR(50) DEFAULT 'reply',
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Chatbot table created/verified.');

        // Initial rules
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM chatbot_regras');
        if (rows[0].count === 0) {
            await pool.query(`
                INSERT INTO chatbot_regras (gatilho, resposta, acao) VALUES 
                ('ola', 'Olá! Bem-vindo ao nosso atendimento via WhatsApp. Como posso ajudar?', 'reply'),
                ('menu', 'Nossas opções:\n1. Suporte Técnico\n2. Consultar Preços\n3. Falar com Atendente', 'reply'),
                ('preco', 'Para consultar preços, por favor acesse nosso site ou aguarde um consultor.', 'reply'),
                ('suporte', 'Entendi. Vou transferir você para o setor de suporte agora mesmo.', 'transfer')
            `);
            console.log('Initial rules added.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Setup error:', err);
        process.exit(1);
    }
}

setup();
