import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      AsyncStorage.getItem('userId').then((value) =>
        navigation.replace(
          value === null ? 'Auth' : 'DrawerNavigationRoutes'
        ),
      );
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../Image/payrolimage.png')}
        style={{width: '90%', resizeMode: 'contain', margin: 30}}
      />
      <Text style={styles.titleStyle}>Pune Municipal Corporation</Text>
      <Text style={styles.titleStyle1}>Payroll Management System</Text>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  titleStyle:{
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleStyle1:{
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  }
});