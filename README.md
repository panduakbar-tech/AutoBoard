# 📋 AutoBoard — Aplikasi Manajemen Praktikum Mobile

> **Ujian Praktikum Mobile Computing — Semester Genap 2025/2026**

AutoBoard adalah aplikasi mobile berbasis **React Native (Expo)** yang dirancang untuk membantu mahasiswa dan instruktur dalam manajemen kegiatan praktikum teknik. Aplikasi ini mengintegrasikan **Axios** untuk komunikasi dengan API dan **Firebase Authentication** untuk manajemen sesi pengguna yang aman.

---

## 👥 Anggota Tim & Pembagian Tugas

> **Skenario B — Tim 2 Orang**

| No | Nama | NIM | Peran | Tanggung Jawab Demo |
|----|------|-----|-------|---------------------|
| 1 | *(Haikal Dzikri)* | *(0923040065)* | **Frontend & Axios Specialist** | Menjelaskan desain UI/UX aplikasi dan mekanisme penarikan data dari API menggunakan Axios **(Fitur 1 & Fitur 2)** |
| 2 | *(Pandu Akbar Wicaksono)* | *(093040076)* | **Backend, State & Firebase Specialist** | Menjelaskan manajemen data lokal aplikasi dan arsitektur Firebase yang digunakan **(Fitur 3 + setup Firebase)** |

> **Bukti kontribusi** dapat dilihat melalui **Git commit history** masing-masing anggota di repositori ini.

---

## 📱 Tentang Aplikasi

**AutoBoard** adalah *digital job sheet & task tracker* untuk lingkungan praktikum teknik. Aplikasi ini menggantikan lembar kerja fisik dengan antarmuka digital yang terintegrasi dengan data jadwal praktikum secara *real-time* dari cloud, dilengkapi papan Kanban untuk memantau progres pengerjaan modul.

### Alur Aplikasi

```
[Splash Screen]
      ↓
 Firebase cek sesi
      ↓
[Login Screen] ──────────────→ [JobSheet & Jadwal]
 (Firebase Auth)                       ↓
                                [Kanban Board]
```

---

## 🔌 API yang Digunakan

| # | Nama API | Base URL / Endpoint | Kegunaan |
|---|----------|---------------------|----------|
| 1 | **MockAPI (Custom)** | `https://6a2fef79a7f8866418d54dfc.mockapi.io/jadwal` | Mengambil data jadwal praktikum (JSON) secara *real-time* |
| 2 | **Calendarific / Public Holiday API** | Diakses via `getHariLibur()` di `api.js` | Mengecek status hari libur nasional pada fitur Holiday Checker |

> Semua request API dikelola menggunakan **Axios** dengan konfigurasi `timeout: 10000 ms`, interceptor logging sukses/error, dan header `Content-Type: application/json`.

---

## ⭐ 3 Fitur Utama yang Didemokan

### Fitur 1 — 📅 Job Sheet & Jadwal Praktikum (Axios)
**File utama:** `src/screens/JobSheetScreen.js` · `src/services/api.js`

Menampilkan daftar jadwal praktikum yang diambil secara *real-time* dari **MockAPI** menggunakan **Axios**. Pengguna dapat melakukan pencarian berdasarkan nama modul atau kode, serta membuka link LMS terkait langsung dari aplikasi.

- ✅ Fetch data jadwal via `GET /jadwal` menggunakan `axios.create()` dengan `baseURL` dan `timeout`
- ✅ Response interceptor untuk logging sukses dan error handling terpusat
- ✅ Fitur search/filter data jadwal secara lokal
- ✅ Integrasi `Linking.openURL()` untuk membuka LMS dari aplikasi

---

### Fitur 2 — 🗓️ Holiday Checker (Axios + API Publik)
**File utama:** `src/components/HolidayChecker.js` · `src/services/api.js`

Widget terintegrasi di dalam **KanbanScreen** yang mengecek apakah tanggal yang dipilih merupakan hari libur nasional menggunakan API publik (*Public Holiday API*). Sistem memiliki mekanisme fallback ke data lokal apabila API tidak tersedia (penanganan *timeout* dan error jaringan).

- ✅ HTTP GET ke endpoint hari libur via Axios
- ✅ Parsing respons JSON dan menampilkan nama hari libur
- ✅ Fallback ke `LOCAL_HOLIDAYS` jika API gagal (error handling)
- ✅ Navigasi tanggal maju/mundur dengan tombol interaktif

---

### Fitur 3 — 🔐 Autentikasi Firebase (Firebase Authentication)
**File utama:** `src/screens/LoginScreen.js` · `src/services/firebaseConfig.js` · `src/navigation/AppNavigator.js`

Sistem autentikasi pengguna berbasis **Firebase Authentication** menggunakan email dan password. Token sesi pengguna dipersistensikan secara otomatis oleh Firebase SDK, sehingga pengguna tidak perlu login ulang setiap membuka aplikasi.

- ✅ Login dengan `signInWithEmailAndPassword()` dari Firebase Auth
- ✅ Pengecekan sesi otomatis via `onAuthStateChanged()` saat aplikasi pertama dibuka
- ✅ Logout dengan `signOut()` disertai konfirmasi dialog
- ✅ Mapping pesan error Firebase ke Bahasa Indonesia (*user-friendly*)
- ✅ Validasi email & password *client-side* sebelum request dikirim

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React Native | 0.81.5 | Framework UI Mobile |
| Expo | ~54.0.34 | Build toolchain & runtime |
| Axios | ^1.18.0 | HTTP Client (API integration) |
| Firebase | ^12.15.0 | Authentication & Backend-as-a-Service |
| React Navigation | ^7.x | Navigasi antar halaman (Stack Navigator) |
| Expo Router | ~6.0.23 | File-based routing |

---

## 🗂️ Struktur Proyek

```
AutoBoard/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js       # Fitur 3: Firebase Auth Login
│   │   ├── JobSheetScreen.js    # Fitur 1: Job Sheet + Axios Fetch Jadwal
│   │   ├── KanbanScreen.js      # Fitur 2: Kanban Board + Holiday Checker
│   │   └── SplashScreen.js      # Loading screen saat cek sesi Firebase
│   ├── components/
│   │   ├── HolidayChecker.js    # Komponen Axios: cek hari libur via API
│   │   ├── ModulCard.js         # Kartu modul praktikum
│   │   └── LogoAutoBoard.js     # Komponen logo aplikasi
│   ├── services/
│   │   ├── api.js               # Konfigurasi Axios (baseURL, interceptor)
│   │   └── firebaseConfig.js    # Inisialisasi Firebase SDK & export auth
│   ├── navigation/
│   │   └── AppNavigator.js      # Stack Navigator + guard Firebase sesi
│   └── constants/
│       └── colors.js            # Konstanta warna aplikasi
├── assets/                      # Ikon, splash screen, gambar
├── app.json                     # Konfigurasi Expo
├── package.json                 # Dependensi proyek
└── README.md                    # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Aplikasi **Expo Go** di smartphone (Android/iOS) **atau** emulator Android Studio

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/<username>/AutoBoard.git
cd AutoBoard

# 2. Install semua dependensi
npm install

# 3. Jalankan development server
npx expo start
```

Setelah server berjalan, scan QR code menggunakan aplikasi **Expo Go** atau tekan:
- `a` → buka di Android Emulator
- `i` → buka di iOS Simulator
- `w` → buka di browser (web)

### Akun Demo (Firebase)

| Email | Password |
|-------|----------|
| *(panduakbar@student.ppns.ac.id)* | *(panduakbar1)*|
| *(haikaldzikri@student.ppns.ac.id)* | *(12345678)*|

---

## 📊 Komponen Penilaian

| Komponen | Bobot | Implementasi dalam AutoBoard |
|----------|-------|------------------------------|
| Implementasi Axios | 25% | `api.js` — `axios.create()`, interceptor, `getJadwal()`, `getHariLibur()` |
| Implementasi Firebase | 25% | `firebaseConfig.js` — Auth, `onAuthStateChanged`, `signIn`, `signOut` |
| UI/UX & Kerapian Kode | 15% | StyleSheet terstruktur, navigasi stack, komponen reusable |
| Kerja sama & Git Log | 15% | Commit per-anggota sesuai pembagian tugas di atas |
| Penguasaan Materi / Demo | 20% | Masing-masing anggota menjelaskan fitur yang menjadi tanggung jawabnya |

---

## 🔗 Tautan Penting

- 📦 **Repositori GitHub:** `https://github.com/<username>/AutoBoard` *(set public)*
- 🔥 **Firebase Console:** `https://console.firebase.google.com/project/autoboard-3f48f`

---

<div align="center">
  <sub>Dibuat untuk Ujian Praktikum Mobile Computing — Semester Genap 2025/2026</sub>
</div>
