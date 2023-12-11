import React,{useEffect, useRef,useState} from "react";
import { ActivityIndicator,StyleSheet,TouchableOpacity,View } from "react-native";
import { Image, Text } from "react-native-elements";
import { Camera,useCameraDevice,useFrameProcessor } from "react-native-vision-camera";
import RNFS from "react-native-fs";

const CameraComponent=()=>{
    const device = useCameraDevice('front')
    const camera = useRef<Camera>(null)
    const [imageData,setimageData]=useState('');
    const [photoClicked,setPhotoClicked]=useState(false);
    const [counter,setCounter]=useState<number>(0);
    useEffect(()=>{
        checkPermission();
    },[]);

    const frameProcessor = useFrameProcessor((frame) => {
      'worklet'
        console.log("frame created");
    }, [])
   
    const checkPermission = async () => {
      try {
        const newCameraPermission = await Camera.requestCameraPermission();
        const newMicrophonePermission = await Camera.requestMicrophonePermission();
    
        if (!newCameraPermission || !newMicrophonePermission) {
          console.log("Camera or microphone permission denied");
        }
      } catch (error) {
        console.log("Error checking permissions:", error);
      }
    };
    
    const takePicture = async () => {
        try {
          setimageData('');
          const photo = await camera.current?.takePhoto();
    
          if (photo) {
            console.log("Photo path:", photo);
            // Move the photo to a more accessible location in the app's file system
            const newPath = RNFS.PicturesDirectoryPath + "/photo"+counter+".jpg";
            setCounter(counter+1);
            await RNFS.moveFile(photo.path, newPath);
    
            // Check if the photo was successfully moved
            const exists = await RNFS.exists(newPath);
            if (exists) {
              setimageData(newPath);
              console.log("Photo moved successfully:", newPath);
            } else {
              console.log("Error while moving the photo.");
            }
          } else {
            console.log("Error while taking the photo.");
          }
          setPhotoClicked(true);
          
        } catch (error) {
          console.log("Error:", error);
        }
      };

      const imageToBase64 = async (imagePath:string) => {
        try {
          const response = await RNFS.readFile(imagePath, 'base64');
          return response;
        } catch (error) {
          console.error('Error converting image to base64:', error);
          return null;
        }
      };

      const sendPhoto = async () => {
        try {
          const base64ImageData = await imageToBase64(imageData);
    
          if (base64ImageData) {
            const response = await fetch('http://localhost:8080/api/savePhoto', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageData: base64ImageData }),
            });
    
            const data = await response.json();
            console.log(data);
          } else {
            console.error('Failed to convert image to base64.');
          }
        } catch (error) {
          console.error('Error sending photo and :', error);
        }
      };

    if (device == null) return <ActivityIndicator /> 
    return (
        photoClicked?( 
        <View style={{flex:1}}>
            {imageData ? (
      <Image source={{ uri: 'file://' + imageData + "?" + new Date()}} style={{ height: 500 }} />
        ) : (
        <Text>No captured photo</Text>
        )}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => sendPhoto()}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>):
        ( 
        <View style={{flex:1}}>
            <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
            orientation={'portrait'}
            frameProcessor={frameProcessor}
            />
            <TouchableOpacity style={{width:60,height:60,borderRadius:30,backgroundColor:"red",position:'absolute',bottom:50,alignSelf:'center',alignItems:'center',alignContent:'center'}} onPress={()=>takePicture()}></TouchableOpacity>
        </View>
        )
    )
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

export default CameraComponent;