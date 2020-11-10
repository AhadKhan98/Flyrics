import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';

import colors from './config/colors';
import Recorder from './components/Recorder';
import Player from './components/Player';
import BottomSheet from './components/BottomSheet';
import LoadingAnimation from './components/LoadingAnimation';
import MainButton from './components/MainButton';

//Root component of the App
class App extends React.Component {
  //Constructor function to declare state variable
  constructor(props) {
    super(props);
    this.state = {
      song: null, //contains the details of the song
      lyrics: '', //has the lyrics of the song
      showModal: false, //showModal is true, when lyrics are being displayed
      isLoading: false, //isLoading is true, when backend is processing lyrics and LoadingAnimation is rendered
    };
  }

  //used to set song property of state
  setSong = (song) => {
    this.setState({song});
  };

  //used to update song, lyrics, isLoading, and showModal property
  setAppState = ({song, lyrics, isLoading, showModal}) => {
    this.setState({song, lyrics, isLoading, showModal});
  };

  //used to change isLoading property
  setIsLoading = (isLoading) => {
    this.setState({isLoading});
  };

  //returns the JSX to render
  render() {
    return (
      <>
        {/* Controls the behavior of Status Bar*/}
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        {/* Displays either the UI or LoadingAnimation depending upon the isloading property*/}
        {!this.state.isLoading ? (
          //Main container of the App
          <SafeAreaView style={styles.main}>
            {/*
              Displays either recorder or player depending upon the song property
              Displays Recorder component if song property is null
              Otherwise Player component
            */}
            {this.state.song ? (
              <Player song={this.state.song} />
            ) : (
              <Recorder setSong={this.setSong} />
            )}
            {/* MainButton component*/}
            <MainButton
              setAppState={this.setAppState}
              setIsLoading={this.setIsLoading}
              setSong={this.setSong}
              song={this.state.song}
            />
            {/* BottomSheet component to display lyrics */}
            <BottomSheet
              lyrics={this.state.lyrics}
              showModal={this.state.showModal}
            />
          </SafeAreaView>
        ) : (
          //LoadingAnimation player while audio is being processed to fetch lyrics
          <LoadingAnimation isLoading={this.state.isLoading} />
        )}
      </>
    );
  }
}

//Contains the styles for various components
const styles = StyleSheet.create({
  //styles for SafeAreaView component
  main: {
    backgroundColor: colors.white,
    height: 100,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default App;
