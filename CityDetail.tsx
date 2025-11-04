import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CityDetail() {
  const { cityData } = useLocalSearchParams<{ cityData: string }>();
  const router = useRouter();

  if (!cityData) return <Text>No city data available</Text>;

  const city = JSON.parse(cityData);

  return (
    <View style={styles.container}>

      {/* City name and icon */}
      <Text style={styles.cityName}>{city.name}</Text>
      <Image
        style={styles.weatherIcon}
        source={{ uri: `https://openweathermap.org/img/wn/${city.icon}@4x.png` }}
      />

      {/* Weather info */}
      <Text style={styles.temp}>{city.temp}</Text>
      <Text style={styles.description}>{city.description}</Text>

      <View style={styles.detailsBox}>
        <Text style={styles.detail}>Humidity: {city.humidity}</Text>
        <Text style={styles.detail}>Wind Speed: {city.windSpeed}</Text>
        <Text style={styles.detail}>Feels Like: {city.feelsLike}</Text>
        <Text style={styles.detail}>Pressure: {city.pressure}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97c0e1ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
  },
  cityName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  temp: {
    fontSize: 28,
    fontWeight: '500',
    marginVertical: 5,
  },
  description: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 20,
  },
  detailsBox: {
    backgroundColor: '#ff8080ff',
    borderRadius: 12,
    padding: 15,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
});
