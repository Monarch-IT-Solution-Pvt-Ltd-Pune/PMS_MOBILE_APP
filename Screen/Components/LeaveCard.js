import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ScrollView } from 'react-native';
import baseurl from '../BaseUrl/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastManager, { Toast } from 'toastify-react-native'

const LeaveCard = ({ tldId,employeeCode,employeeName, leaveType, fromDate, toDate, appliedLeaveCount, }) => {
    
  const [hodRemark,setHodRemark]=useState('');
  const [userId,setUserId]=useState('');
  useEffect(() => {
    fetchUserDetails()
  }, []);
  const fetchUserDetails=async()=>{
    const userId = await AsyncStorage.getItem('userId');
    setUserId(userId);
  }

  const onApprove = async (tldId, remark) => {
    try {
      const response = await fetch(
        baseurl + `/sanctionLeaveByHodMobile?tldId=${tldId}&remark=${remark}&userId=${userId}`,
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
  
      const responseJson = await response.json();
      if(responseJson.status){

      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const onReject = async (tldId, remark) => {
    try {
      const response = await fetch(
        baseurl + `/rejectLeaveByHodMobile?tldId=${tldId}&remark=${remark}&userId=${userId}`,
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
  
      const responseJson = await response.json();
      console.log(responseJson.status);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  return (
    <ScrollView>
    <ToastManager />
    <View style={styles.card}>
      <Text style={styles.label}>Employee Code:</Text>
      <Text style={styles.text}>{employeeCode}</Text>

      <Text style={styles.label}>Employee Name:</Text>
      <Text style={styles.text}>{employeeName}</Text>

      <Text style={styles.label}>Leave Type:</Text>
      <Text style={styles.text}>{leaveType}</Text>

      <Text style={styles.label}>From Date:</Text>
      <Text style={styles.text}>{fromDate}</Text>

      <Text style={styles.label}>To Date:</Text>
      <Text style={styles.text}>{toDate}</Text>

      <Text style={styles.label}>Applied Leave Count:</Text>
      <Text style={styles.text}>{appliedLeaveCount}</Text>

      <Text style={styles.label}>HOD Remark:</Text>
      <TextInput
       style={styles.input}
        multiline
        value={hodRemark}
        placeholder="Enter HOD Remark"
        onChangeText={(text) => setHodRemark(text)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={() => onApprove(tldId, hodRemark)}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rejectButton} onPress={() => onReject(tldId, hodRemark)}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'black',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dadae8',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  approveButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LeaveCard;
