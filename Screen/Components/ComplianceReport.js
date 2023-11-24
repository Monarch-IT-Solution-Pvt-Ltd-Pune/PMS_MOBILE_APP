import React, { useState,useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import baseurl from '../BaseUrl/Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastManager, { Toast } from 'toastify-react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice } from "react-native-vision-camera";
import RNFS from "react-native-fs";

const ComplianceReport = () => {
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [items, setItems] = useState([]);
  const [items1, setItems1] = useState([
    { label: 'IN', value: '1' },
    { label: 'OUT', value: '2' },
  ]);
  const [filePath, setFilePath] = useState({});

  useEffect(() => {
    requestPermissions();
    fetchReasons();
  }, []);

  const requestPermissions = async () => {
    const cameraGranted = await requestCameraPermission();
    const storageGranted = await requestStoragePermission();

    if (cameraGranted && storageGranted) {
      checkPermissions();
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
      }
    } else {
      return true;
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
      }
    } else {
      return true;
    }
  };

  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    // Handle permission results if needed.
  };

  const pickImage = async (type) => {
    const options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    
    if (type === 'photo') {
      launchCamera(options, handleImageResponse);
    } else {
      launchImageLibrary(options, handleImageResponse);
    }
  };

  const handleImageResponse = async(response) => {
    console.log(response)
    if (response.didCancel) {
      alert('User cancelled camera picker');
      return;
    } else if (response.errorCode == 'camera_unavailable') {
      alert('Camera not available on device');
      return;
    } else if (response.errorCode == 'permission') {
      alert('Permission not satisfied');
      return;
    } else if (response.errorCode == 'others') {
      alert(response.errorMessage);
      return;
    }
    if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      const imageUri = selectedImage.uri;
      
      setFilePath(selectedImage);
  } else {
    alert('No image selected');
  }
  };

  const imageToBase64 = async (imagePath) => {
    try {
      const response = await RNFS.readFile(imagePath, 'base64');
      return response;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const fetchReasons = async () => {
    try {
      const response = await fetch(baseurl + `/loadReasons`, {
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
        Toast.warn('No Reasons available');
        setValue('');
      } else {
        setItems(responseJson.lstReasons);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const navigation = useNavigation();

  const handleSubmitPress = async () => {
    const empId = await AsyncStorage.getItem('empId');
    const userId = await AsyncStorage.getItem('userId');
    // const dataToSend = new FormData();
    // dataToSend.append('mc_emp_id', empId);
    // dataToSend.append('userId', userId);
    // dataToSend.append('mc_mr_id', value);
    // dataToSend.append('mc_in_out', value1);
    // console.log(filePath);
    // const base64ImageData = await imageToBase64(filePath.uri);
    // dataToSend.append('attachmentsDetails',{
    //   fpath:base64ImageData,
    //   fExtenstion:filePath.type,
    //   fileNm:filePath.fileName
    // });
    // if (filePath.uri) {
    //   const imageUriParts = filePath.uri.split('.');
    //   const fileType = imageUriParts[imageUriParts.length - 1];
    //   const fileName = `image_${Date.now()}.${fileType}`;
  
    //   dataToSend.append('image', {
    //     uri: filePath.uri,
    //     type: `image/${fileType}`,
    //     name: fileName,
    //   });
    // }
    const base64ImageData = await imageToBase64(filePath.uri);
    const dataToSend = {
      mc_emp_id: empId,
      userId: userId,
      mc_mr_id:value,
      mc_in_out:value1,
      fpath:base64ImageData,
      fExtenstion:"jpg",
      fileNm:filePath.fileName
    };

    console.log(dataToSend);
    try {
      const response = await fetch(baseurl + '/saveComplains', {
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

      if (responseJson.SUCCESS) {
        console.log('Success');
        Toast.warn('Complain Submitted successfully');
      } else {
        Toast.warn('Error while submitting Complain');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const renderLabel1 = () => {
    if (value || isFocus1) {
      return (
        <Text style={[styles.label, isFocus1 && { color: 'blue' }]}>
          Select Reason
        </Text>
      );
    }
    return null;
  };
  
  const renderLabel2 = () => {
    if (value1 || isFocus2) {
      return (
        <Text style={[styles.label1, isFocus2 && { color: 'blue' }]}>
          Select IN/OUT
        </Text>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <ToastManager />
        <>
          {renderLabel1()}
          <Dropdown
            style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]}
            placeholderStyle={styles.dropdownTextStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemTextStyle={styles.dropdownTextStyle}
            data={items}
            search
            maxHeight={300}
            labelField="mr_name_en"
            valueField="mr_id"
            placeholder={!isFocus1 ? 'Select Reason' : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus1(true)}
            onBlur={() => setIsFocus1(false)}
            onChange={(selectedValue) => {
              setValue(selectedValue.mr_id);
              setIsFocus1(false);
            }}
          />

          {renderLabel2()}
          <Dropdown
            style={[styles.dropdown, isFocus1 && { borderColor: 'blue' }]}
            placeholderStyle={styles.dropdownTextStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            itemTextStyle={styles.dropdownTextStyle}
            data={items1}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder='Select IN/OUT'
            searchPlaceholder="Search..."
            value={value1}
            onFocus={() => setIsFocus2(true)}
            onBlur={() => setIsFocus2(false)}
            onChange={(selectedValue1) => {
              setValue1(selectedValue1.value);
              setIsFocus2(false);
            }}
          />

        <Image
          source={{uri: filePath.uri}}
          style={styles.imageStyle}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.uploadImageButton}
          onPress={() => pickImage('photo')}>
          <Text style={styles.uploadImageText}>
          TAKE A PHOTO
          </Text>
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.7}
            onPress={handleSubmitPress}
          >
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </>
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
  label1: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'black',
    left: 22,
    top: 70,
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
    marginLeft: 20,
    marginBottom: 10,
    color: 'black',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
    width: 350,
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
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#e041f9',
    marginLeft: 30,
  },
  uploadImageButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'white', // Change the background color as desired
    alignSelf: 'center',
    borderColor: '#AE275F',
    borderWidth: 2,
  },
  uploadImageText: {
    color: 'black', // Change the text color as desired
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color:'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdownTextStyle: {
    color: 'black', // Set the desired text color for dropdown values
  },
});

export default ComplianceReport;
