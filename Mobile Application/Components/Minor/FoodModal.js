import React from 'react';
import { 
  StyleSheet,  
  Dimensions,
  Text,
} from 'react-native';

// Import grid
import { Col, Row, Grid } from "react-native-easy-grid";

// Import modal
import Modal, { ModalFooter, ModalButton, ModalContent, SlideAnimation } from 'react-native-modals';

// Import Food item
import FoodItem from './FoodItem';

// Get the screens dimensions
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


class FoodModal extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      visible: this.props.visible
    }
  };

// Will make the component visible when the new props arrive
  componentWillReceiveProps(nextProps){

    // Check if modal should be set displayed
    if((nextProps.diet != "" && nextProps.image != "" && nextProps.name != "" && nextProps.restaurant != "") && (nextProps.visible != false)){
      this.setState({
        visible: true
      })
    }
    else {
      this.setState({
        visible: false
      })
    }
  }

  render() {
    return (
        <Modal.BottomModal visible={this.state.visible} width = {1} height = {0.85}
        onTouchOutside = {() => {
          this.setState({visible: false}); 
        }}
        onSwipeOut = {() => {
          this.setState({visible: false});

        }}
        modalAnimation = {new SlideAnimation({
            slideFrom: 'bottom'
        })}>
            <ModalContent style = {styles.modalWrapper}>

                <Text style = {styles.restaurantName}>{this.props.restaurant}</Text>
                <Text style = {{fontSize: 20, fontWeight: 'bold'}}>{this.props.name}</Text>
                    
                <FoodItem image = {this.props.image} diet = {this.props.diet}/>

            </ModalContent>
        </Modal.BottomModal>
    );
  }
}

const styles = StyleSheet.create({
    modalWrapper: {

    },

    restaurantName: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: '2.5%'
    },

});

export default FoodModal;