import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';

import Colors from '../../config/colors';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      time: '',
      interval: false,
    };
    this.finishedPlayingSubscription = null;
  }

  componentDidMount() {
    SoundPlayer.loadUrl(this.props.song.uri);
    this.finishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      (_) => {
        this.setState({playing: false});
      },
    );
    this.getInfo();
  }

  _play = () => {
    SoundPlayer.play();
    this.setState({playing: true});
  };

  _stop = () => {
    SoundPlayer.pause();
    this.getInfo();
    this.setState({playing: false});
  };

  convertTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;
    seconds = Math.floor(seconds);
    return `${minutes}m:${seconds}s`;
  };

  getInfo = () => {
    if (!this.state.interval) {
      this.interval = setInterval(async () => {
        let time = await SoundPlayer.getInfo();
        let time0 = this.convertTime(time.currentTime);
        time = time0 + ' / ' + this.convertTime(time.duration);
        this.setState({time, interval: true});
      }, 1000);
    } else {
      clearInterval(this.interval);
      this.setState({interval: false});
    }
  };

  componentWillUnmount() {
    this.finishedPlayingSubscription.remove();
    clearInterval(this.interval);
  }

  render() {
    return (
      <View style={styles.microphone}>
        <TouchableOpacity>
          <Icon
            name={this.state.playing ? 'control-pause' : 'control-play'}
            size={125}
            color={Colors.green}
            onPress={this.state.playing ? this._stop : this._play}
          />
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.time}</Text>
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

export default Player;
