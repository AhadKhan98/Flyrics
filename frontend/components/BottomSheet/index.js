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
      showModal: false,
    };
  }
  componentDidMount() {
    const {showModal} = this.props;
    this.setState({showModal});
  }
  render() {
    return (
      <>
        <TouchableOpacity
          style={styles.bottomSheet}
          onPress={() => this.setState({showModal: true})}>
          <View style={styles.bottomSheetRect} />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}>
          <View style={styles.modal}>
            <Pressable
              onPress={() => this.setState({showModal: false})}
              style={styles.modalPressable}
            />
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

const styles = StyleSheet.create({
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
  modal: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  modalPressable: {
    flex: 1,
  },
  modalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
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
  scrollView: {
    width: '100%',
    height: '90%',
    padding: 16,
  },
  scrollViewText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BottomSheet;
