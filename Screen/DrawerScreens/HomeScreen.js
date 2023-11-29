import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import FancyCard from '../Components/FancyCard';
import BalanceLeaves from '../Components/BalanceLeaves';

const HomeScreen = () => {
  const cardData = [
  {
    id: 1,
    src: require('../Images/employee.png'),
    text: "My Profile",
    url: "PROFILE",
  },
  {
    id: 2,
    src: require('../Images/SalarySlip1.png'), // Remove "require" here
    text: "Salary Slip",
    url: "SLIP",
  },
  {
    id: 3,
    src: require('../Images/Empleave.png'), // Remove "require" here
    text: "Leave Application",
    url: "LEAVE",
  },
  {
    id: 4,
    src: require('../Images/comp.png'), // Remove "require" here
    text: "Compliance",
    url: "COMPLIANCE", // Corrected the typo in "Compliance"
  },
  {
    id: 5,
    src: require('../Images/verify.png'), // Remove "require" here
    text: "Verify Face",
    url: "VERIFYFACE", // Corrected the typo in "Compliance"
  },
  {
    id: 6,
    src: require('../Images/form.png'), // Remove "require" here
    text: "Form 16",
    url: "Form16", // Corrected the typo in "Compliance"
  },
];


  useEffect(() => {
  
  }, []);

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.pageContainer}>
        <FlatList
          data={cardData}
          renderItem={({item}) => (
            <FancyCard item={item}/>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index}
        />   
      </View>
      <BalanceLeaves />
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  pageContainer: {
    borderRadius: 10,
    marginRight: 1,
    marginLeft: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    margin:19,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 130,
  },
});