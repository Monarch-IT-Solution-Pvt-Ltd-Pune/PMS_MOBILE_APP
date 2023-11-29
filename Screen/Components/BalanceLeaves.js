import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BalanceLeaves = () => {
  const boxData = [
    {
      id: '1',
      count: '10',
      boxName: 'Casual Leave',
      boxColor: '#FF6B6B', // Red
    },
    {
      id: '2',
      count: '8',
      boxName: 'Earned Leave',
      boxColor: '#FFD166', // Yellow
    },
    {
      id: '3',
      count: '25',
      boxName: 'Medical Leave',
      boxColor: '#EF476F', // Pink
    },
    {
      id: '4',
      count: '4',
      boxName: 'Special Leave',
      boxColor: '#06D6A0', // Green
    },
    {
      id: '5',
      count: '1',
      boxName: 'Maternity Leave',
      boxColor: '#118AB2', // Blue
    },
    {
      id: '6',
      count: '13',
      boxName: 'Optional Leave',
      boxColor: '#118BK8', // Blue
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balance Leaves</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.columnContainer}>
          {boxData.map((box) => (
            <View
              key={box.id}
              style={[styles.box, { backgroundColor: box.boxColor }]}>
              <Text style={styles.boxName}>{box.boxName}</Text>
              <Text style={styles.boxCount}>{box.count}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
  },
  columnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Updated to flex-start
  },
  box: {
    width: 70,
    height: 70,
    marginVertical: 10,
    marginHorizontal: 15, // Added marginHorizontal for spacing
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  boxName: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  boxCount: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
});

export default BalanceLeaves;
