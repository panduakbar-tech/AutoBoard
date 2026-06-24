import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HolidayChecker from '../components/HolidayChecker';

const KANBAN_COLUMNS = [
  { id: 'todo', label: 'TO DO', color: '#64748b', icon: '📋', count: 2 },
  { id: 'wiring', label: 'WIRING', color: '#3b82f6', icon: '🔌', count: 1 },
  { id: 'testing', label: 'TESTING', color: '#a855f7', icon: '🔬', count: 0 },
];

const PLACEHOLDER_TASKS = {
  todo: ['Sambungan Kontaktor & Relay', 'Setting Timer Overload'],
  wiring: ['Wiring & Relay'],
  testing: [],
};

export default function KanbanScreen({ route, navigation }) {
  const modul = route?.params?.modul;
  const modulTitle = modul?.kanbanTitle || 'PLC Programming (Omron CP1E)';
  const modulSub = modul?.subtitle || 'Monitoring Progres Praktikum';

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER NAVY */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoAo}>
            <Text style={styles.logoAoText}>AO</Text>
            <Text style={styles.logoAoGear}>⚙️</Text>
          </View>
          <View style={styles.headerTextBlock}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerLabel}>MODUL AKTIF</Text>
              <Text style={styles.headerSettings}>⚙️</Text>
            </View>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle} numberOfLines={1}>{modulTitle}</Text>
              <Text style={styles.factoryIcon}>🏭</Text>
            </View>
            <Text style={styles.headerSub}>{modulSub}</Text>
          </View>
        </View>

        {/* PROGRESS BAR BESAR */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '60%' }]}>
              <Text style={styles.progressFillText}>60%</Text>
            </View>
          </View>
          <Text style={styles.progressText}>Progress: 3/5 task selesai</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* INFO BANNER ORANYE */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            🔥 Realtime onSnapshot() Firestore diintegrasikan di Tahap 8
          </Text>
        </View>

        {/* HOLIDAY CHECKER */}
        <View style={styles.section}>
          <HolidayChecker />
        </View>

        {/* KANBAN BOARD */}
        <View style={styles.sectionKanban}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.gridIcon}>▦</Text>
              <Text style={styles.sectionTitle}>Kanban Board</Text>
            </View>
            <Text style={styles.sectionHint}>geser →</Text>
          </View>

          <View style={styles.kanbanWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardContainer}>
              {KANBAN_COLUMNS.map((col) => {
                const tasks = PLACEHOLDER_TASKS[col.id] || [];
                return (
                  <View key={col.id} style={styles.column}>
                    {/* Header Kolom Warna */}
                    <View style={[styles.columnHeader, { backgroundColor: col.color }]}>
                      <View style={styles.columnHeaderLeft}>
                        <Text style={styles.columnIcon}>{col.icon}</Text>
                        <Text style={styles.columnTitle}>{col.label}</Text>
                      </View>
                      <View style={styles.badgeCol}>
                        <Text style={styles.badgeColText}>{col.count}</Text>
                      </View>
                    </View>

                    {/* Task Cards */}
                    <View style={styles.columnBody}>
                      {tasks.length > 0 ? tasks.map((task, i) => (
                        <View key={i} style={styles.taskCard}>
                          <Text style={styles.taskText}>{task}</Text>
                        </View>
                      )) : (
                        <View style={styles.emptyCard}>
                          <Text style={styles.emptyText}>Kosong</Text>
                        </View>
                      )}
                      
                      {/* Tombol Tambah */}
                      <TouchableOpacity style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+ Tambah</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.goBack()}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navText}>Job Sheets</Text>
        </TouchableOpacity>
        <View style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navIcon, styles.navIconActive]}>📊</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Tugas</Text>
          <View style={styles.navIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  // NAVY HEADER
  header: { backgroundColor: '#0f172a', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logoAo: { width: 44, height: 44, backgroundColor: '#ffffff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', position: 'relative', transform: [{ rotate: '45deg' }] },
  logoAoText: { color: '#0f172a', fontWeight: '900', fontSize: 16, transform: [{ rotate: '-45deg' }] },
  logoAoGear: { position: 'absolute', bottom: -5, right: -5, fontSize: 12, transform: [{ rotate: '-45deg' }] },
  
  headerTextBlock: { flex: 1 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLabel: { fontSize: 10, color: '#f97316', fontWeight: 'bold', letterSpacing: 1 },
  headerSettings: { fontSize: 14, opacity: 0.8 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginRight: 8 },
  factoryIcon: { fontSize: 20 },
  headerSub: { fontSize: 11, color: '#cbd5e1' },

  progressSection: { marginTop: 8 },
  progressTrack: { height: 16, backgroundColor: '#1e293b', borderRadius: 8, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  progressFillText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  progressText: { fontSize: 11, color: '#cbd5e1', fontWeight: '500' },

  scrollContent: { paddingBottom: 32 },
  
  infoBanner: { backgroundColor: '#ffedd5', paddingVertical: 10, paddingHorizontal: 16 },
  infoBannerText: { color: '#c2410c', fontSize: 12, fontWeight: '600', textAlign: 'center' },

  section: { paddingHorizontal: 16 },
  sectionKanban: { marginTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  gridIcon: { fontSize: 20, color: '#0f172a' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  sectionHint: { fontSize: 12, color: '#64748b' },

  // KANBAN COLUMNS
  kanbanWrapper: { height: 350 },
  boardContainer: { gap: 12, paddingLeft: 16, paddingRight: 16 },
  column: { width: 160, backgroundColor: '#e2e8f0', borderRadius: 10, overflow: 'hidden' },
  columnHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 12 },
  columnHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  columnIcon: { fontSize: 12 },
  columnTitle: { fontSize: 12, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  badgeCol: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  badgeColText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff' },
  
  columnBody: { padding: 8, flex: 1 },
  taskCard: { backgroundColor: '#ffffff', borderRadius: 6, padding: 10, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  taskText: { fontSize: 12, color: '#334155', lineHeight: 18, fontWeight: '500' },
  emptyCard: { padding: 10, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, marginBottom: 8 },
  emptyText: { fontSize: 12, color: '#94a3b8' },
  
  addBtn: { alignItems: 'center', paddingVertical: 8, marginTop: 'auto' },
  addBtnText: { fontSize: 12, color: '#475569', fontWeight: '600' },

  // BOTTOM NAV
  bottomNav: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingBottom: 4, elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  navIcon: { fontSize: 22, color: '#94a3b8', marginBottom: 2 },
  navText: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  navIconActive: { color: '#0f172a' },
  navTextActive: { color: '#0f172a', fontWeight: 'bold' },
  navIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 3, backgroundColor: '#f97316', borderRadius: 2 },
});