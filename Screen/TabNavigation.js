import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './DrawerScreens/HomeScreen';
import ProfileScreen from './Components/ProfileScreen';

const Tab = createBottomTabNavigator();
const TabNavigation=()=>{
    return (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
        </Tab.Navigator>
      );
}