import React from 'react';
import { 
  StyleSheet,  
  View,
  Dimensions,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

// Import icons component
import { Ionicons } from '@expo/vector-icons';

// Import grid
import { Col, Row, Grid } from "react-native-easy-grid";

// Bottom navigation
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import { createAppContainer, SafeAreaView } from 'react-navigation';

// Dropdown
import RNPickerSelect from 'react-native-picker-select';

// Import location
import * as Location from 'expo-location';

// Firebase & firestore
import * as firebase from 'firebase/app';
import '@firebase/firestore';

// Get the screens dimensions
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

console.disableYellowBox = true;

class HomePage extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      dietry: '',
      price: 0.00,
      quality: '',
      outcode: 'N/A',
      images: [],
      hasData: false
    }
  };

  async componentDidMount(){

    // Get the current location of the user
    var location = await Location.getCurrentPositionAsync({});

    // Store the user's longitude
    var userLong = location.coords.longitude;

    // Store the user's latitude
    var userLat = location.coords.latitude;


    // Set the user's postcode
    this.setState({
      outcode: await AsyncStorage.getItem('outcode')
    });

    // For emulators only
    if(this.state.outcode == 'N/A') {
      this.setState({
        outcode: 'W5'
      })
    }

    this.setState({
      images: await this.getData(this.state.outcode, userLong, userLat),
      hasData: true
    });
  }

  async getData(outcode, userLong, userLat){

    var temp = [];

    // Fetch the data 
    await fetch('https://food-peek.firebaseapp.com/'+outcode+'/'+userLong+'/'+userLat).then((data) => {
      return data.json();
    }).then((dataJson) => {

      // Access each Restaurant
      dataJson.forEach(restaurant => {

        // Access the food of the restaurant
        for(var i = 0; i < restaurant.food.length; i++){

          // Push every image inside the state array
          temp.push(restaurant.food[i]);
        }
      });
    })

    return temp;
  }


  render() {
    const dropdownBox = {
      placeholder: {
        color: 'black',
        fontSize: 20,
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
      },

      inputIOS: {
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
        fontSize: 20
      }
    }
  
    if(this.state.hasData == false){

      return (
        
        <SafeAreaView style = {{width: '100%', flex: 1}}>
          <View style = {styles.topBar}>

            <Grid style = {{marginLeft: '3%'}}>

              <Row style = {{paddingBottom: '1%'}}>

              </Row>

              <Row style ={{borderRadius: 5, borderWidth: 1, width: '60%', paddingBottom: '1.5%'}}>

                <Ionicons name = {'md-search'} size={28} color = "black" style = {{padding: '0.5%'}}/>
                <TextInput style = {styles.textBox} value = "Loading"/>
              
              </Row>

              <Row style = {{marginTop: '2%', height: 50, ...Platform.select({ios: { marginTop: '3%' }})}}>
                <View style = {styles.dropdown}>
                  <Text style = {styles.loading}>Loading</Text>
                </View>

                <View style = {styles.dropdown}>
                  <Text style = {styles.loading}>Loading</Text>
                </View>
          
                <View style = {styles.dropdown}>
                  <Text style = {styles.loading}>Loading</Text> 
                </View>
              </Row>

              
            </Grid>
              
          </View>

          <View style = {styles.itemWrapper}>

            <ScrollView>

            </ScrollView>
          </View>

        </SafeAreaView>

      );
    }
    else if(this.state.hasData == true){

      const imageData = this.state.images;

      return (
        <SafeAreaView style = {{width: '100%', flex: 1}}>

          <View style = {styles.topBar}>

            <Grid style = {{marginLeft: '3%'}}>

              <Row style = {{paddingBottom: '1%'}}>

              </Row>

              <Row style ={{borderRadius: 5, borderWidth: 1, width: '60%', paddingBottom: '1.5%'}}>

                <Ionicons name = {'md-search'} size={28} color = "black" style = {{padding: '0.5%'}}/>
                <TextInput style = {styles.textBox}/>

              </Row>

              <Row style = {{height: 50, ...Platform.select({ios: { marginTop: '3%' }})}}>
                <View style = {styles.dropdown}>
                  <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    placeholder = {{label: 'Price'}}
                    style = {dropdownBox}
                    items={[
                      {label: 'Test', value: 'Test'}
                    ]}/>
                </View>

                <View style = {styles.dropdown}>
                  <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    placeholder = {{label: 'Cusine'}}
                    style = {dropdownBox}
                    items={[
                      {label: 'Test', value: 'Test'}
                    ]}/>
                </View>
          
                <View style = {styles.dropdown}>
                  <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    placeholder = {{label: 'Diet'}}
                    style = {dropdownBox}
                    items={[
                      {label: 'Test', value: 'Test'}
                    ]}/>
                </View>
              </Row>

              
            </Grid>
              
          </View>

          <View style = {styles.itemWrapper}>

            <ScrollView>

            <FlatList
              data = {imageData}
              numColumns = {3}
              renderItem = { (food) => {

                return(
                  <TouchableOpacity onPress={() => alert("Food: "+food.item.name)}>

                    <Image style = {styles.img} source = {{uri: food.item.image}}/>

                  </TouchableOpacity>
                );

                }
              }
              
              keyExtractor = {item => item.name}
            />

              
            </ScrollView>
          </View>

        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  topBar: {
    paddingTop: '6%',
    height: '25%',
  },

  itemWrapper: {
    height: '75%',
    backgroundColor: '#DCDCDC',
  },

  img: {
    width: width / 3,
    height: width / 3,
  },

  textBox: {
    width: width * 0.5,
    marginLeft: '2%',
    fontSize: 22
  },

  postCode: {
    fontSize: 20,
    fontWeight: 'bold',

  },

  holder: {
    padding: '0.5%',
    fontSize: 15,
    marginLeft: '2%',
    marginRight: '2%'
  },

  dropdown: {
    margin: '1%',
    width: width * 0.3,
  },

  loading: {
    fontSize: 20,
    fontWeight: "500"
  }
});

const AppNavigator = createBottomTabNavigator(
  {
    HomePage: {
      screen: HomePage,
    }
  },

  {
    initialRouteKey: 'Home',
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#000',
      activeBackgroundColor: '#90EE90' // #90EE90

    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName = '';
        let iconSize = 25;

        if (routeName === 'HomePage') {
          iconName = 'md-home';
        } 
        return <Ionicons name = {iconName} size={iconSize} color="black" />;
      },
      
    })
  }
);

export default createAppContainer(AppNavigator);