// MAX-бот для заявок МобилМаш
// Установка:  npm install
// Запуск:     node bot.js

import { Bot } from '@maxhub/max-bot-api';
import 'dotenv/config';

const bot = new Bot(process.env.BOT_TOKEN);
const MANAGER_ID = process.env.MANAGER_ID;

// Логируем id всех, кто пишет боту — так можно узнать MANAGER_ID
bot.on('message_created', (ctx) => {
    const id = ctx.message && ctx.message.sender && ctx.message.sender.user_id;
    console.log('Сообщение от id:', id);
});

// Пользователь перешёл по диплинку https://max.ru/<бот>?start=<заявка>
bot.on('bot_started', async (ctx) => {
    const raw = ctx.startPayload || '';
    const payload = (() => { try { return decodeURIComponent(raw); } catch (e) { return raw; } })();

    if (payload) {
        const text = '🔔 Новая заявка с сайта МобилМаш\n' + payload;
        console.log(text);

        if (MANAGER_ID) {
            try {
                // В некоторых версиях библиотеки метод называется sendMessageToUser
                if (typeof bot.api.sendMessageToUser === 'function') {
                    await bot.api.sendMessageToUser(MANAGER_ID, text);
                } else {
                    await bot.api.sendMessage({ user_id: MANAGER_ID }, text);
                }
            } catch (e) {
                console.error('Не удалось переслать менеджеру:', e.message || e);
            }
        }

        await ctx.reply('Спасибо! Заявка принята. Менеджер свяжется с вами.');
    } else {
        await ctx.reply('Здравствуйте! Это бот МобилМаш. Оставьте заявку на сайте — мы свяжемся с вами.');
    }
});

bot.start();
console.log('Бот запущен. Ожидаю заявки…');
