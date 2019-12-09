import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  AsyncStorage
} from 'react-native';

// Import Navigation settings
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Import components
import HomePage from './Components/HomePage';

// Import location and permission
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

// Get the screens dimensions
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

class App extends React.Component {

  // Hides the navigation's head and disables going back
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor (props) {
    super(props);

  };

  // Get the user's location
  getLocation = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    
    // Check if status has been granted
    if (status == 'granted') {

      // Get the current location of the user
      var location = await Location.getCurrentPositionAsync({});

      // Get postcodes according to the user's location
      await fetch('https://api.postcodes.io/postcodes?lon='+location.coords.longitude+'&lat='+location.coords.latitude)
      .then((response) => response.json())
      .then((responseJson) => {

        // Display all the data from the API based on the coordinates of the user
        if(responseJson.result != null){

          // Store the outcode of the user
          AsyncStorage.setItem('outcode', responseJson.result[0].outcode);
        }

        else {
          AsyncStorage.setItem('outcode', 'N/A');
        }

      }).catch((err) => {
        console.log(err)
      })
    }
  };

  // Ask the user for permission before initial render
  async componentWillMount() {

    if (Platform.OS === 'android' && !Constants.isDevice) {

      console.log("Oops, this will not work on Sketch in an Android emulator. Try it on your device!")
    
    } 
    else {

      await this.getLocation();

    }

    this.props.navigation.navigate('HomePage');
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress = {() =>  this.props.navigation.navigate('HomePage')}>

          <Image source = {require('./assets/images/logo.png')}/>

        </TouchableOpacity>

      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: App,
    },
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        gesturesEnabled: false,
      }
    }
  },
  {
    initialRouteKey: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        display: "none",
      },
    }
  }
);
export default createAppContainer(AppNavigator);
