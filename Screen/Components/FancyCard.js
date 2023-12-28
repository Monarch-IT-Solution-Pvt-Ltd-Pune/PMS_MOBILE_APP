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
      navigation.navigate("Camera");
    }
  }
  return (
    
    <ScrollView horizontal showsHorizontalScrollIndicator={false}  style={styles.pageContainer}>
     
      <TouchableOpacity style={styles.cardContainer} onPress={()=>handleOnpress(item.url)}>
        <Image source={item.src} style={styles.cardImage} />
        <View style={styles.borderAfterImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      </TouchableOpacity>
     
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  outBorder:{
    margin:10,
  },
 
  pageContainer: {
    marginTop:5,
  },
  cardContainer: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,0)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width:'300',
    height:'230',
    paddingTop:15,
    marginBottom:0,
    padding:18,
    
  },
  cardImage: {
    width: '60%',  // Adjust the width percentage as needed
    height: '20%',    // Adjust the height as needed
    alignSelf: 'center',  // Center the image
    marginTop:15,
    marginBottom:10,
    marginRight:  10,
    marginLeft: 10, 
    padding:30,
  },
  
  borderAfterImage: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '100%', // Set the width to 100% to cover the entire width of the card
    marginBottom: 10, // Adjust the margin as needed
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