import React, {useState,useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA = [
  {
    id: '1',
    title: 'Apply Leave',
    roles: [7,8],
  },
  {
    id: '2',
    title: 'Leave History',
    roles: [7,8],
  },
  {
    id: '3',
    title: 'Approve Leave',
    roles: [7],
  },
];

const LeaveManagement = () => {
  const [roleId,setRoleId]=useState('');

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData=async()=>{
    const roleId = await AsyncStorage.getItem("roleId");
    const roleIdNumber = parseInt(roleId, 10);
    if (!isNaN(roleIdNumber)) {
      setRoleId(roleIdNumber); // Set the roleId as a number
    } else {
      console.error("Invalid roleId:", roleIdString);
    }
  }

  const filteredData = DATA.filter(item => {
    console.log(item.roles); // Log item roles
    console.log(item.roles.includes(roleId))
    return item.roles.includes(roleId);
  });
  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title} onPress={() => handleOnpress(title.id)}>
        {title.title}
      </Text>
    </View>
  );
  const handleOnpress=(item)=>{
    if(item==1){
      navigation.navigate("applyLeave");
    }
    if(item==2){
      navigation.navigate("LeaveHistory");
    }
    if(item==3){
      navigation.navigate("LeaveApproval");
    }
  }
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={({item}) => <Item title={item} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
   // backgroundColor: '#AE275F',
   borderWidth: 1,
    borderRadius: 10,
    borderColor: '#AE275F',
    width: 330,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius:10,
    color: 'white',
  },
  title: {
    color:'#AE275F',
    fontSize: 22,
    fontWeight: 'bold',
    alignItems: 'center',
    elevation: 3, // Add elevation for a shadow effect (Android)
  },
});

export default LeaveManagement;