import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function UbyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Uby</Text>
        <Text style={styles.subtitle}>Your Uber Assistant</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>$47.50</Text>
            <Text style={styles.statusLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>4.8★</Text>
            <Text style={styles.statusLabel}>Rating</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>Online</Text>
            <Text style={styles.statusLabel}>Status</Text>
          </View>
        </View>
      </View>

      {/* Chat Area */}
      <View style={styles.chatContainer}>
        <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              Hi! I noticed you've been driving for 3 hours. How about taking a 15-minute break? There's a great coffee shop 2 minutes away that's popular with drivers.
            </Text>
            <Text style={styles.messageTime}>2 min ago</Text>
          </View>
          
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              💡 Pro tip: The area around Central Station is getting busy. You might want to head there for better ride opportunities!
            </Text>
            <Text style={styles.messageTime}>5 min ago</Text>
          </View>
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Ask Uby</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>View Insights</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  chatContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  chatMessages: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
