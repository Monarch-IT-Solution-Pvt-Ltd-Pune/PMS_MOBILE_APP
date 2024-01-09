import React, { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import baseurl from '../BaseUrl/Baseurl';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import ToastManager, { Toast } from 'toastify-react-native';
import Loader from './Loader';


const SalarySlip = () => {
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [billNo, setBillNo] = useState();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState([
    {
      label: "2014", value: '2014',
    },
    {
      label: "2015", value: '2015',
    },
    {
      label: "2016", value: '2016',
    },
    {
      label: "2017", value: '2017',
    },
    {
      label: "2018", value: '2018',
    },
    {
      label: "2019", value: '2019',
    },
    {
      label: "2020", value: '2020',
    },
    {
      label: "2021", value: '2021',
    },
    {
      label: "2022", value: '2022',
    },
    {
      label: "2023", value: '2023',
    }
  ]);
  const [month, setMonth] = useState([]);
  const [billType, setBillType] = useState([]);
  const [showWebView, setShowWebView] = useState(false);
  const [empId, setEmpId] = useState(null);
  const handleSubmitPress = () => {
    setShowWebView(true);
  };

  const getDataforPaySlip = async () => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      setEmpId(empId);
      const response = await fetch(baseurl + `/getDataforPaySlip`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();
      if (responseJson.msg == 'ERROR') {
        Toast.warn('Error Fetching data');
      } else {
        setMonth(responseJson.monthLst);
        setBillType(responseJson.billTypeLst);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    getDataforPaySlip();
  }, []);

  const fetchBillNo = async (billTypeId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setLoading(true);
      const response = await fetch(
        baseurl + `/fetchBillNoMobile/?billTypeId=${billTypeId}&salYear=${value}&salMonth=${value1}&userId=${userId}`,
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
      if (responseJson.msg == 'ERROR') {
        alert('Bill not available of given month or year');
        setValue1('');
      } else {
        setBillNo(responseJson.billNo.toString());
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const renderLabel1 = () => {
    if ((value || isFocus1) && !isFocus2 && !isFocus3) {
      return (
        <Text style={[styles.label1, isFocus1 && { color: 'blue' }]}>
          Salary Year
        </Text>
      );
    }
    return null;
  };

  const renderLabel2 = () => {
    if ((value1 || isFocus2) && !isFocus1 && !isFocus3) {
      return (
        <Text style={[styles.label2, isFocus2 && { color: 'blue' }]}>
          Salary Month
        </Text>
      );
    }
    return null;
  };

  const renderLabel3 = () => {
    if ((value2 || isFocus3) && !isFocus1 && !isFocus2) {
      return (
        <Text style={[styles.label3, isFocus3 && { color: 'blue' }]}>
          Bill Type
        </Text>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <Loader loading={loading} />
      {showWebView ? (
        <WebView
          source={{
            uri: `http://103.249.97.144:2926/employeePayslipMobile?tbd_code=${billNo}&salYear=${value}&salMonth=${value1}&billTypeKey=${value2}&empId=${empId}`
          }}
          style={styles.webview}
        />
      ) : (
      <>
        {renderLabel1()}
        <Dropdown
          style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]
          }
          placeholderStyle={styles.dropdownTextStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={styles.dropdownTextStyle}
          data={year}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus1 ? 'Select Year' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus1(true)}
          onBlur={() => setIsFocus1(false)}
          onChange={selectedValue => {
            setValue(selectedValue.value);
            setIsFocus1(false);
          }}
        />
        {renderLabel2()}
        <Dropdown
          style={[styles.dropdown, isFocus2 && { borderColor: 'blue' }]}
          placeholderStyle={styles.dropdownTextStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={styles.dropdownTextStyle}
          data={month}
          search
          maxHeight={300}
          labelField="config_value_en"
          valueField="config_key"
          placeholder="Select Month"
          searchPlaceholder="Search..."
          value={value1}
          onFocus={() => setIsFocus2(true)}
          onBlur={() => setIsFocus2(false)}
          onChange={selectedValue1 => {
            setValue1(selectedValue1.config_key);
            setIsFocus2(false);
          }}
        />
        {renderLabel3()}
        <Dropdown
          style={[styles.dropdown, isFocus3 && { borderColor: 'blue' }]}
          placeholderStyle={styles.dropdownTextStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={billType}
          itemTextStyle={styles.dropdownTextStyle}
          search
          maxHeight={300}
          labelField="mbt_name_eng"
          valueField="mbt_id"
          placeholder="Select Bill Type"
          searchPlaceholder="Search..."
          value={value2}
          onFocus={() => setIsFocus3(true)}
          onBlur={() => setIsFocus3(false)}
          onChange={selectedValue1 => {
            setValue2(selectedValue1.mbt_id);
            setIsFocus3(false);
            fetchBillNo(selectedValue1.mbt_id);
          }}
        />

        <TextInput
          style={styles.inputStyle}
          value={billNo}
          placeholder="Bill No."
          placeholderTextColor="black"
          keyboardType={'numeric'}
          onChangeText={(billNo) => setBillNo(billNo)}
        />

        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.7}
          onPress={() => handleSubmitPress()}
        >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </>)}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  label1: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  label2: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    left: 22,
    top: 70,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  label3: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    left: 22,
    top: 130,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  inputStyle: {
    marginBottom: 10,
    color: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    width: 330,
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#AE275F',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  placeholderStyle: {
    fontSize: 16,
    color: "black",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
  dropdownTextStyle: {
    color: 'black', // Set the desired text color for dropdown values
  },
});

export default SalarySlip;
