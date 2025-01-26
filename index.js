const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

console.log("Modul dan pustaka telah diimpor.");

// Konfigurasi untuk direktori log dan panjang pesan maksimal
const CONFIG = {
  LOG_DIRECTORY: "./bot_logs",  // Direktori tempat log disimpan
  MAX_MESSAGE_LENGTH: 1000,  // Batas panjang pesan
};
console.log("Konfigurasi bot telah ditentukan:", CONFIG);

// Fungsi untuk mencatat log ke file
function log(type, message) {
  console.log(`Memulai proses logging dengan tipe: ${type}`);
  
  // Mengecek apakah direktori log ada, jika tidak ada, buat direktori tersebut
  if (!fs.existsSync(CONFIG.LOG_DIRECTORY)) {
    fs.mkdirSync(CONFIG.LOG_DIRECTORY, { recursive: true });
    console.log(`Direktori log "${CONFIG.LOG_DIRECTORY}" dibuat.`);
  }
  
  // Tentukan nama file log berdasarkan jenis log dan tanggal
  const logFile = path.join(CONFIG.LOG_DIRECTORY, `${type}_${new Date().toISOString().split('T')[0]}.log`);
  console.log(`Log akan disimpan ke file: ${logFile}`);
  
  // Menambahkan pesan log ke dalam file
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
  console.log(`[LOG] ${type.toUpperCase()} - ${message}`);
}

// Fungsi utama untuk menghubungkan bot ke WhatsApp
async function connectToWhatsApp() {
  log('connection', "Memulai bot WhatsApp...");
  console.log("Memulai bot WhatsApp...");

  // Memuat kredensial untuk otentikasi dari file
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  log('connection', 'Memuat kredensial dan membuat socket WhatsApp...');
  console.log("Kredensial berhasil dimuat, membuat socket WhatsApp...");

  // Membuat socket WhatsApp dengan autentikasi yang sudah dimuat
  const sock = makeWASocket({
    auth: state,  // Menyertakan state otentikasi
    printQRInTerminal: true,  // Menampilkan QR Code di terminal untuk autentikasi
  });
  console.log("Socket WhatsApp berhasil dibuat.");

  // Menangani pembaruan status koneksi (open atau close)
  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    log('connection', `Pembaruan koneksi: ${connection}`);
    console.log("Pembaruan koneksi diterima:", connection);
    
    if (connection === "close") {
      // Menangani jika koneksi ditutup dan apakah perlu melakukan reconnect
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      log('connection', `Koneksi ditutup. Reconnect: ${shouldReconnect}`);
      console.log(`Koneksi ditutup. Reconnect: ${shouldReconnect}`);
      
      if (shouldReconnect) {
        console.log("Mencoba menghubungkan kembali...");
        connectToWhatsApp();
      }
    }
    if (connection === "open") {
      log('connection', 'Bot berhasil terhubung');
      console.log("Bot berhasil terhubung ke WhatsApp!");
    }
  });

  // Menangani pembaruan kredensial (misalnya setelah login)
  sock.ev.on("creds.update", async () => {
    await saveCreds();  // Menyimpan kredensial yang diperbarui
    log('connection', 'Pembaruan kredensial disimpan.');
    console.log("Kredensial terbaru berhasil disimpan.");
  });

  // Menangani pesan yang diterima
  sock.ev.on("messages.upsert", async (messageUpdate) => {
    log('message_received', `Pembaruan pesan diterima: ${JSON.stringify(messageUpdate)}`);
    console.log("Pesan baru diterima:", messageUpdate);
    
    if (messageUpdate.type === "notify") {
      // Memproses pesan yang diterima dan memastikan format pesan valid
      for (const message of messageUpdate.messages) {
        if (message?.key?.id && !message.key.fromMe) {
          try {
            // Menentukan pengirim dan isi pesan
            const sender = message.key.remoteJid;
            const content = message.message?.conversation || 
                            message.message?.extendedTextMessage?.text || 
                            "Pesan tidak terdeteksi";
            log('message_received', `Pesan dari ${sender}: ${content}`);
            console.log(`Pesan diterima dari ${sender}: ${content}`);
          } catch (err) {
            log('error', `Kesalahan menangani pesan: ${err.message}`);
            console.log("Terjadi kesalahan saat memproses pesan:", err.message);
          }
        }
      }
    }
  });

  // Menangani panggilan masuk (baik suara atau video)
  sock.ev.on("call", async (callUpdate) => {
    log('call', `Pembaruan panggilan diterima: ${JSON.stringify(callUpdate)}`);
    console.log("Panggilan baru diterima:", callUpdate);
    
    for (const call of callUpdate) {
      if (call.status === "offer") {
        try {
          log('call_rejected', `Menolak panggilan dari ${call.from}`);
          console.log(`Menolak panggilan dari ${call.from}...`);
          await sock.rejectCall(call.id, call.from);
          console.log(`Panggilan dari ${call.from} telah ditolak.`);
        } catch (err) {
          log('error', `Gagal menolak panggilan: ${err.message}`);
          console.log("Gagal menolak panggilan:", err.message);
        }
      }
    }
  });

  // Membaca input dari terminal untuk mengirim pesan
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("Interface untuk input terminal telah dibuat.");

  console.log("Masukkan perintah untuk mengirim pesan dengan format:");
  console.log("target: [nomor tujuan] pesan: [pesan] jumlah: [berapa kali]");

  // Menangani input yang diberikan oleh user di terminal
  rl.on("line", async (input) => {
    log('input_received', `Input diterima: ${input}`);
    console.log("Input diterima:", input);
    
    // Mencocokkan input dengan pola yang telah ditentukan
    const match = input.match(/target: (\d+) pesan: (.+) jumlah: (\d+)/);

    if (match) {
      // Mengambil informasi dari input yang cocok
      const target = `${match[1]}@s.whatsapp.net`;  // Format nomor WhatsApp
      const message = match[2];  // Pesan yang akan dikirim
      const count = parseInt(match[3], 10);  // Jumlah pengiriman pesan

      if (!Number.isNaN(count) && count > 0) {
        log('message_sent', `Mengirim pesan ke ${target} sebanyak ${count} kali...`);
        console.log(`Mengirim pesan ke ${target} sebanyak ${count} kali...`);
        
        // Mengirim pesan sebanyak jumlah yang ditentukan
        for (let i = 0; i < count; i++) {
          try {
            log('message_sent', `Pengiriman ke-${i + 1}: Mengirim pesan ke ${target}...`);
            console.log(`Pengiriman ke-${i + 1}: Mengirim pesan ke ${target}...`);

            await sock.sendPresenceUpdate("composing", target);  // Status "sedang mengetik"
            console.log(`Bot sedang mengetik pesan ke ${target}...`);

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Jeda 1 detik

            // Mengirim pesan ke target
            const sentMessage = await sock.sendMessage(target, { text: message });
            log('message_sent', `Pesan ke-${i + 1} terkirim ke ${target}: ${message}`);

            if (sentMessage && sentMessage.key && sentMessage.key.id) {
              console.log(`Pesan ke-${i + 1} berhasil terkirim ke ${target}`);
            } else {
              console.warn(`Pesan ke-${i + 1} gagal mendapatkan ID pengiriman. Mungkin pesan tidak terkirim.`);
            }
          } catch (err) {
            log('error', `Gagal mengirim pesan ke ${target} pada pengiriman ke-${i + 1}: ${err.message}`);
            console.log(`Gagal mengirim pesan ke ${target} pada pengiriman ke-${i + 1}:`, err.message);
          }
        }
        log('message_sent', `Selesai mengirim ${count} pesan ke ${target}.`);
        console.log(`Selesai mengirim ${count} pesan ke ${target}.`);
      } else {
        log('error', "Jumlah pesan harus angka positif.");
        console.error("Jumlah pesan harus angka positif.");
      }
    } else {
      log('error', "Format input tidak valid.");
      console.error("Format tidak valid. Gunakan format: target: [nomor tujuan] pesan: [pesan] jumlah: [berapa kali]");
    }
  });
}

// Menangani error global (uncaughtException dan unhandledRejection)
process.on("uncaughtException", (err) => {
  log('critical_error', `Uncaught Exception: ${err.message}`);
  console.log("Kesalahan tidak tertangani terjadi:", err.message);
});

process.on("unhandledRejection", (reason) => {
  log('critical_error', `Unhandled Rejection: ${reason}`);
  console.log("Rejection tidak tertangani ditemukan:", reason);
});

// Menjalankan bot WhatsApp
connectToWhatsApp();