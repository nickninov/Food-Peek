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
} from 'react-native';

// Import icons component
import { Ionicons } from '@expo/vector-icons';

// Import grid
import { Col, Row, Grid } from "react-native-easy-grid";

// Bottom navigation
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation';

// Dropdown
import RNPickerSelect from 'react-native-picker-select';

// Import location
import * as Location from 'expo-location';

// Import custom modal
import FoodModal from './Minor/FoodModal';

// Import SafeAreaView
import SafeAreaView from 'react-native-safe-area-view';

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
      hasData: false,
      // Store all data
      dataHolder: [],

      // Store the current selected data
      images: [],

      // Store the initially displayed data
      initialData: [],

      // modal states
      visible: false,
      modalImage: '',
      modalRestaurantName: '',
      modalProductName: '',
      modalProductDiet: '',

      // Picker states
      pricePicker: null,
      cusinePicker: null,
      dietPicker: null,

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

    // Set data that will be initially displayed
    this.setState({
      images: await this.getData(this.state.outcode, userLong, userLat),
      hasData: true,
    });

    // Store default initial data
    this.setState({
      initialData: this.state.images
    })
  }

  async getData(outcode, userLong, userLat){

    var temp = [];

    // Fetch the data 
    await fetch('https://food-peek.firebaseapp.com/'+outcode+'/'+userLong+'/'+userLat).then((data) => {
      
      // console.log(data.status)

      return data.json();
    }).then((dataJson) => {

      this.setState({
        dataHolder: dataJson
      })

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

  // A method that will display items based on the dropdown values
  sortOptions(price, cusine, diet) {

    // Temporary array that holds all the data
    var tempArr = this.state.dataHolder;

    // An array that will hold the data depending on the user's select
    var sortHolder = [];

    // Sort by price
    if(price != null && cusine == null && diet == null){

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){

        // Check the price if they match with the selected value from the picker
        if(price == restaurant.price) {
          // Push every food object inside the array
          for(var foodObject of restaurant.food){
            sortHolder.push(foodObject);
          }
        }
      }

      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }

    }
    // Sort by cusine
    else if(price == null && cusine != null && diet == null) {

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){

        // Check the price if they match with the selected value from the picker
        if(cusine == restaurant.cusine) {

          // Push every food object inside the array
          for(var foodObject of restaurant.food){
            sortHolder.push(foodObject);
          }
        }
      }

      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }
    }

    // Sort by diet
    else if(price == null && cusine == null && diet != null) {

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){
          
          // Push every food object inside the array
          for(var foodObject of restaurant.food){
            
            // Check if current food product is the given diet
            if(foodObject.diet == diet){
              sortHolder.push(foodObject);
            }
          }
      }

      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }
    }
    
    // Sort by price and cusine
    else if(price != null && cusine != null && diet == null) {

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){

        // Check if current food product is the given cusine and price
        if(price == restaurant.price && cusine == restaurant.cusine){

          // Push every food object inside the array
          for(var foodObject of restaurant.food){
            sortHolder.push(foodObject);
          }
        }
      }

      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }
    }

    // Sort by price and diet
    else if(price != null && cusine == null && diet != null) {

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){

        // Check if current food product is the given price
        if(price == restaurant.price){

          // Iterate over every food object
          for(var foodObject of restaurant.food){
            
            // Check if current food product is the given diet
            if(foodObject.diet == diet){
              sortHolder.push(foodObject);
            }
          }
        }
      }

      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }
    }

    // Sort by cuisine and diet
    else if(price == null && cusine != null && diet != null) {
      console.log("Sort by cuisine and diet\n\n\n");

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){

        // Check if current food product is the given cusine
        if(cusine == restaurant.cusine){

          // Iterate over every food object
          for(var foodObject of restaurant.food) {

            // Check if current food product is the given diet
            if(diet == foodObject.diet){
              sortHolder.push(foodObject);
            }
          }
        }
      }

      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }
    }
    // Sort by price, cuisine and diet
    else if(price != null && cusine != null && diet != null) {

      // Access the food of the restaurant and the restaurant's details
      for(var restaurant of tempArr){

        // Check if current food product is the given price and cuisine
        if(price == restaurant.price && cusine == restaurant.cusine){
        
           // Iterate over every food object
           for(var foodObject of restaurant.food) {

            // Check if current food product is the given diet
            if(diet == foodObject.diet){
              sortHolder.push(foodObject);
            }
          }
        }
      }
      // Check if the FlatList data should be updated
      if(sortHolder.length > 0) {
        // Put the data inside a the FlatList state
        this.setState({
          images: sortHolder
        });
      }
    }

    // If price, cusine and diet are null
    else{

      // Put the data inside a the FlatList state
      this.setState({
        images: this.state.initialData
      })
    }
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
      
        <View style={styles.container}>

          <TouchableOpacity onPress = {() => this.setState({visible: true})}>
            <Image source = {require('../assets/images/logo.png')}/>
          </TouchableOpacity>

        </View>

      );
    }
    else if(this.state.hasData == true){

      const imageData = this.state.images;
      
      return (
          <SafeAreaView style = {{width: '100%', flex: 1,}} >
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
                    onValueChange={async (value) => {
                      this.setState({
                        visible: false,
                        pricePicker: await value
                      });

                      this.sortOptions(this.state.pricePicker, this.state.cusinePicker, this.state.dietPicker);
                    }}
                    placeholder = {{label: 'Price'}}
                    style = {dropdownBox}
                    items={[
                      {label: 'Low', value: 'low'},
                      {label: 'Medium', value: 'medium'},
                      {label: 'High', value: 'high'}

                    ]}/>
                </View>

                <View style = {styles.dropdown}>
                  <RNPickerSelect
                    onValueChange={async (value) => {
                      this.setState({
                        visible: false,
                        cusinePicker: await value
                      });

                      this.sortOptions(this.state.pricePicker, this.state.cusinePicker, this.state.dietPicker);
                    }}
                    placeholder = {{label: 'Cuisine'}}
                    style = {dropdownBox}
                    items={[
                      {label: 'Italian', value: 'italian'},
                      {label: 'Chinese', value: 'chinese'},
                      {label: 'American', value: 'american'},
                      {label: 'Indian', value: 'indian'},
                    ]}/>
                </View>

                <View style = {styles.dropdown}>
                  <RNPickerSelect
                    onValueChange={async (value) => {
                      this.setState({
                        visible: false,
                        dietPicker: await value
                      });

                      this.sortOptions(this.state.pricePicker, this.state.cusinePicker, this.state.dietPicker);
                    }}
                    placeholder = {{label: 'Diet'}}
                    style = {dropdownBox}
                    items={[
                      {label: 'Vegetarian', value: 'vegeterian'},
                      {label: 'Vegan', value: 'vegan'},
                      {label: 'Glutten-free', value: 'glutten-free'}
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
                    <View>
                      <TouchableOpacity onPress={() => 
                        this.setState({
                          visible: true, 
                          modalImage: food.item.image, 
                          modalRestaurantName: food.item.restaurant, 
                          modalProductName: food.item.name,
                          modalProductDiet: food.item.diet.charAt(0).toUpperCase() + food.item.diet.slice(1)
                      })}>

                        <Image style = {styles.img} source = {{uri: food.item.image}}/>

                      </TouchableOpacity>
                      
                    </View>
                  );
                

              }}
              keyExtractor = {item => item.name}
            />

            </ScrollView>
            </View>

            <FoodModal 
            visible = {this.state.visible}
            name = {this.state.modalProductName} 
            image = {this.state.modalImage} 
            restaurant = {this.state.modalRestaurantName}
            diet = {this.state.modalProductDiet}/>
          
          </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },

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