import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image
} from 'react-native';

import Grid from "./app/components/Grid";
//<a href="https://www.freepik.com/vectors/background">Background vector created by starline - www.freepik.com</a>
class App extends Component{

  state = {
    level: 0,
    lives: 3
  }

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={"#6d7868"} />
        <View style={{flex: 0.1, width: "100%", justifyContent: "center", borderBottomWidth: 5, borderTopWidth: 5}}>
          <Image
            source={require("./app/images/danger.png")}
            style={{height: "100%", width: "100%"}}
 
            resizeMode={"stretch"}
          />
          <View style={styles.title}>
            <View style={styles.textBackground}>
              <Text style={[styles.titleText, {fontSize: 20}]}>
                {"LEVEL: " + (this.state.level + 1)}
              </Text>
            </View>
            <View style={styles.textBackground}>
            <Text style={[styles.titleText, {fontSize: 20}]}>
                {"LIVES: " + (this.state.lives)}
              </Text>
            </View>  
          </View>
        </View>
        <View style={styles.gameContainer}>
        <Image
            source={require("./app/images/grunge.png")}
            style={{height: "110%", width: "100%", position: "absolute", opacity: 0.025}}
 
            resizeMode={"stretch"}
          />
          <Grid
            level={this.state.level}
          />
        </View>
        <View style={{flex: 0.1, width: "100%", borderBottomWidth: 5, borderTopWidth: 5}}>
          <Image
            source={require("./app/images/danger.png")}
            style={{height: "100%", width: "100%"}}
 
            resizeMode={"stretch"}
          />
          <View style={styles.title}>
            <View style={styles.textBackground}>
              <Text style={styles.titleText}>
                {":blocks:"}
              </Text>
            </View>
            <View style={styles.textBackground}>
              <Text style={[styles.titleText, {fontSize: 12, paddingBottom: 2}]}>
                {"by Patrick Sawyer"}
              </Text>
            </View>  
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
   container: {
     backgroundColor: "#6d7868",
     flex: 1,
   },
   title:{
     height: "100%",
     width: "100%",
     justifyContent: "center",
     alignItems: "center",
     flexDirection: "row",
     justifyContent: "space-evenly",
     paddingBottom: 5,
     position: "absolute",
     alignContent: "center",
   },
   titleText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    textShadowColor: "#ffaa00",
    paddingHorizontal: 10,
   },
   textBackground: {
    backgroundColor: "rgba(255, 170, 0, 1)",
    borderRadius: 25,
    position: "relative", 
    top: 3
   },
   gameContainer: {
     flexGrow: 1,
   }
});

export default App;
