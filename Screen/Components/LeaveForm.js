import React, { useState,useEffect } from 'react';
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

const LeaveForm = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [items, setItems] = useState([
    { label: 'Earned Leave', value: '1' },
    { label: 'Medical Leave', value: '2' },
    { label: 'Casual Leave', value: '3' },
    { label: 'Special Leave', value: '4' },
    { label: 'Optional Leave', value: '5' },
  ]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [remark, setRemark] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [value1, setValue1] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [balanceLeave, setBalanceLeave] = useState('');
  const [leaveCount, setLeaveCount] = useState(0);

  // useEffect(() => {
  //   if (fromDate && toDate) {
  //     const totalDaysDifference = calculateDateDifference(fromDate, toDate);
  //     if (totalDaysDifference > balanceLeave) {
  //       console.warn("You can't apply for more than the balance");
  //     } else {
  //       if (totalDaysDifference != null) {
  //         if (!isNaN(totalDaysDifference)) {
  //           setLeaveCount(totalDaysDifference);
  //         }
  //       }
  //     }
  //   }
  // }, [fromDate, toDate, balanceLeave]);

  const handleSubmitPress = async() => {
    const empId = await AsyncStorage.getItem('empId');
    const dataToSend = {
      empId: empId,
      tldMltId: value1,
      tld_leave_from_date: fromDate,
      tld_leave_to_date: toDate,
      appliedLeaveCount: leaveCount,
    };
    const response = await fetch(baseurl + '/applyForLeave', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const responseJson = await response.json();

    setLoading(false);

    if (responseJson.SUCCESS) {
      console.log("Success");
    } else {
      console.log("error");
    }
  };

  const fetchBalanceLeaves = async (leaveId) => {
    try {
      const empId = await AsyncStorage.getItem('empId');
      console.log('empId' + empId + 'leaveId' + leaveId);
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
      console.log(responseJson);
      if(responseJson.msg=='ERROR'){
        Toast.warn('No Leave available of this type');
        setValue1('')
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
    const totalDaysDifference = calculateDateDifference(formattedDate, toDate)+1;
    if (totalDaysDifference > balanceLeave) {
      Toast.warn('You cant apply for more than the balance');
      setFromDate("");
    } else {
      if(totalDaysDifference!=null){
        if(!isNaN(totalDaysDifference)){
          setBalanceLeave(balanceLeave - totalDaysDifference);
          setLeaveCount(totalDaysDifference);
        }
      }
    }
    console.warn('Total days difference:', totalDaysDifference);
  };

  const handleToDateChange = (event, selectedDate) => {
    var formattedDate;
    if (selectedDate) {
      formattedDate = formatDate(selectedDate);
      setToDate(formattedDate);
    }
    setShowToDatePicker(false);
    const totalDaysDifference = calculateDateDifference(fromDate, formattedDate)+1;
    if (totalDaysDifference > balanceLeave) {
      Toast.warn('You cant apply for more than the balance');
      setToDate("");
    } else {
      if(totalDaysDifference!=null){
        if(!isNaN(totalDaysDifference)){
          setBalanceLeave(balanceLeave - totalDaysDifference);
          setLeaveCount(totalDaysDifference);
        }
      }
    }
    console.warn('Total days difference:', totalDaysDifference);
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
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={items}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Leave Type' : '...'}
        searchPlaceholder="Search..."
        value={value1}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(selectedValue) => {
          setValue1(selectedValue.value);
          setIsFocus(false);
          fetchBalanceLeaves(selectedValue.value);
        }}
      />

      <Text style={styles.balanceText}>Balance Leave : {balanceLeave ? balanceLeave : 0}</Text>
      <Text style={styles.halfDayText}>Half Day</Text>
      <View style={styles.checkBoxContainer}>
        <Checkbox
          status={toggleCheckBox ? 'checked' : 'unchecked'}
          onPress={() => setToggleCheckBox(!toggleCheckBox)}
        />
        <Text style={styles.checkBoxText}>Half Day</Text>
      </View>

      <TouchableOpacity onPress={showFromDatepicker}>
        <Text style={styles.dateText}>
          From Date: {fromDate ? fromDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={showToDatepicker}>
        <Text style={styles.dateText}>
          To Date: {toDate ? toDate : 'Select Date'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.inputStyle}
        value={leaveCount}
        placeholder="Leave count"
        placeholderTextColor="grey"
        keyboardType={'numeric'}
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
        style={styles.submitButton}
        activeOpacity={0.7}
        onPress={handleSubmitPress}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
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
    borderColor: 'gray',
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
    backgroundColor: '#007BFF',
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
});

export default LeaveForm;