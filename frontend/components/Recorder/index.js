import React from 'react';
import {TouchableOpacity, StyleSheet, Platform, Text, View} from 'react-native';
import {AudioUtils, AudioRecorder} from 'react-native-audio';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';

import Colors from '../../config/colors';
import PlayAnimation from '../PlayAnimation';

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0.0, //current duration of recording
      recording: false, //if audio is being recorded
      stoppedRecording: false, //if recording has been stopped
      audioPath: AudioUtils.MusicDirectoryPath + '/test3.aac', //sets the path of the recording
      hasPermission: undefined, //checks if recording permissions have been granted
    };
  }

  componentDidMount() {
    //Requesting audio recording permission once the component is mounted
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({hasPermission: isAuthorised});

      if (!isAuthorised) {
        return;
      }

      //sets the path and file name to save audio
      this.prepareRecordingPath(this.state.audioPath);

      //adds callback to update currentTime property for recording
      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      //calls _finsihedRecording once recording is finished
      AudioRecorder.onFinished = (data) => {
        if (Platform.OS === 'ios') {
          this._finishRecording(
            data.status === 'OK',
            data.audioFileURL,
            data.audioFileSize,
          );
        }
      };
    });
  }

  //return detail of the recording to App component
  _finishRecording = (_, filePath, fileSize) => {
    this.props.setSong({
      uri: 'file://' + filePath,
      type: 'audio/aac',
      name: 'test3.aac',
    });
  };

  //Sets up properties for recording
  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 48000,
      Channels: 2,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 128000,
    });
  }

  //start recording
  _record = async () => {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    //checks if the recording permission is provided
    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    //adds path to save recording to AudioRecorder
    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    //sets recording to true to indicate recording started
    this.setState({recording: true});

    try {
      //starts recording
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  };

  // stops recording
  _stop = async () => {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    //updates state according to that
    this.setState({stoppedRecording: true, recording: false});

    try {
      //saves path for audio file
      const filePath = await AudioRecorder.stopRecording();

      //calls _finishesRecording once recording is completed
      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      //View to contain rest of the components
      <View style={styles.microphone}>
        {/* Displays animation if audio is being recorded */}
        {this.state.recording && <PlayAnimation />}
        <TouchableOpacity
          onPress={this.state.recording ? this._stop : this._record}>
          {!this.state.recording ? (
            <Icon
              name={this.state.recording ? 'control-pause' : 'microphone'}
              size={125}
              color={Colors.red}
            />
          ) : (
            <TouchableOpacity onPress={this._stop}>
              <Icon name="control-pause" size={32} color={Colors.red} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {/* Text to display currentTime of recording */}
        <Text style={styles.text}>{this.state.currentTime}s</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //used to place the component in the above portion of screen
  microphone: {
    position: 'absolute',
    top: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //style for font
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 22,
    marginTop: 12,
  },
});

export default Recorder;
