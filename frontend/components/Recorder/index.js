import React from 'react';
import {TouchableOpacity, StyleSheet, Platform, Text, View} from 'react-native';
import {AudioUtils, AudioRecorder} from 'react-native-audio';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';

import Colors from '../../config/colors';

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.MusicDirectoryPath + '/test3.aac',
      hasPermission: undefined,
    };
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({hasPermission: isAuthorised});

      if (!isAuthorised) {
        return;
      }

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

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

  _finishRecording = (_, filePath, fileSize) => {
    this.props.setSong({
      uri: 'file://' + filePath,
      type: 'audio/aac',
      name: 'test3.aac',
    });
  };

  //move to different component
  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 48000,
      Channels: 2,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 128000,
    });
  }

  //different component
  _record = async () => {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true, paused: false});

    try {
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  };

  // different component
  _stop = async () => {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({stoppedRecording: true, recording: false, paused: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

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
      <View style={styles.microphone}>
        <TouchableOpacity
          onPress={this.state.recording ? this._stop : this._record}>
          <Icon
            name={this.state.recording ? 'control-pause' : 'microphone'}
            size={125}
            color={Colors.red}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.currentTime}s</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  microphone: {
    position: 'absolute',
    top: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 22,
    marginTop: 12,
  },
});

export default Recorder;
