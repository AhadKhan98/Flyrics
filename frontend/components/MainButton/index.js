import React from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import Colors from '../../config/colors';

class MainButton extends React.Component {
  pickAudio = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        const res = await DocumentPicker.pick({
          type: DocumentPicker.types.audio,
        });
        this.props.setSong(res);
      } catch (err) {
        console.log(err);
      }
    }
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

  uploadFile = async () => {
    this.props.setIsLoading(true);
    let formData = new FormData();
    formData.append('file', {
      uri: this.props.song.uri,
      name: 'sample',
      type: this.props.song.type,
    });
    console.log(this.props.song);

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
        this.props.setAppState({
          song: null,
          lyrics,
          isLoading: false,
          showModal: true,
        });
      })
      .catch((err) => console.error(err));
  };

  render() {
    const buttonText = this.props.song ? 'UPLOAD' : 'SELECT';
    const buttonColor = this.props.song ? Colors.green : Colors.red;
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: buttonColor}]}
          onPress={this.props.song ? this.uploadFile : this.pickAudio}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    padding: 12,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default MainButton;
