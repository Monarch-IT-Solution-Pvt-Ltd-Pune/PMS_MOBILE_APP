import {
    StyleSheet,
    View,
    Image,Text,TouchableOpacity, ScrollView
  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FancyCard=({ item ,index })=>{
  const navigation = useNavigation();
  const handleOnpress=(url)=>{
    if(url=="LEAVE"){
      navigation.navigate("LeaveScreen");
    }else if(url=="COMPLIANCE"){
      navigation.navigate("Compliance");
    }else if(url=="PROFILE"){
      navigation.navigate("ProfileScreen");
    }else if(url=="SLIP"){
      navigation.navigate("SalarySlip");
    }else if(url=="VERIFYFACE"){
      navigation.navigate("VerifyFace");
    }
  }
  return (
    
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outBorder}>
    
      <TouchableOpacity style={[
          styles.cardContainer,
          { borderRightWidth: index === item - 1 ? 1 : 1 }
        ]} onPress={()=>handleOnpress(item.url)}>
        <Image source={item.src} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      </TouchableOpacity>
     
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  outBorder:{
    margin:0,
  },
  pageContainer: {
    //flex: 1,
    borderWidth: 1,  // Add border to the entire page
    borderColor: 'black',
    marginTop:100,
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    margin: 0,
   // marginBottom: 0, // Set marginBottom to 0 to remove space between cards
    //marginRight:  0,  // Set marginRight to 0 to remove space between near two cards in one row
    //marginTop: 0, 
    //marginLeft: 0, 
    backgroundColor: '#f2f2f2',
    //borderRadius: 10,
    elevation: 3,
    shadowColor: 'rgba(0,0,0,0)',
    //shadowOffset: { width: 0, height: 2 },
   // shadowOpacity: 0.8,
   // shadowRadius: 2,
    width:114,
    height:120,
    borderBottomColor: 'black',
    borderBottomWidth: 1, // Add border to the bottom
    borderRightColor: 'black',
    borderRightWidth: 1, // Add border to the right
    paddingTop:10,
    
  },
  cardImage: {
    width: '46%',  // Adjust the width percentage as needed
    height: 55,    // Adjust the height as needed
    alignSelf: 'center',  // Center the image
    //borderTopLeftRadius: 10,
    //borderTopRightRadius: 10,
    margin:5,
    marginTop:5,
    padding:30,
  },
  cardTextContainer: {
   
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'black',
    alignSelf: 'center',
  },
});

export default FancyCard;