import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import DrawerNavigationRoutes from './Screen/DrawerNavigationRoutes';
import LeaveManagement from './Screen/Components/LeaveManagement';
import LeaveForm from './Screen/Components/LeaveForm';
import LeaveHistory from './Screen/Components/LeaveHistory';
import LeaveApprovalScreen from './Screen/Components/LeaveApprovalScreen';
import Compliance from './Screen/Components/Compliance';
import ComplianceReport from './Screen/Components/ComplianceReport';
import CameraComponent from './Screen/Components/CameraComponent';
import ComplianceInbox from './Screen/Components/ComplianceInbox';
//import TestComponent from './Screen/Components/TestComponent';
import ProfileScreen from './Screen/Components/ProfileScreen';
import SalarySlip from './Screen/Components/SalarySlip';
import VerifyFace from './Screen/Components/VerifyFace';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator>
      {/* initialRouteName="LoginScreen" */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#AE275F', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/*initialRouteName="SplashScreen" SplashScreen which will come once for 5 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        />
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        {/* Navigation Drawer as a landing page */}
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LeaveScreen"
          component={LeaveManagement}
          options={{
            title:'Leave Management',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="applyLeave"
          component={LeaveForm}
          options={{
            title:'Apply Leave',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="LeaveHistory"
          component={LeaveHistory}
          options={{
            title:'Leave History',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="LeaveApproval"
          component={LeaveApprovalScreen}
          options={{
            title:'Leave Approve',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Compliance"
          component={Compliance}
          options={{
            title:'Compliance',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ComplianceReport"
          component={ComplianceReport}
          options={{
            title:'Compliance Report',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />

         <Stack.Screen
          name="ComplianceInbox"
          component={ComplianceInbox}
          options={{
            headerStyle: {
              title:'Compliance Inbox',
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="Camera"
          component={CameraComponent}
          options={{
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />

         <Stack.Screen
          name="TestComponent"
          component={TestComponent}
          options={{
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="SalarySlip"
          component={SalarySlip}
          options={{
            title:'Salary Slip',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="VerifyFace"
          component={VerifyFace}
          options={{
            title:'Verify Face',
            headerStyle: {
              backgroundColor: '#AE275F',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>

      {/* <Tab.Navigator>
          <Tab.Screen name="SalarySlip" component={SalarySlip} />
          <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator> */}
    </NavigationContainer>
  );
};

export default App;
