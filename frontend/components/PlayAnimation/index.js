import React from 'react';
import {StyleSheet} from 'react-native';
import Animation from 'lottie-react-native';

class PlayAnimation extends React.Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <Animation
        ref={(animation) => {
          this.animation = animation;
        }}
        style={styles.lottie}
        source={require('../../animations/recording.json')}
        loop={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 175,
    height: 175,
  },
});

export default PlayAnimation;
