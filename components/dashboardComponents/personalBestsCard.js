import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const PersonalBestsCard = () => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name="star" size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Personal Bests</Text>
      </View>
      <View style={styles.contentRow}>
        <View>
          <Text style={[styles.mainText, { color: theme.colors.text }]}>Squat 200 lbs</Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>Achieved 5 days ago</Text>
        </View>
      </View>
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
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});

export default PersonalBestsCard;