import React, { useState, useEffect } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';

export default function Index() {
  const [cityWeatherList, setCityWeatherList] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const additionalCities = [
    { name: "New York", latitude: 40.7128, longitude: -74.0060 },
    { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    { name: "Boston", latitude: 42.3601, longitude: -71.0589 },
    { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
    { name: "Seattle", latitude: 47.6062, longitude: -122.3321 },
    { name: "Philadelphia", latitude: 39.9526, longitude: -75.1652 },
    { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
    { name: "Washington DC", latitude: 38.9072, longitude: -77.0369 },
    { name: "Houston", latitude: 29.7604, longitude: -95.3698 },
  ];

  // Fetch weather from OpenWeather API
  const fetchWeather = async (latitude: number, longitude: number, cityName: string) => {
    const apiKey = '091e1738662c7c3525c78076b6cac6d0';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        const cityWeather = {
          name: cityName,
          temp: `${data.main.temp.toFixed(1)}°F`,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} MPH`,
          feelsLike: `${data.main.feels_like.toFixed(1)}°F`,
          pressure: `${data.main.pressure} hPa`,
        };

        setCityWeatherList(prev => [...prev.filter(c => c.name !== cityName), cityWeather]);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  // Get location and weather data
  useEffect(() => {
    const getLocationAndFetchWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Fetch current location weather first
      await fetchWeather(latitude, longitude, 'Your Location');

      // Then fetch other cities
      for (const city of additionalCities) {
        await fetchWeather(city.latitude, city.longitude, city.name);
      }

      setLoading(false);
    };

    getLocationAndFetchWeather();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'}}>
        Weather in Your Location & Other Cities
      </Text>

      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={cityWeatherList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/CityDetail',
                  params: { cityData: JSON.stringify(item) },
                })
              }
            >
              <View
                style={{
                  padding: 12,
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderColor: '#f24b4bff',
                  width: 300,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '500' }}>{item.name}</Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png` }}
                  style={{ width: 50, height: 50 }}
                />
                <Text>Temp: {item.temp}</Text>
                <Text>Conditions: {item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

 