import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Import Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

// ── Helpers validasi client-side ─────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPassword = (v) => v.length >= 6;

// ════════════════════════════════════════════════════════════
//  MAPPING ERROR FIREBASE → BAHASA INDONESIA
// ════════════════════════════════════════════════════════════
const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/user-disabled':
      return 'Akun ini telah dinonaktifkan. Hubungi admin.';
    case 'auth/user-not-found':
      return 'Email tidak terdaftar. Periksa kembali.';
    case 'auth/wrong-password':
      return 'Kata sandi salah. Silakan coba lagi.';
    case 'auth/invalid-credential':
      return 'Email atau kata sandi salah. Periksa kembali.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Coba lagi nanti.';
    case 'auth/network-request-failed':
      return 'Tidak ada koneksi internet. Periksa jaringan Anda.';
    default:
      return 'Login gagal. Silakan coba lagi.';
  }
};

export default function LoginScreen({ navigation }) {
  // Gunakan email test yang sudah kamu buat di Firebase
  const [email, setEmail] = useState('haikaldzikri@student.ppns.ac.id');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', firebase: '' });

  const passwordRef = useRef(null);

  // ── Validasi client-side (sebelum hit Firebase) ────────────
  const validate = () => {
    const err = { email: '', password: '', firebase: '' };
    let ok = true;
    if (!email.trim()) {
      err.email = 'Email tidak boleh kosong';
      ok = false;
    } else if (!isValidEmail(email)) {
      err.email = 'Format email tidak valid';
      ok = false;
    }
    if (!password) {
      err.password = 'Kata sandi tidak boleh kosong';
      ok = false;
    } else if (!isValidPassword(password)) {
      err.password = 'Kata sandi minimal 6 karakter';
      ok = false;
    }
    setErrors(err);
    return ok;
  };

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: '', firebase: '' }));

  // ════════════════════════════════════════════════════════════
  //  HANDLING LOGIN FIREBASE
  // ════════════════════════════════════════════════════════════
  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('[Auth] Login berhasil untuk:', email);
      // Jika berhasil, AppNavigator akan otomatis memindahkan ke JobSheet 
      // karena adanya onAuthStateChanged di AppNavigator.js
      navigation.replace('JobSheet');
    } catch (err) {
      console.log('[Auth] Login gagal:', err.code);
      setErrors((prev) => ({
        ...prev,
        firebase: getAuthErrorMessage(err.code),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        <View style={styles.mobileWrapper}>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain" 
            />
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>AutoBoard</Text>
            <Text style={styles.subtitle}>Akses Proyek & Modul Praktikum</Text>
          </View>

          <View style={styles.formContainer}>
            {/* ── Pesan Error Firebase (Muncul jika ada error dari server) ─────────── */}
            {errors.firebase ? (
              <View style={styles.firebaseErrorBox}>
                <Text style={styles.firebaseErrorIcon}>⚠️</Text>
                <Text style={styles.firebaseErrorText}>{errors.firebase}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Kampus</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="nama@kampus.ac.id"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={(t) => { setEmail(t); clearError('email'); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  editable={!isLoading}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>⚠ {errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(t) => { setPassword(t); clearError('password'); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.eyeBtn}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>⚠ {errors.password}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.loginBtn, isLoading && styles.btnDisabled]} 
              onPress={handleLogin} 
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>MASUK</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity><Text style={styles.linkText}>Daftar Akun Baru</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.linkText}>Lupa Sandi?</Text></TouchableOpacity>
            </View>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' }, 
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  mobileWrapper: { width: '100%', maxWidth: 380, backgroundColor: '#ffffff', padding: 32, borderRadius: 32, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 25, elevation: 10 },
  
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 120, height: 120 }, 
  
  headerContainer: { alignItems: 'center', marginBottom: 36 },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a', letterSpacing: 0.5, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  
  formContainer: { width: '100%' },
  
  // Gaya khusus untuk Firebase Error
  firebaseErrorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#f87171', marginBottom: 15 },
  firebaseErrorIcon: { marginRight: 8, fontSize: 16 },
  firebaseErrorText: { color: '#ef4444', fontSize: 12, fontWeight: '600', flex: 1 },
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 8, marginLeft: 2 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10, height: 52, paddingHorizontal: 14 },
  inputError: { borderColor: '#ef4444' }, // Garis merah jika error
  input: { flex: 1, fontSize: 14, color: '#0f172a', fontWeight: '500', height: '100%', outlineStyle: 'none' },
  
  errorText: { color: '#ef4444', fontSize: 11, fontWeight: '600', marginTop: 4, marginLeft: 4 },
  
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16, opacity: 0.6 },
  
  loginBtn: { backgroundColor: '#0f172a', flexDirection: 'row', borderRadius: 10, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  btnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingHorizontal: 4 },
  linkText: { color: '#0369a1', fontSize: 12, fontWeight: '600' },
});