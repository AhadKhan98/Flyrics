import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';

import colors from './config/colors';
import Recorder from './components/Recorder';
import Player from './components/Player';
import BottomSheet from './components/BottomSheet';
import LoadingAnimation from './components/LoadingAnimation';
import MainButton from './components/MainButton';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: null,
      lyrics: '',
      showModal: false,
      isLoading: false,
    };
  }

  setSong = (song) => {
    this.setState({song});
  };

  setAppState = ({song, lyrics, isLoading, showModal}) => {
    this.setState({song, lyrics, isLoading, showModal});
  };

  setIsLoading = (isLoading) => {
    this.setState({isLoading});
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        {!this.state.isLoading ? (
          <SafeAreaView style={styles.main}>
            {this.state.song ? (
              <Player song={this.state.song} />
            ) : (
              <Recorder setSong={this.setSong} />
            )}
            <MainButton
              setAppState={this.setAppState}
              setIsLoading={this.setIsLoading}
              setSong={this.setSong}
              song={this.state.song}
            />
            <BottomSheet
              lyrics={this.state.lyrics}
              showModal={this.state.showModal}
            />
          </SafeAreaView>
        ) : (
          <LoadingAnimation isLoading={this.state.isLoading} />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.white,
    height: 100,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default App;
