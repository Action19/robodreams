const TelegramBot = require("node-telegram-bot-api");

// BotFather'dan olgan tokeningiz
const token = "7949464380:AAGjS-92RvfslSFGj8s5wvm7tjT9KBDIxFU"; 

// Sizning Telegram ID raqamingiz
const ADMIN_ID = 6148355322; // userinfobot dan olgan ID ni shu yerga yozing

// Botni ishga tushirish
const bot = new TelegramBot(token, { polling: true });

// Foydalanuvchilar vaqtinchalik ma'lumotlari
let users = {};

// /start komandasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "👋 Assalomu alaykum! Kursimizga ro‘yxatdan o‘tish uchun Ism va Familiyangizni kiriting."
  );

  users[chatId] = { step: "fullname" };
});

// Xabarlarni qayta ishlash
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!users[chatId]) return;

  if (users[chatId].step === "fullname") {
    users[chatId].fullname = text;
    users[chatId].step = "school";
    bot.sendMessage(chatId, "🏫 Maktab raqamingizni kiriting (masalan: 23-maktab).");
  } 
  else if (users[chatId].step === "school") {
    users[chatId].school = text;
    users[chatId].step = "class";
    bot.sendMessage(chatId, "📘 Sinfingizni kiriting (masalan: 10-A).");
  } 
  else if (users[chatId].step === "class") {
    users[chatId].class = text;
    users[chatId].step = "phone";
    bot.sendMessage(chatId, "📱 Telefon raqamingizni yuboring (masalan: +998901234567).");
  } 
  else if (users[chatId].step === "phone") {
    users[chatId].phone = text;
    users[chatId].step = "done";

    // Foydalanuvchiga tasdiqlash
    bot.sendMessage(
      chatId,
      `✅ Siz muvaffaqiyatli ro‘yxatdan o‘tdingiz!\n\n👤 Ism Familiya: ${users[chatId].fullname}\n🏫 Maktab: ${users[chatId].school}\n📘 Sinf: ${users[chatId].class}\n📱 Telefon: ${users[chatId].phone}`
    );

    // Sizning Telegram akkauntingizga yuborish
    bot.sendMessage(
      ADMIN_ID,
      `📥 Yangi ro‘yxatdan o‘tgan foydalanuvchi:\n\n👤 Ism Familiya: ${users[chatId].fullname}\n🏫 Maktab: ${users[chatId].school}\n📘 Sinf: ${users[chatId].class}\n📱 Telefon: ${users[chatId].phone}`
    );
  }
});
