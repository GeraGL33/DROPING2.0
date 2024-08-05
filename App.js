import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './navigation/Tabs';
import ReportsScreen from './navigation/screens/ReportsScreen'; // Asegúrate de que la ruta sea correcta

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{ title: 'Reportes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;