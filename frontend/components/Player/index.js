import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';

import Colors from '../../config/colors';
import PlayAnimation from '../PlayAnimation';

class Player extends React.Component {
  constructor(props) {
    super(props);
    //state object for Player component
    this.state = {
      playing: false, //indicates if an audio is being played or not
      time: '0m:0s / 0m:0s', //has the information about time duration of audio
      interval: false, //boolean value which indicates if there's an time interval actively updating time property
    };
    //event listener used to detect when a song has finished playing
    this.finishedPlayingSubscription = null;
  }

  componentDidMount() {
    //loads the song once component is mounted
    SoundPlayer.loadUrl(this.props.song.uri);
    //adds the event listener
    this.finishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      (_) => {
        this.getInfo();
        //loads song again
        //to reset time in SoundPlayer.getInfor
        SoundPlayer.loadUrl(this.props.song.uri);
        //sets playing to false and time to initial values
        this.setState({playing: false, time: '0m:0s / 0m:0s'}, this.getInfo);
      },
    );
    this.getInfo();
  }

  //used to play song
  _play = () => {
    SoundPlayer.play();
    this.setState({playing: true});
  };

  //used to pause song
  _stop = () => {
    SoundPlayer.pause();
    this.getInfo();
    this.setState({playing: false});
  };

  //used to convert and format time values to string
  convertTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    seconds = Math.floor(seconds);
    return `${minutes}m:${seconds}s`;
  };

  //used to get information such as time elapsed and duration of song
  //calling it when this.state.interval = true, clear time interval
  //calling it when this.state.interval = false, creates a new time interval
  getInfo = () => {
    if (!this.state.interval) {
      //calls SoundPlayer.getInfo to regularly update time property
      this.interval = setInterval(async () => {
        let time = await SoundPlayer.getInfo();
        let time0 = this.convertTime(time.currentTime);
        time = time0 + ' / ' + this.convertTime(time.duration);
        //updates the time property
        this.setState({time, interval: true});
      }, 1000);
    } else {
      //clears the intervak
      clearInterval(this.interval);
      //sets interval prop to false
      this.setState({interval: false});
    }
  };

  componentWillUnmount() {
    //stops playing music once component is unmounted
    SoundPlayer.stop();
    //removes event listeners once component is unmounted
    this.finishedPlayingSubscription.remove();
    //clears time interval once component is unmounted
    clearInterval(this.interval);
  }

  render() {
    return (
      //View to contain rest of the components
      <View style={styles.microphone}>
        {/* Displays animation if audio is being played */}
        {this.state.playing && <PlayAnimation />}
        {/* Button to play for pause song*/}
        <TouchableOpacity>
          {!this.state.playing ? (
            <Icon
              name={this.state.playing ? 'control-pause' : 'control-play'}
              size={125}
              color={Colors.green}
              onPress={this._play}
            />
          ) : (
            <TouchableOpacity onPress={this._stop}>
              <Icon name="control-pause" size={32} color={Colors.red} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {/* Text to display time duration etc */}
        <Text style={styles.text}>{this.state.time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //used to place the component in the above portion of screen
  microphone: {
    position: 'absolute',
    top: '15%',
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

export default Player;
