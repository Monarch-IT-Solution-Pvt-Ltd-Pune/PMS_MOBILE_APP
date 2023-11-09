import {
    StyleSheet,
    View,
    Image,Text,TouchableOpacity, ScrollView
  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FancyCard=({ item })=>{
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
    <ScrollView>
      <TouchableOpacity style={styles.cardContainer} onPress={()=>handleOnpress(item.url)}>
        <Image source={item.src} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width:150,
    height:200,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTextContainer: {
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black',
  },
});

export default FancyCard;