import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView,
  View,
  Modal,
  Pressable,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AnimatedLoader from 'react-native-animated-loader';

import colors from './config/colors';
import Recorder from './components/Recorder';
import Player from './components/Player';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: null,
      lyrics: '',
      showModal: false,
      isLoading: false,
    };
    this._onFinishedPlayingSubscription = null;
  }

  pickAudio = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        const res = await DocumentPicker.pick({
          type: DocumentPicker.types.audio,
        });
        this.setSong(res);
      } catch (err) {
        console.log(err);
      }
    }
  };

  setSong = (song) => {
    this.setState({song});
  };

  uploadFile = async () => {
    this.setState({isLoading: true});
    let formData = new FormData();
    formData.append('file', {
      uri: this.state.song.uri,
      name: 'sample',
      type: this.state.song.type,
    });
    console.log(this.state.song);

    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    fetch('http://10.0.2.2:5000/uploader', options)
      .then((data) => data.json())
      .then((data) => {
        let lyrics = this.processLyrics(data);
        this.setState({song: null, lyrics, isLoading: false, showModal: true});
      })
      .catch((err) => console.error(err));
  };

  processLyrics = (lyrics) => {
    let string = '';
    for (let key in lyrics) {
      if (lyrics.hasOwnProperty(key)) {
        string += lyrics[key].text + '\n';
      }
    }
    return string;
  };

  render() {
    const buttonText = this.state.song ? 'UPLOAD' : 'SELECT';
    const buttonColor = this.state.song ? colors.green : colors.red;
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        {!this.state.isLoading ? (
          <SafeAreaView style={styles.main}>
            {this.state.song ? (
              <Player song={this.state.song} />
            ) : (
              <Recorder setSong={this.setSong} />
            )}
            <View style={styles.view}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: buttonColor}]}
                onPress={this.state.song ? this.uploadFile : this.pickAudio}>
                <Text style={styles.text}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
            {/*Diffrent component*/}
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
                        {this.state.lyrics
                          ? this.state.lyrics
                          : 'Find your lyrics here :)'}
                      </Text>
                    </ScrollView>
                  </View>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.loaderView}>
            <View style={styles.loadingTextView}>
              <Text style={styles.scrollViewText}>
                Writing a song for you 😉
              </Text>
            </View>
            <AnimatedLoader
              visible={this.state.isLoading}
              overlayColor="rgba(255,255,255,0)"
              animationStyle={styles.lottie}
              speed={1}
              source={require('./animations/loading.json')}
            />
          </SafeAreaView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheet: {
    height: 40,
    width: '100%',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: colors.black,
    borderStyle: 'solid',
    borderWidth: 0.05,
  },
  bottomSheetRect: {
    width: 36,
    height: 8,
    backgroundColor: '#bfbfbf',
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 1,
    shadowRadius: 16.0,
    elevation: 24,
  },
  button: {
    width: '40%',
    padding: 12,
    backgroundColor: colors.red,
    alignItems: 'center',
    borderRadius: 8,
  },
  loaderView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTextView: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 12,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  main: {
    backgroundColor: colors.white,
    height: 100,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    backgroundColor: colors.white,
    height: '75%',
    width: '100%',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    elevation: 64,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
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
  view: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default App;
