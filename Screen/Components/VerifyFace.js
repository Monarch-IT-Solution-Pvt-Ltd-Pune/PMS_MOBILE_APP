import React, { useRef, useState,useEffect } from 'react';
import { View, Text, Image, TextInput, Button,PermissionsAndroid,StyleSheet,TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import axios from 'axios';

const API_BASE_URL = 'YOUR_API_BASE_URL'; // Replace with your API base URL

async function requestCameraPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera.',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // For iOS, camera permissions are requested in Info.plist
    }
  }

function VerifyFace() {
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);

  const [lastFrame, setLastFrame] = useState(null);
  const [showWebcam, setShowWebcam] = useState(true);
  const [value, setValue] = useState('');

  useEffect(() => {
    async function checkPermissionsAndShowCamera() {
      const hasCameraPermission = await requestCameraPermission();
      if (hasCameraPermission) {
        setShowWebcam(true);
      }
    }
    checkPermissionsAndShowCamera();
  }, []);

  const handleChange = (text) => {
    setValue(text);
  };

  const saveLastFrame = async () => {
    if (cameraRef.current && canvasRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePhoto(options);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = `data:image/jpg;base64,${data.base64}`;

      img.onload = () => {
        context.drawImage(img, 0, 0, 400, 300);

        canvas.toDataURL('image/png').then((dataUrl) => {
          setLastFrame(dataUrl);
          setShowWebcam(false);
        });
      };
    }
  };

  const registerNewUser = () => {
    if (lastFrame) {
      const apiUrl = `${API_BASE_URL}/register_new_user`;
      const formData = new FormData();
      formData.append('text', value);

      axios
        .get(lastFrame, { responseType: 'blob' })
        .then((response) => {
          const file = new file([response.data], 'webcam-frame.png', {
            type: 'image/png',
          });
          formData.append('file', file);

          axios
            .post(apiUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              console.log(response.data);
              if (response.data.registration_status === 200) {
                alert('User was registered successfully!');
              }
            })
            .catch((error) => {
              console.error('Error sending image to API:', error);
            });
        });
    }
  };
  if (device == null) return <ActivityIndicator />
  return (
      showWebcam ? (
        <View style={{flex:1}}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
          orientation={'portrait'}
          zoom={device.neutralZoom}
        />
        <TouchableOpacity style={{width:60,height:60,borderRadius:30,backgroundColor:"red",position:'absolute',bottom:50,alignSelf:'center',alignItems:'center',alignContent:'center'}} onPress={()=>takePicture()}></TouchableOpacity>
        </View>
      ) : (
        <View>
        <Image
          style={{ width: 400, height: 300 }}
          source={{ uri: lastFrame }}
        />
        <TextInput
          placeholder="Enter user name"
          value={value}
          onChangeText={handleChange}
          style={{
            width: 300,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            margin: 10,
            padding: 5,
          }}
       />
        <Button title="Register New User" onPress={registerNewUser} />
        </View>
      )
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    width: 100,
    height: 40,
    backgroundColor: "green",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    margin: 10,
    elevation: 2, // Add a shadow for Android
  },
  confirmButtonText: {
    color: "white",
    fontSize: 20,
  },
});

export default VerifyFace;
