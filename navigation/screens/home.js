import React, { useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  React.useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.05,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, bounceAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Animated.Text style={[styles.title, { transform: [{ scale: bounceAnim }] }]}>
            Let’s Get Started with Your Drop Report!
          </Animated.Text>
        </Animated.View>

        <View style={styles.announcementsContainer}>
          <Animated.View style={[styles.announcementCard, { opacity: fadeAnim }]}>
            <MaterialIcons name="report-gmailerrorred" size={55} color="#64FFDA" style={styles.announcementIcon} />

            <View style={styles.announcementContent}>
              <Text style={styles.announcementTitle}>Report the Drop</Text>
              <Text style={styles.announcementDescription}>
                Scan the series and select the defects!
              </Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>How to Do It?</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View style={[styles.announcementCard, { opacity: fadeAnim }]}>
            <MaterialIcons name="verified-user" size={50} color="#64FFDA" style={styles.announcementIcon} />

            <View style={styles.announcementContent}>
              <Text style={styles.announcementTitle}>Check Generated Drop</Text>
              <Text style={styles.announcementDescription}>
                We'll keep the drop under control!
              </Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View style={[styles.announcementCard, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons name="archive-search-outline" size={50} color="#64FFDA" style={styles.announcementIcon} />
            <View style={styles.announcementContent}>
              <Text style={styles.announcementTitle}>My Reports</Text>
              <Text style={styles.announcementDescription}>
                Check your reports and compare the improvements we're making day by day!
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('ReportsScreen')}
              >
                <Text style={styles.actionButtonText}>View Reports</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  scrollView: {
    padding: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#282c34',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#64FFDA',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  announcementsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementCard: {
    backgroundColor: '#1c1f24',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  announcementIcon: {
    marginRight: 20,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64FFDA',
    marginBottom: 5,
  },
  announcementDescription: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#64FFDA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: '#282c34',
    fontSize: 14,
    fontWeight: 'bold',
  },
});