import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import 'react-native-gesture-handler';
import Loader from './src/common/Loader';
import Chat from './src/screens/Chat';
import CreateProfile from './src/screens/CreateProfile';
import DealDetails from './src/screens/DealDetails';
import EventDetails from './src/screens/EventDetails';
import EventTracker from './src/screens/EventTracker';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import ManageDeals from './src/screens/ManageDeals';
import ManageRequests from './src/screens/ManageRequests';
import Messages from './src/screens/Messages';
import Privacy from './src/screens/Privacy';
import RequestDetails from './src/screens/RequestDetails';
import Settings from './src/screens/Settings';
import SignUp from './src/screens/SignUp';
import Splash from './src/screens/Splash';
import AddBank from './src/screens/AddBank';
import { navigationRef } from './src/routes/NavigationService';
import CallScreen from './src/screens/CallScreen';
import IncomingCallScreen from './src/screens/IncomingCallScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import UpdateProfile from './src/screens/UpdateProfile';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';


const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(false)

  EventRegister.addEventListener('loader', (value) => {
    setLoading(value)
  })

  useEffect(() => {
    global.deviceId = DeviceInfo.getUniqueId()
    askNotificationPermissions()
  }, [])


  async function askNotificationPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      // user has permissions
      initNotifications()
    } else {
      // user doesn't have permission
      try {
        await firebase.messaging().requestPermission();
        initNotifications()
        // User has authorised
      } catch (error) {
        // User has rejected permissions
        console.log(error)
        checkAgain()
      }
    }
  }

  async function checkAgain() {
    const enabled = await firebase.messaging().hasPermission();
    console.log(enabled)
    if (enabled) {
      initNotifications();
    } else {
      console.log("error", "no permission")
    }
  }

  function initNotifications() {
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          global.notiToken = fcmToken
          console.log(">>>>>>fcmToken", fcmToken)
        } else {
          console.warn("error fcmToken")
          // user doesn't have a device token yet
        }
      });

    firebase.messaging().onTokenRefresh(token => {
      global.notiToken = token
      console.log(">>>>>>", token)
    })
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={"Splash"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Splash' component={Splash} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='CreateProfile' component={CreateProfile} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='ManageRequests' component={ManageRequests} />
        <Stack.Screen name='RequestDetails' component={RequestDetails} />
        <Stack.Screen name='DealDetails' component={DealDetails} />
        <Stack.Screen name='ManageDeals' component={ManageDeals} />
        <Stack.Screen name='EventTracker' component={EventTracker} />
        <Stack.Screen name='EventDetails' component={EventDetails} />
        <Stack.Screen name='Messages' component={Messages} />
        <Stack.Screen name='Chat' component={Chat} />
        <Stack.Screen name='Settings' component={Settings} />
        <Stack.Screen name='Privacy' component={Privacy} />
        <Stack.Screen name='AddBank' component={AddBank} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        <Stack.Screen name='UpdateProfile' component={UpdateProfile} />

        <Stack.Screen name='Call' component={CallScreen} />
        <Stack.Screen name='IncomingCall' component={IncomingCallScreen} />

      </Stack.Navigator>
      <Loader visible={loading} />
    </NavigationContainer>
  )
};
