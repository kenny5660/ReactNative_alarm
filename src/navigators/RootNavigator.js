import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AlarmListScreen } from '../screens/AlarmListScreen';


const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'alarm_list'}>
            <Stack.Screen name={'Alarms'} component={AlarmListScreen} />
        </Stack.Navigator>

    );
};

export default RootNavigator;