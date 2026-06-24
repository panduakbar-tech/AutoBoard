import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

// Konfigurasi & Konstanta
import { COLORS } from '../constants/colors';
import { auth } from '../services/firebaseConfig';

// Mengambil layar dari folder screens
import JobSheetScreen from '../screens/JobSheetScreen';
import KanbanScreen from '../screens/KanbanScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // ── State untuk mengecek sesi Firebase ─────────────────────
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    // Firebase secara otomatis mengecek apakah ada sesi login yang tersimpan
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Token valid ditemukan → user sudah login sebelumnya
        console.log('[Auth] Sesi ditemukan:', firebaseUser.email);
        setInitialRoute('JobSheet');
      } else {
        // Tidak ada token / user sudah logout
        console.log('[Auth] Tidak ada sesi aktif');
        setInitialRoute('Login');
      }
      setIsCheckingSession(false);
    });

    // Membersihkan listener saat komponen dilepas (unmount)
    return unsubscribe;
  }, []);

  // ── Selama Firebase masih mengecek, tampilkan SplashScreen ──
  if (isCheckingSession) {
    return <SplashScreen />;
  }

  // ── Jika pengecekan selesai, tampilkan Navigator ────────────
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle:      { backgroundColor: COLORS.primary },
        headerTintColor:  COLORS.white,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        animation:        'slide_from_right',
      }}
    >
      {/* Layar Login (Full Screen) */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Layar Job Sheet & Jadwal */}
      <Stack.Screen
        name="JobSheet"
        component={JobSheetScreen}
        // headerBackVisible: false mencegah user kembali ke layar login dengan tombol/swipe back
        options={{ title: 'AutoBoard', headerBackVisible: false }}
      />

      {/* Layar Kanban Board */}
      <Stack.Screen
        name="Kanban"
        component={KanbanScreen}
        options={{ title: 'Kanban Board', headerBackTitle: 'Kembali' }}
      />
    </Stack.Navigator>
  );
}