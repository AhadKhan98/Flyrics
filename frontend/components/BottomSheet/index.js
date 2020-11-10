import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../config/colors';

class BottomSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false, //controls if the modal (for lyrics) is being displayed or not
    };
  }

  /*updates the State with value of showModal property in the App component
  once the component is mounted */
  componentDidMount() {
    const {showModal} = this.props;
    this.setState({showModal});
  }

  //returns the JSX to render
  render() {
    return (
      <>
        {/* UI component that's displayed when lyrics aren't shown */}
        <TouchableOpacity
          style={styles.bottomSheet}
          onPress={() => this.setState({showModal: true})}>
          <View style={styles.bottomSheetRect} />
        </TouchableOpacity>
        {/* modal to show lyrics */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={styles.modal}>
            {/* Makes the remaining portion of the screen pressable to hide modal*/}
            <Pressable
              onPress={() => this.setState({showModal: false})}
              style={styles.modalPressable}
            />
            {/* UI to display lyrics*/}
            <View style={styles.modalView}>
              <View style={styles.scrollView}>
                <ScrollView>
                  <Text style={styles.scrollViewText}>
                    {this.props.lyrics
                      ? this.props.lyrics
                      : 'Find your lyrics here :)'}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

//Contains the styles for various components
const styles = StyleSheet.create({
  //style for UI being displayed when lyrics aren't shown
  bottomSheet: {
    height: 40,
    width: '100%',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: Colors.black,
    borderStyle: 'solid',
    borderWidth: 0.05,
  },
  //style for rectangle shape in the above said UI
  bottomSheetRect: {
    width: 36,
    height: 8,
    backgroundColor: '#bfbfbf',
    borderRadius: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 1,
    shadowRadius: 16.0,
    elevation: 24,
  },
  //style for modal view
  modal: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  //style for pressable component
  modalPressable: {
    flex: 1,
  },
  //style for UI to display lyrics
  modalView: {
    backgroundColor: Colors.white,
    height: '75%',
    width: '100%',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    elevation: 64,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  //style to resize and adjust scrollview for lyrics
  scrollView: {
    width: '100%',
    height: '90%',
    padding: 16,
  },
  //style for font for lyrics
  scrollViewText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BottomSheet;
