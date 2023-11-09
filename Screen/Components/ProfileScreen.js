import React, {useState,useEffect} from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseurl from '../BaseUrl/Baseurl';

const ProfileScreen = () => {

  useEffect(() => {
    fetchEmpData();
  }, []);

  const [employeeMaster,setEmployeeMaster]=useState({});
  const [loading, setLoading] = useState(false);
  const fetchEmpData=async()=>{
    const empId = await AsyncStorage.getItem('empId');
    setLoading(true);
    try {
      const response = await fetch(
        baseurl + `/getDataforProfile/?empId=${empId}`,
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
      setLoading(false);
      setEmployeeMaster(responseJson.employeeMaster);
      console.log(employeeMaster);
      
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
    }
  }

  function convertDateToDDMMYYYY(originalDate) {
    const date = new Date(originalDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const year = date.getFullYear();
  
    // Use template literals to format the date as "dd-mm-yyyy"
    return `${day}-${month}-${year}`;
  }
  

  return (
    <View style={styles.card}>
    <Loader loading={loading} />
      {/* <Image
        style={styles.profileImage}
        source={{ uri: employeeMaster.profileImage }}
      /> */}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Employee Name :</Text>
        <Text style={styles.text}>{employeeMaster.emp_fname_en} {employeeMaster.emp_lname_en}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Emp. Code :</Text>
        <Text style={styles.text}>{employeeMaster.emp_code}</Text>
      </View>

      {/* <View style={styles.infoContainer}>
        <Text style={styles.label}>Department:</Text>
        <Text style={styles.text}>{employeeMaster.emp_md_id}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Designation :</Text>
        <Text style={styles.text}>{employeeMaster.emp_mdes_id}</Text>
      </View> */}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Aadhar No :</Text>
        <Text style={styles.text}>{employeeMaster.emp_aadhar_no}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>PAN No :</Text>
        <Text style={styles.text}>{employeeMaster.emp_pan_no}</Text>
      </View>

      {/* <View style={styles.infoContainer}>
        <Text style={styles.label}>Pay Matrix :</Text>
        <Text style={styles.text}>{employeeMaster.emp_mps_id.mps_range_from} - {employeeMaster.emp_mps_id.mps_range_to}</Text>
      </View> */}

      {/* <View style={styles.infoContainer}>
        <Text style={styles.label}>Employee Class :</Text>
        <Text style={styles.text}>{employeeMaster.emp_mdes_id.mdes_mec_id.mec_name_eng}</Text>
      </View> */}

      {/* <View style={styles.infoContainer}>
        <Text style={styles.label}>Blood Group :</Text>
        <Text style={styles.text}>{employeeMaster.emp_mbg_id.mbgNameEng}</Text>
      </View> */}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Mobile No. :</Text>
        <Text style={styles.text}>{employeeMaster.emp_mobile_no}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>GPF No. :</Text>
        <Text style={styles.text}>{employeeMaster.emp_gpf_no}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>CPF No. :</Text>
        <Text style={styles.text}>{employeeMaster.emp_cpf_no}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Basic :</Text>
        <Text style={styles.text}></Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Grade Pay :</Text>
        <Text style={styles.text}></Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Joining Date :</Text>
        <Text style={styles.text}>{convertDateToDDMMYYYY(employeeMaster.emp_apt_date)}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Retirement Date :</Text>
        <Text style={styles.text}>{convertDateToDDMMYYYY(employeeMaster.emp_retirement_date)}</Text>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    alignSelf: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  text: {
    flex: 2,
    fontSize: 16,
    color: 'black',
  },
});

export default ProfileScreen;
