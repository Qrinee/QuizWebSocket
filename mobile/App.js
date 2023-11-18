import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { HomeScreen } from './views/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { LobbyScreen } from './views/LobbyScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GameScreen } from './views/GameScreen';

const {Navigator, Screen} = createStackNavigator()

const HomeNavigator = () => (
  <Navigator screenOptions={{ headerShown: false }}>
    <Screen name='Home' component={HomeScreen} />
    <Screen name='Lobby' component={LobbyScreen} />
    <Screen name='Game' component={GameScreen} />
  </Navigator>
);

export default () => (
  <ApplicationProvider {...eva} theme={eva.dark}>
    <NavigationContainer>
      <HomeNavigator />
    </NavigationContainer>
  </ApplicationProvider>
);