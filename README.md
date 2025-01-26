# WhatsApp Automation Bot with WebSocket (Baileys)

```
 __    __  ___       __       __          ___      ___       __    __  _______ 
|  |  |  |/  /      |  |     |  |        /   \    /   \     |  |  |  ||   __  |
|  |/\|  |  /       |  |     |  |       /  ^  \  /  ^  \    |  |__|  ||  |  | |
|   /\   |  \       |  |     |  |      /  /_\  \/  /_\  \   |   __   ||  |  | |
|__/  \__|   \      |  `----.|  `----./  /    \__/    \  \  |  |  |  ||  `--' |
|__|   |__|    \     |_______||_______/__/          \__\    |__|  |__||_______| 
```

## Status Proyek
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Versi](https://img.shields.io/badge/versi-1.0.0-blue)
![Status](https://img.shields.io/badge/status-aktif-success)

## 🔍 Deskripsi
Bot WhatsApp otomatis menggunakan library **Baileys** yang memungkinkan Anda untuk mengirim pesan otomatis dan mengelola panggilan masuk dengan WebSocket untuk komunikasi real-time. Fitur ini sangat cocok untuk bot yang memerlukan komunikasi langsung dan pemantauan pesan secara langsung.

## ✨ Fitur Utama
- **Pengiriman Pesan Otomatis**: Kirim pesan ke nomor WhatsApp secara otomatis.
- **Manajemen Panggilan Masuk**: Menangani dan menolak panggilan masuk.
- **WebSocket untuk Real-Time**: Menggunakan WebSocket dari **Baileys** untuk komunikasi real-time antara server dan klien.
- **Logging Detail**: Setiap aktivitas dicatat untuk referensi debugging.
- **Konfigurasi Fleksibel**: Sesuaikan pengaturan dan logika pengiriman pesan.

## 🛠 Prasyarat
- **Termux** (untuk Android)
- **Node.js 14+**
- **Akun WhatsApp**
- **npm**

## 🚀 Instalasi Cepat

### Persiapan Termux
```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y

Instalasi Bot

git clone https://github.com/[username]/wabot.git
cd wabot
npm start
```

💬 Cara Penggunaan

Untuk mengirim pesan melalui bot, format input di terminal adalah:

target: [nomor] pesan: [teks] jumlah: [total]

Contoh

target: 628123456789 pesan: Halo Bot! jumlah: 3

⚙️ Konfigurasi

Edit config.js untuk menyesuaikan parameter bot.

Atur batas pengiriman pesan dan konfigurasi lainnya di dalam file ini.


🛡️ Keamanan

Otentikasi Multi-File: Menggunakan otentikasi multi-file untuk mengelola kredensial dengan lebih aman.

Perlindungan Panggilan: Menangani panggilan masuk untuk menghindari gangguan.

Logging Keamanan: Setiap aktivitas dicatat dengan aman, termasuk pesan masuk dan keluar.


🤝 Kontribusi

1. Fork Repository ini.


2. Buat cabang fitur baru (git checkout -b fitur-xyz).


3. Lakukan perubahan yang diperlukan dan commit (git commit -am 'Menambahkan fitur xyz').


4. Push ke cabang baru (git push origin fitur-xyz).


5. Buat Pull Request untuk menggabungkan fitur.



📜 Lisensi

MIT License - Lihat LICENSE untuk informasi lebih lanjut.

⚠️ Peringatan

🚨 Gunakan dengan bijak sesuai kebijakan WhatsApp. Bot ini hanya untuk keperluan otomatisasi yang sah dan tidak boleh disalahgunakan untuk spam.



