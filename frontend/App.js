/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';
import SoundPlayer from 'react-native-sound-player';

import colors from './config/colors';
import Recorder from './components/Recorder';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: null,
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
        this.setState({song: res});
      } catch (err) {
        throw err;
      }
    }
  };

  uploadFile = async () => {
    let formData = new FormData();
    formData.append('file', {
      uri: this.state.song.uri,
      name: this.state.song.name,
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
        console.log(data);
        this.setState({song: null});
      })
      .catch((err) => console.error(err));
  };

  render() {
    const buttonText = this.state.song ? 'UPLOAD' : 'SELECT';
    const buttonColor = this.state.song ? colors.green : colors.red;
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <SafeAreaView style={styles.main}>
          {this.state.song ? (
            <TouchableOpacity>
              <Icon
                name={this.state.playing ? 'control-stop' : 'control-play'}
                size={125}
                color={colors.green}
              />
            </TouchableOpacity>
          ) : (
            <Recorder />
          )}
          {/* <Text>{this.state.currentTime}</Text> */}
          <TouchableOpacity
            style={[styles.button, {backgroundColor: buttonColor}]}
            onPress={this.state.song ? this.uploadFile : this.pickAudio}>
            <Text style={styles.text}>{buttonText}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Icon name="trash" size={28} />
          </TouchableOpacity> */}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.red,
    borderRadius: 8,
    marginBottom: 12,
  },
  main: {
    backgroundColor: colors.white,
    height: 100,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  microphone: {
    position: 'relative',
    top: '-50%',
  },
  text: {
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default App;
