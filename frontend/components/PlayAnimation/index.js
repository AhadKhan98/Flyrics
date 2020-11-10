import React from 'react';
import {StyleSheet} from 'react-native';
import Animation from 'lottie-react-native';

class PlayAnimation extends React.Component {
  //starts the animation once the component is mounted
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      //returns the animation
      <Animation
        //creates a reference for animation
        // which is used to play animation in componentDidMount
        ref={(animation) => {
          this.animation = animation;
        }}
        style={styles.lottie}
        source={require('../../animations/recording.json')} //selcting the animation from animation folder
        loop={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  //style to set the size of animations
  lottie: {
    width: 175,
    height: 175,
  },
});

export default PlayAnimation;
