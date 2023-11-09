import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import FancyCard from '../Components/FancyCard';

const HomeScreen = () => {
  const cardData = [
  {
    id: 1,
    src: require('../Images/profile.png'),
    text: "My Profile",
    url: "PROFILE",
  },
  {
    id: 2,
    src: require('../Images/salarySlip.png'), // Remove "require" here
    text: "Salary Slip",
    url: "SLIP",
  },
  {
    id: 3,
    src: require('../Images/leave.png'), // Remove "require" here
    text: "Leave Application",
    url: "LEAVE",
  },
  {
    id: 4,
    src: require('../Images/compliance.png'), // Remove "require" here
    text: "Compliance",
    url: "COMPLIANCE", // Corrected the typo in "Compliance"
  },
  {
    id: 5,
    src: require('../Images/compliance.png'), // Remove "require" here
    text: "Verify Face",
    url: "VERIFYFACE", // Corrected the typo in "Compliance"
  },
];


  useEffect(() => {
  
  }, []);

  return (
    <SafeAreaView style={styles.container}>
       <FlatList
        data={cardData}
        renderItem={({item}) => (
          <FancyCard item={item}/>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
      /> 
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});