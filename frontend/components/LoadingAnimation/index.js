import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

class LoadingAnimation extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.loaderView}>
        <View style={styles.loadingTextView}>
          <Text style={styles.loadingText}>Writing a song for you 😉</Text>
        </View>
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
  loaderView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingTextView: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 12,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default LoadingAnimation;
