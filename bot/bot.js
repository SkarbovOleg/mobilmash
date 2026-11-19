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

// ===== СОДЕРЖАНИЕ БОТА =====
const WELCOME =
    'Здравствуйте! Это бот компании МОБИЛМАШ — производителя оборудования для бурения и нефтегаза.\n\n' +
    'Помогу с подбором, ценами и заявкой. Напишите, что нужно, и оставьте телефон или почту — передам менеджеру.';

const HELP =
    'Что можно спросить:\n\n' +
    '• «цена» / «стоимость» — как рассчитываем\n' +
    '• «доставка» — условия доставки\n' +
    '• «гарантия» — гарантийные условия\n' +
    '• «контакты» — как связаться\n' +
    '• «каталог» — что есть в наличии\n\n' +
    'Или просто напишите ваш вопрос с телефоном — менеджер ответит.';

const FAQ = [
    { k: ['цена', 'стоимост', 'сколько', 'прайс'], a: 'Цены рассчитываем индивидуально — зависят от модели и комплектации. Напишите, что нужно, и менеджер пришлёт расчёт.' },
    { k: ['доставк', 'доставл'], a: 'Доставляем по всей России транспортными компаниями. Срок и стоимость уточним по вашему адресу.' },
    { k: ['гарант'], a: 'На всё оборудование действует гарантия производителя. Условия зависят от модели — уточним у менеджера.' },
    { k: ['контакт', 'телефон', 'почт', 'связ', 'менеджер'], a: 'Связаться можно здесь в чате, по почте Agm159@mail.ru или кнопкой «Позвонить» на сайте.' },
    { k: ['каталог', 'оборудован', 'ассортимент', 'ротор', 'лебед', 'лебёд', 'установк', 'захват'], a: 'В каталоге — буровые установки, роторы, лебёдки, захваты и услуги. Откройте раздел «Каталог» на сайте или напишите модель — подскажу цену и наличие.' }
];

function faqAnswer(text) {
    const t = (text || '').toLowerCase();
    for (const item of FAQ) {
        for (const k of item.k) {
            if (t.indexOf(k) !== -1) return item.a;
        }
    }
    return null;
}

// ===== API =====
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
            await sendTo(userId, WELCOME);
        }
        return;
    }

    if (type === 'message_created' && u.message) {
        const sender = u.message.sender && u.message.sender.user_id;
        const text = (u.message.body && u.message.body.text) || '';
        console.log('Сообщение от user_id=' + sender + ': ' + text);

        if (!sender) return;

        if (/^\/help/i.test(text)) { await sendTo(sender, HELP); return; }
        if (/^\/start/i.test(text)) { await sendTo(sender, WELCOME); return; }

        const faq = faqAnswer(text);
        if (faq) {
            await sendTo(sender, faq);
        }

        if (MANAGER_ID) {
            await sendTo(MANAGER_ID, '💬 Сообщение с сайта от user_id ' + sender + ':\n' + text);
            if (!faq) await sendTo(sender, 'Спасибо! Передал ваш вопрос менеджеру — он свяжется с вами.');
        } else if (!faq) {
            await sendTo(sender, 'Спасибо! Сообщение принято. Менеджер свяжется с вами.');
        }
    }
}

// ===== Long polling =====
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
