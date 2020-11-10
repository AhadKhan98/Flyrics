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
  //function called when user wants to select audio file from device
  pickAudio = async () => {
    //check to see if there are required permission or not and request if not
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    //checks if the permission is granted
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      try {
        //launches activity to pick a document
        const res = await DocumentPicker.pick({
          //specifies that document must be an audio file
          type: DocumentPicker.types.audio,
        });
        //return the details of the audio file
        this.props.setSong(res);
      } catch (err) {
        //catches if there are any errors
        console.log(err);
      }
    }
  };

  //process lyrics that are being received from the aPi
  processLyrics = (lyrics) => {
    let string = '';
    for (let key in lyrics) {
      if (lyrics.hasOwnProperty(key)) {
        string += lyrics[key].text + '\n';
      }
    }
    return string;
  };

  //makes request and uploads file to process to the API
  uploadFile = async () => {
    //sets isLoading to true to trigger LoadingAnimation
    this.props.setIsLoading(true);

    //Creates FormData to send with the POST request
    let formData = new FormData();
    formData.append('file', {
      uri: this.props.song.uri,
      name: 'sample',
      type: this.props.song.type,
    });
    console.log(this.props.song);

    //creates an object for options that includes form data, headers, and request method
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    //makes request to a local server
    fetch('http://10.0.2.2:5000/uploader', options)
      //receives data, converts it into JSON
      .then((data) => data.json())
      //processes lyrics and updates the state of App component
      .then((data) => {
        //call to process lyrics
        let lyrics = this.processLyrics(data);
        //updating state of the App component
        this.props.setAppState({
          song: null, //sets song to null once a song is processed
          lyrics, //returns the lyrics of the song
          isLoading: false, //sets isLoading to false to remove loading animation
          showModal: true, //showModal to true, to show the lyrics
        });
      })
      //catches any errors while making the network request
      .catch((err) => console.error(err));
  };

  render() {
    // if song prop is null option to select song
    // otherwise option to upload
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
  //Actual button
  button: {
    width: '40%',
    padding: 12,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 8,
  },
  //style for view enclosing button
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  //styles for button text
  buttonText: {
    color: Colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default MainButton;
