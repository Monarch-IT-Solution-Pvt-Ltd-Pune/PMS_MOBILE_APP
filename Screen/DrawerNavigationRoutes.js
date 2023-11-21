import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './DrawerScreens/HomeScreen';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import ProfileScreen from './Components/ProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const backButton = (navigation) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialCommunityIcons name="arrow-left" color="#fff" size={26} />
    </TouchableOpacity>
  );
};
const HomeScreenStack = ({ navigation }) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#AE275F', // Change the active tab text color
        inactiveTintColor: 'gray', // Change the inactive tab text color
        style: {
          backgroundColor: 'white', // Change the background color of the tab bar
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} 
       options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#AE275F', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}/>
        <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile', // Set Header Title
          headerLeft: () => backButton(navigation), // Back button
          headerStyle: {
            backgroundColor: '#AE275F', // Set Header color
          },
          headerTintColor: '#fff', // Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', // Set Header text style
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}/>
    </Tab.Navigator>
  );
};

const SettingScreenStack = ({ navigation }) => {
  return (
    <Tab.Navigator>
       <Tab.Screen name="Home" component={HomeScreen}  options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#AE275F', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}/>
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile', // Set Header Title
          headerLeft: () => backButton(navigation), // Back button
          headerStyle: {
            backgroundColor: '#AE275F', // Set Header color
          },
          headerTintColor: '#fff', // Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', // Set Header text style
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}/>
    </Tab.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: { marginVertical: 5, color: 'white' },
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={CustomSidebarMenu}
    >
      <Drawer.Screen
        name="HomeScreenStack"
        options={{ drawerLabel: 'Home' }}
        component={HomeScreenStack}
      />
      {/* <Drawer.Screen
        name="settingScreenStack"
        options={{ drawerLabel: 'Profile' }}
        component={SettingScreenStack}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
