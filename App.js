import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
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
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {"LEVEL: " + (this.state.level + 1)}
          </Text>
        </View>
        <View style={styles.gameContainer}>
          <Grid
            level={this.state.level}
          />
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
   container: {
     backgroundColor: "#b8b8b8",
     flex: 1,
   },
   title:{
     height: 50,
     justifyContent: "center",
     alignItems: "center"
   },
   titleText: {
    fontSize: 30,
    color: "#363636",
    fontWeight: "bold"
   },
   gameContainer: {
     flexGrow: 1
   }
});

export default App;
