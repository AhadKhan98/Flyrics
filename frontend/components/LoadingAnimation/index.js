import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

class LoadingAnimation extends React.Component {
  render() {
    return (
      // SafeAreaView for LoadingAnimation
      <SafeAreaView style={styles.loaderView}>
        {/* View to display text while loading*/}
        <View style={styles.loadingTextView}>
          <Text style={styles.loadingText}>Writing a song for you 😉</Text>
        </View>
        {/*Actual Animation*/}
        <AnimatedLoader
          visible={this.props.isLoading}
          overlayColor="rgba(255,255,255,0)"
          animationStyle={styles.lottie}
          speed={1}
          source={require('../../animations/loading.json')}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  //style to size loader view
  loaderView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //font style for loading text
  loadingText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  //style to place text at the bottom of the screen
  loadingTextView: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 12,
  },
  //to customize the size of animation
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default LoadingAnimation;
