import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const EnduranceCard = () => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name="running" size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Endurance</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: '60%', backgroundColor: theme.colors.primary }]} />
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>Run 5K - 2 Weeks Left</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default EnduranceCard;