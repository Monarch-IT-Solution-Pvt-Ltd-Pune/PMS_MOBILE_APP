import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseurl from '../BaseUrl/Baseurl';
import { format } from 'date-fns';
import ToastManager, { Toast } from 'toastify-react-native'
import Loader from './Loader';

const LeaveHistory = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const empId = await AsyncStorage.getItem('empId');
    setLoading(true);
    try {
      const response = await fetch(
        baseurl + `/fetchAppliedLeavesByEmpId/?empId=${empId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setLoading(false);
      const responseJson = await response.json();
      console.log(responseJson.lstEmpLeaveEntry.length);
      if(responseJson.lstEmpLeaveEntry.length<=0){
        Toast.warn('No Record History');
      }else{
        setLeaveData(responseJson.lstEmpLeaveEntry);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const [leaveData, setLeaveData] = useState([]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.heading}>My Leaves</Text>
    </View>
  );

  const renderComplainItem = ({ item }) => {
    // Parse the date strings into Date objects
    const fromDate = new Date(item.tld_leave_from_date);
    const toDate = new Date(item.tld_leave_to_date);

    // Format the Date objects using date-fns library
    const formattedFromDate = format(fromDate, 'dd/MM/yyyy');
    const formattedToDate = format(toDate, 'dd/MM/yyyy');

    return (
      <TouchableOpacity style={styles.complainItem}>
        <Text style={styles.complainName}>{item.tld_mlt_id.mlt_name_eng}</Text>
        <Text style={styles.complainDate}>From: {formattedFromDate}</Text>
        <Text style={styles.complainDate}>To: {formattedToDate}</Text>
        <Text style={styles.complainStatus}>Status:{item.tld_is_sanctioned?<Text style={{color:"green"}}>SANCTIONED</Text>:<Text style={{color:"red"}}>PENDING</Text>}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ToastManager />
      <Loader loading={loading} />
      {renderHeader()}
          <FlatList
            data={leaveData}
            renderItem={renderComplainItem}
            keyExtractor={(item) => item.tld_id}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  complainItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  complainName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black',
  },
  complainDate: {
    fontSize: 14,
    color: '#888888',
  },
  complainStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    marginLeft: 8,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heading:{
    color: 'black',
    fontSize:18,
    fontWeight: 'bold',
  }
});

export default LeaveHistory;
