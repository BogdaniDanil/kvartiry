// const cors = require('cors')
// app.use(cors())
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 13289;

app.use(express.static('public'));
app.use(express.json());

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Подключаемся к базе данных
const db = new Database('database.db');

// Создаём таблицу
db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        consent INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Получить все заявки
app.get('/api/requests', (req, res) => {
    try {
        const requests = db.prepare('SELECT * FROM requests ORDER BY created_at DESC').all();
        res.json(requests);
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
        res.status(500).json({ error: error.message });
    }
});

// Получить одну заявку по ID
app.get('/api/requests/:id', (req, res) => {
    try {
        const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        res.json(request);
    } catch (error) {
        console.error('Ошибка при получении заявки:', error);
        res.status(500).json({ error: error.message });
    }
});

// Добавить новую заявку
app.post('/api/contact', (req, res) => {
    const { name, email, message, consent } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Имя, email и сообщение обязательны' });
    }
    
    if (!consent) {
        return res.status(400).json({ error: 'Необходимо согласие на обработку персональных данных' });
    }
    
    try {
        const result = db.prepare(`
            INSERT INTO requests (name, email, message, consent) 
            VALUES (?, ?, ?, ?)
        `).run(name, email, message, consent ? 1 : 0);
        
        const newRequest = db.prepare('SELECT * FROM requests WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Ошибка при добавлении заявки:', error);
        res.status(500).json({ error: error.message });
    }
});

// Удалить заявку по ID
app.delete('/api/requests/:id', (req, res) => {
    const id = req.params.id;
    
    console.log(`Попытка удалить заявку с ID: ${id}`);
    
    try {
        // Проверяем, существует ли заявка
        const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(id);
        
        if (!request) {
            console.log(`Заявка с ID ${id} не найдена`);
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        
        console.log(`Найдена заявка:`, request);
        
        // Удаляем заявку
        const result = db.prepare('DELETE FROM requests WHERE id = ?').run(id);
        
        console.log(`Результат удаления: ${result.changes} строк затронуто`);
        
        if (result.changes > 0) {
            res.json({ 
                success: true, 
                message: 'Заявка успешно удалена', 
                id: parseInt(id) 
            });
        } else {
            res.status(500).json({ error: 'Не удалось удалить заявку' });
        }
    } catch (error) {
        console.error('Ошибка при удалении заявки:', error);
        res.status(500).json({ error: error.message });
    }
});
app.use(express.static('public')) 
app.listen(PORT, () => {
    console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📋 GET    /api/requests - получить все заявки`);
    console.log(`🗑️  DELETE /api/requests/:id - удалить заявку`);
    console.log(`✉️  POST   /api/contact - добавить заявку`);
    console.log(`\n✅ Готов к работе!\n`);
});
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin'  
};

 app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Проверка наличия данных
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Логин и пароль обязательны'
        });
    }

    // Проверка учётных данных
    if (username === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password) {
        return res.json({
            success: true,
            message: 'Авторизация успешна'
        });
    }

    // Неверные учётные данные
    return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
    });
});