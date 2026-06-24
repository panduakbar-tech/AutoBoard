import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking // 🌟 DITAMBAHKAN: Untuk membuka link browser (LMS)
  ,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Import Firebase Auth untuk Logout
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

// Import koneksi API
import { getJadwal } from '../services/api';

export default function JobSheetScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState(''); 
  const [activeTab, setActiveTab] = useState('Job Sheets');
  const [jadwalAPI, setJadwalAPI] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ════════════════════════════════════════════════════════
  //  LOGOUT HANDLER (TAHAP 7)
  // ════════════════════════════════════════════════════════
  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Aplikasi?',
      'Anda akan kembali ke halaman Login.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Putus sesi dari server Firebase
              await signOut(auth);
              
              // 2. Kunci pintu masuk (Hapus riwayat halaman)
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              Alert.alert('Gagal Keluar', e.message);
            }
          },
        },
      ]
    );
  };

  // ════════════════════════════════════════════════════════
  // BUKA LMS PPNS
  // ════════════════════════════════════════════════════════
  const bukaLMS = async () => {
    const urlLMS = 'https://lms.ppns.ac.id/my/';
    
    try {
      const supported = await Linking.canOpenURL(urlLMS);
      if (supported) {
        await Linking.openURL(urlLMS);
      } else {
        Alert.alert("Gagal", "Browser tidak ditemukan untuk membuka LMS.");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat membuka link LMS.");
    }
  };

  // ════════════════════════════════════════════════════════
  // LOGIKA API: MENGAMBIL & MEMBUKA BUNGKUS DATA (UNWRAPPING)
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getJadwal();
        let dataAsli = response.data;
        
        // Membuka "Double Array" jika dari MockAPI formatnya [[...]]
        if (Array.isArray(dataAsli) && dataAsli.length > 0 && Array.isArray(dataAsli[0])) {
          dataAsli = dataAsli[0]; 
        }

        setJadwalAPI(Array.isArray(dataAsli) ? dataAsli : []);
      } catch (err) {
        console.error("Gagal menarik data dari API:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ════════════════════════════════════════════════════════
  // LOGIKA PENCARIAN (FILTER)
  // ════════════════════════════════════════════════════════
  const filteredData = jadwalAPI.filter(item => {
    const keyword = searchQuery.toLowerCase();
    const namaMatkul = item.nama_mk ? item.nama_mk.toLowerCase() : "";
    const hariKuliah = item.hari ? item.hari.toLowerCase() : "";
    const ruangan = item.kode_ruang ? item.kode_ruang.toLowerCase() : "";
    
    return namaMatkul.includes(keyword) || hariKuliah.includes(keyword) || ruangan.includes(keyword);
  });

  // Data Statis untuk Tab Job Sheets (Modul Praktikum)
  const jobSheets = [
    { 
      id: '1', 
      title: 'Modul 1: PLC Programming (Omron CP1E)', 
      deadline: '15 Jun', 
      icon: '📟',
      kanbanTitle: 'PLC Programming (Omron CP1E)',
      subtitle: 'Monitoring Progres Praktikum'
    },
    { 
      id: '2', 
      title: 'Modul 2: Wiring & Kontrol Motor 3 Fasa', 
      deadline: '17 Jun', 
      icon: '⚙️',
      kanbanTitle: 'Wiring & Kontrol Motor 3 Fasa',
      subtitle: 'Monitoring Progres Praktikum'
    },
  ];

  // ════════════════════════════════════════════════════════
  // TAMPILAN UI (ARSITEKTUR UTAMA)
  // ════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* ═══ HEADER DENGAN TOMBOL LOGOUT ════════════════════ */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerSub}>Portal Praktikum</Text>
            <Text style={styles.headerTitle}>Teknik Otomasi Industri</Text>
          </View>
          
          {/* Tombol Logout Baru */}
          <TouchableOpacity 
            onPress={handleLogout} 
            activeOpacity={0.7} 
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'Job Sheets' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('Job Sheets')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'Job Sheets' && styles.tabTextActive]}>Job Sheets</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'Jadwal Kuliah' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('Jadwal Kuliah')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'Jadwal Kuliah' && styles.tabTextActive]}>Jadwal Kuliah</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══ KONTEN: Kolom Pencarian & Daftar Kartu ═════════ */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInputWrapper}
            placeholder={activeTab === 'Job Sheets' ? "Cari Modul Praktikum..." : "Cari: Senin, PLC, Lab..."}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.cardsContainer}>
          {/* Tampilan Tab Job Sheets */}
          {activeTab === 'Job Sheets' ? (
            jobSheets.map((job) => (
              <TouchableOpacity 
                key={job.id} 
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Kanban', { modul: job })}
              >
                <View style={styles.cardAccent} />
                <View style={styles.cardIconWrapper}><Text style={styles.cardIcon}>{job.icon}</Text></View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{job.title}</Text>
                  <Text style={styles.detailText}>📅 Deadline: {job.deadline}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            /* Tampilan Tab Jadwal Kuliah */
            isLoading ? (
              <ActivityIndicator size="large" color="#0f172a" style={{ marginTop: 40 }} />
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                // 🌟 PERUBAHAN: View menjadi TouchableOpacity dengan onPress memanggil bukaLMS
                <TouchableOpacity 
                  key={index} 
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={bukaLMS}
                >
                  <View style={styles.cardAccent} />
                  <View style={styles.cardContent}>
                    <Text style={styles.hariText}>{item.hari}</Text>
                    <Text style={styles.cardTitle}>{item.nama_mk}</Text>
                    <Text style={styles.detailText}>🕒 {item.waktu}  |  📍 {item.kode_ruang}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Jadwal tidak ditemukan.</Text>
            )
          )}
        </View>
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

// ════════════════════════════════════════════════════════
// GAYA VISUAL (STYLESHEET)
// ════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e8f0' },
  
  // Header Styles
  header: { backgroundColor: '#0f172a', padding: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#d97706', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  headerSub: { color: '#94a3b8', fontSize: 12, marginBottom: 2, letterSpacing: 0.5 },
  headerTitle: { color: '#ffffff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  
  // Style Tombol Logout
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  logoutIcon: { fontSize: 18 },
  
  // Tabs Styles
  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 30, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 26 },
  tabBtnActive: { backgroundColor: '#1e293b', elevation: 2 },
  tabText: { color: '#475569', fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#ffffff', fontWeight: 'bold' },
  
  // Content Styles
  content: { flex: 1, paddingHorizontal: 20 },
  searchContainer: { marginTop: 24 },
  searchInputWrapper: { backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#cbd5e1', fontSize: 15, color: '#0f172a', elevation: 1 },
  
  // Card Styles
  cardsContainer: { marginTop: 20, gap: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, flexDirection: 'row', padding: 18, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardAccent: { width: 4, backgroundColor: '#d97706', marginRight: 16, borderRadius: 4 },
  cardIconWrapper: { width: 50, height: 50, backgroundColor: '#f8fafc', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  cardIcon: { fontSize: 24 },
  cardContent: { flex: 1, justifyContent: 'center' },
  hariText: { fontWeight: 'bold', color: '#d97706', fontSize: 12, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 6, lineHeight: 22 },
  detailText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  
  // Empty State
  emptyText: { textAlign: 'center', marginTop: 40, color: '#64748b', fontSize: 15, fontWeight: '500' }
});