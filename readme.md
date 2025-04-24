MJHSQUIZ-UTS

MJHSQUIZ adalah aplikasi kuis berbasis web yang dikembangkan menggunakan Node.js dan Express.js. Aplikasi ini memungkinkan pengguna untuk mengikuti kuis dengan berbagai pertanyaan yang disediakan.

Fitur

-Manajemen Pengguna: Registrasi dan login pengguna.

-Kuis Interaktif: Menyediakan pertanyaan kuis dengan berbagai kategori.

-Skor dan Hasil: Menampilkan skor setelah menyelesaikan kuis.

-Dashboard Admin: Mengelola pertanyaan dan pengguna (fitur ini dapat disesuaikan sesuai kebutuhan).


Instalasi

1.Klon repositori ini:

git clone https://github.com/mamartinnn/MJHSQUIZ-UTS.git
cd MJHSQUIZ-UTS

2.Instal dependensi:

Pastikan Anda memiliki Node.js dan npm terinstal. 

Kemudian jalankan:

npm install

3.Konfigurasi Database:

-Buat database baru (misalnya, menggunakan MySQL atau MongoDB).

-Sesuaikan konfigurasi koneksi database di file db/config.js atau sesuai dengan struktur proyek.

4.Menjalankan Aplikasi:

npm start

Aplikasi akan berjalan di http://localhost:3000 secara default.


Struktur Proyek

app.js: File utama untuk menginisialisasi aplikasi Express.

controllers/: Berisi logika untuk menangani permintaan dan respons.

routes/: Mendefinisikan rute aplikasi.

views/: Template EJS untuk tampilan antarmuka pengguna.

db/: Konfigurasi dan model database.

validation/: Validasi input pengguna.

middleware.js: Middleware untuk otentikasi dan lainnya.
