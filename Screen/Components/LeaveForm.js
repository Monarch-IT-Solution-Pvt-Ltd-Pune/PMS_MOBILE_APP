import React, { useState,useCallback,useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
} from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import baseurl from '../BaseUrl/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastManager, { Toast } from 'toastify-react-native'
import Loader from './Loader';
import DocumentPicker from 'react-native-document-picker';


const LeaveForm = ({navigation}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [remark, setRemark] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [value1, setValue1] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [balanceLeave, setBalanceLeave] = useState('');
  const [leaveCount, setLeaveCount] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
          fetchLeaveTypes();      
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setSelectedDocument(response);
      console.log(response);
      console.log(selectedDocument);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch(baseurl + `/fetchLeaveTypes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.msg == 'ERROR') {
        console.error('No Leaves available');
        setValue1('');
      } else {
        setItems(responseJson.leaveTypeLst);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleSubmitPress = async() => {
    const empId = await AsyncStorage.getItem('empId');
    console.log(selectedDocument.name);
    const dataToSend = new FormData();
    dataToSend.append('empId', empId);
    dataToSend.append('tldMltId', value1);
    dataToSend.append('tld_leave_from_date', fromDate);
    dataToSend.append('tld_leave_to_date', toDate);
    dataToSend.append('appliedLeaveCount', leaveCount);

    if (selectedDocument) {
        dataToSend.append('file_upload', {
            uri: selectedDocument[0].uri,
            type: selectedDocument[0].type,
            name: selectedDocument[0].name,
        });
    }
    const response = await fetch(baseurl + '/applyForLeave', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const responseJson = await response.json();

    setLoading(false);

      if(responseJson.msg=="SAVED"){
        alert("Leave Applied successfully");
        navigation.replace('LeaveHistory');
      }else if(responseJson.msg=="EXIST"){
      alert('There is already a leave exist of selected days');
    } 
  };

  const fetchBalanceLeaves = async (leaveId) => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      console.log('empId' + empId + 'leaveId' + leaveId);
      setLoading(true);
      const response = await fetch(
        baseurl + `/fetchBalanceLeaveByLeaveType/?leaveId=${leaveId}&empId=${empId}`,
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
      console.log(responseJson);
      if(responseJson.msg=='ERROR'){
        alert('No Leave available of this type');
        setValue1('');
        setBalanceLeave(0);
      }else{
        setBalanceLeave(responseJson.balanceLeave);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const showFromDatepicker = () => {
    setShowFromDatePicker(true);
  };

  const showToDatepicker = () => {
    setShowToDatePicker(true);
  };

  const handleFromDateChange = (event, selectedDate) => {
    var formattedDate;
    if (selectedDate) {
      formattedDate = formatDate(selectedDate);
      setFromDate(formattedDate);
    }
    setShowFromDatePicker(false);
    if (toDate && toDate < formattedDate) {
      alert('To Date cannot be greater than From Date');
      setFromDate(""); // Reset From Date
      return;
    }
    const totalDaysDifference = calculateDateDifference(formattedDate, toDate)+1;
    if (totalDaysDifference > balanceLeave) {
      alert('You cant apply for more than the balance');
      setFromDate("");
    } else {
      if(totalDaysDifference!=null){
        if(!isNaN(totalDaysDifference)){
          setBalanceLeave(balanceLeave - totalDaysDifference);
          setLeaveCount(totalDaysDifference.toString());
        }
      }
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    var formattedDate;
    if (selectedDate) {
      formattedDate = formatDate(selectedDate);
      setToDate(formattedDate);
    }
    setShowToDatePicker(false);
    if (fromDate && fromDate > formattedDate) {
      alert('To Date cannot be greater than From Date');
      setToDate(""); // Reset From Date
      return;
    }
    const totalDaysDifference = calculateDateDifference(fromDate, formattedDate)+1;
    if (totalDaysDifference > balanceLeave) {
      alert('You cant apply for more than the balance');
      setToDate("");
    } else {
      if(totalDaysDifference!=null){
        if(!isNaN(totalDaysDifference)){
          setBalanceLeave(balanceLeave - totalDaysDifference);
          setLeaveCount(totalDaysDifference.toString());
        }
      }
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Note: Month is zero-based
    const year = date.getFullYear();

    // Add leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const calculateDateDifference = (startDate, endDate) => {
    const startComponents = startDate.split('/');
    const endComponents = endDate.split('/');
    const start = new Date(
      startComponents[2],
      startComponents[1] - 1,
      startComponents[0]
    );
    const end = new Date(
      endComponents[2],
      endComponents[1] - 1,
      endComponents[0]
    );
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Calculate days difference
    return daysDifference;
  };

  const renderLabel = () => {
    if (value1 || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Select Leave Type
        </Text>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
       <ToastManager />
       <Loader loading={loading} />
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.dropdownTextStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.dropdownTextStyle}
        data={items}
        search
        maxHeight={300}
        labelField="mlt_name_eng"
        valueField="mlt_id"
        placeholder={!isFocus ? 'Select Leave Type' : '...'}
        searchPlaceholder="Search..."
        value={value1}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(selectedValue) => {
          setValue1(selectedValue.mlt_id);
          setIsFocus(false);
          fetchBalanceLeaves(selectedValue.mlt_id);
        }}
      />

      <Text style={styles.balanceText}>Balance Leave : {balanceLeave ? balanceLeave : 0}</Text>
      <View style={styles.checkBoxContainer}>
        <Checkbox
          status={toggleCheckBox ? 'checked' : 'unchecked'}
          onPress={() => setToggleCheckBox(!toggleCheckBox)}
        />
        <Text style={styles.checkBoxText}>Half Day</Text>
      </View>

      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateStyle}
          value={`${fromDate ? fromDate : 'Select Date'}`}
          onFocus={showFromDatepicker}
          editable={false}
        />
        <TouchableOpacity onPress={showFromDatepicker} style={styles.calendarButton}>
          <Text>📅</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateStyle}
          value={`${toDate ? toDate : 'Select Date'}`}
          onFocus={showToDatepicker}
          editable={false}
        />
        <TouchableOpacity onPress={showToDatepicker} style={styles.calendarButton}>
          <Text>📅</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.inputStyle}
        value={leaveCount}
        placeholder="Leave count"
        placeholderTextColor="grey"
        keyboardType={'numeric'}
        editable = {false}
        onChangeText={(leaveCount) => setLeaveCount(leaveCount)}
      />

      <TextInput
        style={styles.inputStyle}
        multiline
        value={remark}
        placeholder="Remark"
        placeholderTextColor="grey"
        onChangeText={(text) => setRemark(text)}
      />

      {showFromDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleFromDateChange}
        />
      )}

      {showToDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleToDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.documentButton}
        onPress={pickDocument}
        activeOpacity={0.7}>
        <Text style={styles.documentButtonText}>Upload Document</Text>
      </TouchableOpacity>

      {selectedDocument && (
        <View style={styles.selectedDocumentContainer}>
          <Text style={styles.selectedDocumentText}>
            Selected Document: {selectedDocument.type}
          </Text>
        </View>
      )}


      <TouchableOpacity
        style={styles.submitButton}
        activeOpacity={0.7}
        onPress={handleSubmitPress}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  inputStyle: {
    marginBottom: 10,
    color: 'black',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
    width: 330,
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#AE275F',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3, // Add elevation for a shadow effect (Android)
  },
  submitButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    marginLeft: 20,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 10,
  },
  checkBoxText: {
    marginLeft: 10,
    fontSize: 16,
  },
  balanceText: {
    marginLeft: 20,
    fontSize: 17,
  },
  halfDayText: {
    marginLeft: 20,
    fontSize: 17,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarButton: {
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
  },
  dateStyle: {
    marginBottom: 10,
    color: 'black',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
    width: 250,
    padding: 10,
  },
  inputSearchStyle: {
    color: 'black',
  },
  selectedTextStyle: {
    color: 'black',
  },
  dropdownTextStyle: {
    color: 'black', // Set the desired text color for dropdown values
  },
  documentButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  documentButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDocumentContainer: {
    marginTop: 10,
  },
  selectedDocumentText: {
    fontSize: 16,
    color: 'black',
  },
});

export default LeaveForm;
