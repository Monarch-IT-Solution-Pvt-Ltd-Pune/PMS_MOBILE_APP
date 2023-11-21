import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Loader from './Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseurl from './BaseUrl/Baseurl';
import ToastManager, { Toast } from 'toastify-react-native'

const LoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = async () => {
    setErrortext('');
  
    try {
      if (!userName) {
        alert('Please fill username');
        return;
      }
      if (!userPassword) {
        alert('Please fill Password');
        return;
      }
  
      setLoading(true);
  
      const dataToSend = {
        userName: userName,
        password: userPassword,
      };
  
      const response = await fetch(baseurl + '/makeLogin', {
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
        console.log(responseJson.users.id.toString());
        AsyncStorage.setItem("userId",responseJson.users.id.toString());
        AsyncStorage.setItem("roleId",responseJson.users.usmRomId.romId.toString());
        AsyncStorage.setItem("empId",responseJson.users.usm_emp_id.emp_id.toString());
        AsyncStorage.setItem("empName",responseJson.users.usm_emp_id.emp_fname_en+" "+responseJson.users.usm_emp_id.emp_lname_en);
        navigation.replace('DrawerNavigationRoutes');
        console.log(responseJson.users.usm_emp_id.emp_fname_en);
      } else {
        Toast.warn('Username or password is wrong!!!');
      }
    } catch (error) {
      setLoading(false);
      Toast.warn('Somthing Went wrong!!!');
    }
  };
  
  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ToastManager />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../Image/payrolimage.png')}
                style={{
                  width: '50%',
                  height: 150,
                  resizeMode: 'contain',
                  marginTop: 30,
                  marginBottom: 15,
                }}
              />
              <Text style={styles.titleStyle}>Pune Municipal Corporation</Text>
              <Text style={styles.titleStyle1}>Payroll Management System</Text>
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={userName => setUserName(userName)}
                placeholder="Enter Username" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Login</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('RegisterScreen')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffff',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#3e4095',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#3e4095',
    height: 45,
    alignItems: 'center',
    borderRadius: 9,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 19,
    fontWeight: 'bold',
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  titleStyle:{
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleStyle1:{
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  }
});