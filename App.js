import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar
} from 'react-native';

import Grid from "./app/components/Grid";

class App extends Component{

  state = {
    level: 0
  }

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={"#b8b8b8"} />
        <Grid
          level={this.state.level}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
   container: {
     backgroundColor: "#b8b8b8",
     flex: 1,
     paddingTop: 15
   },
});

export default App;
