import React from 'react';
import { 
  StyleSheet,  
  View,
  Dimensions,
  Text,
  Image,
} from 'react-native';

// Import button
import FoodButton from './Button';

// Import grid
import { Col, Row, Grid } from "react-native-easy-grid";

// Get the screens dimensions
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;



class FoodModal extends React.Component {

  constructor (props) {
    super(props);

    this.state = {

    }
  };

  render() {
    return (            
          <View style = {styles.wrapper}>

            <View style = {{alignItems: 'center'}}>
              <Image style = {styles.img} source = {{uri: this.props.image}}/>
            </View>
            
              <View style ={{paddingTop: '3%', paddingBottom: '3%'}}>
                <Text style = {styles.info}>Diet: {this.props.diet}</Text>
                <Text style = {styles.info}>Contains: </Text>
              </View>
              
                <Grid>
                  <Row>

                    <Col style = {styles.col}>
                      <FoodButton name = "Order"/>
                    </Col>

                    <Col style = {styles.col}>
                      <FoodButton name = "Menu"/>
                    </Col>

                  </Row>

                </Grid>

          
          </View>

    );
  }
}

const styles = StyleSheet.create({
    img: {
        width: width - 100,
        height: width - 100,
    },
    
    wrapper: {
      height: height * 0.8,
    },

    info: {
        fontSize: 20,
        padding: '1%',
        paddingLeft: '3%'
    },

    col: {

    }
});

export default FoodModal;