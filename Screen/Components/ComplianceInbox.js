import React, { useEffect, useState } from 'react';
import LeaveCard from "./LeaveCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseurl from '../BaseUrl/Baseurl';
import { View,ScrollView } from 'react-native';
import ComplianceCard from './ComplianceCard';

const ComplianceInbox = () => {
  
    useEffect(() => {
        fetchComplainsForHod();
    }, []);

  const [complainceData, setComplainceData] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchComplainsForHod = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await fetch(baseurl + `/fetchComplains/?userId=${userId}`,
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
      console.log(responseJson.lstComplainsTransanction);
      
      setComplainceData(responseJson.lstComplainsTransanction);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <ScrollView>
    <View>
      {complainceData.map((complainceEntry, index) => (
        <ComplianceCard
          key={index}
          tldId={complainceEntry.mc_id}
          employeeCode={complainceEntry.mc_emp_id.emp_code}
          employeeName={complainceEntry.mc_emp_id.emp_fname_en+" "+complainceEntry.mc_emp_id.emp_mname_en+" "+complainceEntry.mc_emp_id.emp_lname_en}
          reason={complainceEntry.mc_mr_id.mr_name_en}
          complaindate={formatDate(complainceEntry.mc_date)} // Now, fromDate is already formatte
        />
      ))}
    </View>
    </ScrollView>
  );
};

export default ComplianceInbox;
