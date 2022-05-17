import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
//import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigators/RootNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}


