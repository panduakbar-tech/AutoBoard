import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SplashScreen() {
  // Mengamankan kode warna agar jika belum didefinisikan di colors.js tidak membuat aplikasi crash
  const primaryColor = COLORS?.primary || '#0f172a';
  const secondaryColor = COLORS?.secondary || '#1e293b';
  const accentColor = COLORS?.accent || '#f97316'; 
  const whiteColor = COLORS?.white || '#ffffff';
  const grayColor = COLORS?.gray || '#94a3b8';

  return (
    <View style={[styles.container, { backgroundColor: primaryColor }]}>
      <View style={[styles.logoBox, { backgroundColor: secondaryColor, borderColor: accentColor }]}>
        <Text style={styles.logoEmoji}>⚙️</Text>
      </View>
      <Text style={[styles.appName, { color: whiteColor }]}>AutoBoard</Text>

      <ActivityIndicator
        size="small"
        color={accentColor}
        style={styles.spinner}
      />
      <Text style={[styles.statusText, { color: grayColor }]}>Memeriksa sesi login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 84, 
    height: 84,
    borderRadius: 18,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontSize: 26, 
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  spinner:    { marginTop: 22 },
  statusText: { fontSize: 12, marginTop: 10 },
});