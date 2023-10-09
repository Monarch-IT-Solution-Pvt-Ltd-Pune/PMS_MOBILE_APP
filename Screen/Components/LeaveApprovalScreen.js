import React, { useEffect, useState } from 'react';
import LeaveCard from "./LeaveCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseurl from '../BaseUrl/Baseurl';
import { View,ScrollView } from 'react-native';

const LeaveApprovalScreen = () => {
  useEffect(() => {
    fetchLeavesForHod();
  }, []);

  const [leaveData, setLeaveData] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchLeavesForHod = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await fetch(
        baseurl + `/leaveHodApprovalMobile/?userId=${userId}`,
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
      console.log(responseJson.leaveEntryDtl);
      
      // Format fromDate and toDate before setting the state
      const formattedLeaveData = responseJson.leaveEntryDtl.map((entry) => ({
        ...entry,
        fromDate: formatDate(entry.tld_leave_from_date),
        toDate: formatDate(entry.tld_leave_to_date),
      }));
      
      setLeaveData(formattedLeaveData);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <ScrollView>
    <View>
      {leaveData.map((leaveEntry, index) => (
        <LeaveCard
          key={index}
          tldId={leaveEntry.tld_id}
          employeeCode={leaveEntry.tld_emp_id.emp_code}
          employeeName={leaveEntry.tld_emp_id.emp_fname_en+" "+leaveEntry.tld_emp_id.emp_mname_en+" "+leaveEntry.tld_emp_id.emp_lname_en}
          leaveType={leaveEntry.tld_mlt_id.mlt_name_eng}
          fromDate={leaveEntry.fromDate} // Now, fromDate is already formatted
          toDate={leaveEntry.toDate} // Now, toDate is already formatted
          appliedLeaveCount={leaveEntry.tld_leave_count}
        />
      ))}
    </View>
    </ScrollView>
  );
};

export default LeaveApprovalScreen;
