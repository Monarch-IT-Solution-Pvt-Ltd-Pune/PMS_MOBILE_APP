import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, Image } from 'react-native';
import FancyCard from '../Components/FancyCard';
import img from '../Images/bg.jpg';

const HomeScreen = () => {
  const cardData = [
    {
      id: 1,
      src: require('../Images/employee.png'),
      text: 'My Profile',
      url: 'PROFILE',
    },
    {
      id: 2,
      src: require('../Images/SalarySlip1.png'), // Remove "require" here
      text: 'Salary Slip',
      url: 'SLIP',
    },
    {
      id: 3,
      src: require('../Images/Empleave.png'), // Remove "require" here
      text: 'Leave Application',
      url: 'LEAVE',
    },
    {
      id: 4,
      src: require('../Images/comp.png'), // Remove "require" here
      text: 'Compliance',
      url: 'COMPLIANCE', // Corrected the typo in "Compliance"
    },
    {
      id: 5,
      src: require('../Images/verify.png'), // Remove "require" here
      text: 'Verify Face',
      url: 'VERIFYFACE', // Corrected the typo in "Compliance"
    },
    {
      id: 6,
      src: require('../Images/form.png'), // Remove "require" here
      text: 'Form 16',
      url: 'Form16', // Corrected the typo in "Compliance"
    },
  ];

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image source={img} style={styles.bannerImage} />
      </View>
      <View>
        <FlatList
          data={cardData}
          renderItem={({ item }) => (
            <FancyCard style={[styles.cardContainer]} item={item} />
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()} // Changed to index.toString() for the keyExtractor
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    margin: 5,
    marginTop:-70,
  },
  cardContainer: {
   // marginTop:10,
  },
  bannerContainer: {
    height: 170,
    marginBottom:-130,
  },
  bannerImage: {
    flex: 3,
    width: '100%',
    height:'100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop:-130,
  },
});

export default HomeScreen;
