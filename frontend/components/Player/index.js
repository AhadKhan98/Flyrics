import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/dist/SimpleLineIcons';

import Colors from '../../config/colors';
import PlayAnimation from '../PlayAnimation';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      time: '0m:0s / 0m:0s',
      interval: false,
    };
    this.finishedPlayingSubscription = null;
  }

  componentDidMount() {
    SoundPlayer.loadUrl(this.props.song.uri);
    this.finishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      (_) => {
        this.getInfo();
        SoundPlayer.loadUrl(this.props.song.uri);
        this.setState({playing: false, time: '0m:0s / 0m:0s'}, this.getInfo);
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
        {this.state.playing && <PlayAnimation />}
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
