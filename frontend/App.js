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
  ScrollView,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';

import colors from './config/colors';
import Recorder from './components/Recorder';
import Player from './components/Player';

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
      lyrics: '',
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
        throw err;
      }
    }
  };

  setSong = (song) => {
    this.setState({song});
  };

  uploadFile = async () => {
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
        this.setState({song: null, lyrics});
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
        <SafeAreaView style={styles.main}>
          {this.state.song ? (
            <Player song={this.state.song} />
          ) : (
            <Recorder setSong={this.setSong} />
          )}
          <View style={styles.scrollView}>
            <ScrollView>
              <Text style={styles.scrollViewText}>{this.state.lyrics}</Text>
            </ScrollView>
          </View>
          <View style={styles.view}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: buttonColor}]}
              onPress={this.state.song ? this.uploadFile : this.pickAudio}>
              <Text style={styles.text}>{buttonText}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.trash}>
              <Icon name="trash" size={36} color={colors.yellow} />
            </TouchableOpacity> */}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    padding: 12,
    backgroundColor: colors.red,
    alignItems: 'center',
    borderRadius: 8,
  },
  main: {
    backgroundColor: colors.white,
    height: 100,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
  scrollView: {
    flex: 0.4,
    marginBottom: 24,
    width: '100%',
    padding: 16,
  },
  scrollViewText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  trash: {
    position: 'absolute',
    left: '75%',
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
