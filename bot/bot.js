// MAX-бот заявок МобилМаш
// Запуск:  node bot.js   (нужен Node.js 18+)
// Настройки — в файле .env рядом (BOT_TOKEN, MANAGER_ID).

import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // сертификат Минцифры

// Читаем .env вручную, без зависимостей
try {
    for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
} catch (e) { /* .env может отсутствовать — берём из окружения */ }

const TOKEN = process.env.BOT_TOKEN;
const MANAGER_ID = process.env.MANAGER_ID || '';
const API = 'https://platform-api2.max.ru';
const HEADERS = { 'Authorization': TOKEN, 'Content-Type': 'application/json' };

if (!TOKEN) {
    console.error('Не задан BOT_TOKEN. Создайте .env с BOT_TOKEN=...');
    process.exit(1);
}

async function call(method, path, body) {
    const res = await fetch(API + path, { method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    try { return JSON.parse(text); } catch (e) { return { raw: text }; }
}

async function sendTo(chatId, text) {
    return call('POST', '/messages?chat_id=' + encodeURIComponent(chatId), { text });
}

async function handleUpdate(u) {
    const type = u.update_type || u.type;

    if (type === 'bot_started') {
        const payload = (() => { try { return decodeURIComponent(u.payload || ''); } catch (e) { return u.payload || ''; } })();
        const userId = u.user && u.user.user_id;
        if (payload) {
            const text = '🔔 Новая заявка с сайта МобилМаш\n' + payload;
            console.log(text);
            if (MANAGER_ID) await sendTo(MANAGER_ID, text);
            if (userId) await sendTo(userId, 'Спасибо! Заявка принята. Менеджер свяжется с вами.');
        } else if (userId) {
            await sendTo(userId, 'Здравствуйте! Это бот МобилМаш. Оставьте заявку на сайте — мы свяжемся с вами.');
        }
        return;
    }

    if (type === 'message_created' && u.message) {
        const sender = u.message.sender && u.message.sender.user_id;
        const chat = u.message.recipient && u.message.recipient.chat_id;
        const text = (u.message.body && u.message.body.text) || '';
        console.log('Сообщение от user_id=' + sender + ', chat_id=' + chat + ': ' + text);
        if (MANAGER_ID && sender && text) {
            await sendTo(MANAGER_ID, '💬 Сообщение с сайта от ' + sender + ':\n' + text);
        }
    }
}

let marker = null;
async function poll() {
    try {
        const url = API + '/updates' + (marker ? '?marker=' + encodeURIComponent(marker) : '');
        const res = await fetch(url, { headers: HEADERS });
        const data = await res.json();
        if (data.marker) marker = data.marker;
        for (const u of (data.updates || [])) {
            try { await handleUpdate(u); } catch (e) { console.error('update:', e.message); }
        }
    } catch (e) {
        console.error('poll:', e.message);
    }
    setTimeout(poll, 1500);
}

console.log('Бот запущен (id2224056211_bot). Ожидаю заявки…');
poll();
