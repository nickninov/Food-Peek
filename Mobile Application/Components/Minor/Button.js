import React from 'react';
import { 
  StyleSheet,  
  View,
  Dimensions,
  Text,
} from 'react-native';

// Get the screens dimensions
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

 
class FoodButton extends React.Component {

  constructor (props) {
    super(props);

    this.state = {

    }
  };

  render() {
    return (            
        <View style = {styles.wrapper}>
          <Text style = {styles.btnText}>{this.props.name}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#90EE90',
    padding: '2%',
    borderRadius: 10,
    width: '90%',
    marginLeft: '2.5%',
    marginRight: '2.5%'
  },

  btnText: {
    fontSize: 25,
    textAlign: 'center'
  }
});

export default FoodButton;