import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  PixelRatio,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Levels from "../levels/levels";
import SliderAndBall from "./SliderAndBall";

const imageCache = require("../images/cracked.png");
const imageCache2 = require("../images/grunge2.png");

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

class Grid extends Component{

  state = {
    brickArray: Levels[this.props.level],
    leftSliderPostion: screenWidth/2 - screenWidth/8,
    rightSliderPosition: screenWidth/2 + screenWidth/8,
  }

  getRandomPosition = () => {
    let random = parseInt((Math.random() * 600) - 300);
    return random + "%";
  }

  getRandomOpacity = () => {
    let random = 0.2 + Math.random()/3;
    return random;
  }

  cracked = (cracked) => {
    if(cracked){
      return (
        <View style={{flex: 1, padding: 2}}>
          <Image
            style={styles.brickImage}
            source={imageCache}
            resizeMode={"contain"}
            resizeMethod={"resize"}
          />
        </View>
      )
    }
  }

  shouldComponentUpdate = () => {
    return false;
  }

  gradient = (exists, cracked) => {
    if(exists){
      return (
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)","rgba(0,0,0,0)", "rgba(255,255,255,0.2)"]}
          style={{flex: 1, overflow: "hidden"}}
        ><Image
            style={[styles.brickImage, {tintColor: "black", transform: [{scale: 7}], opacity: this.getRandomOpacity(), position: "relative", left: this.getRandomPosition(), top: this.getRandomPosition()}]}
            source={imageCache2}
            resizeMethod={"auto"}
            tintColor={"black"}
        />
        <View style={{position: "absolute", top: 0, height: "100%", width: "100%"}}>
          {this.cracked(cracked)}
        </View>
         
        </LinearGradient>
      )
    }
  }

  brick = (row, index) => {
    let brickData = this.state.brickArray[row][index];
    return (
      <View 
        key={"row" + row + "index" + index} 
        style={{flex: 1}}
      >
        <View 
          style={[
            styles.brick, 
            brickData.exists && {
              backgroundColor: brickData.color,
              borderBottomColor: "rgba(0,0,0,0.35)",
              borderRightColor: "rgba(0,0,0,0.15)",
              borderLeftColor:"rgba(0,0,0,0.1)",
              borderTopColor: "rgba(255,255,255,0.1)",
              borderWidth: 4,
            },
          ]} 
        >
          {this.gradient(brickData.exists, brickData.cracked)}
        </View>
      </View>
    )
  }

  renderRow = (index) => {

    let array = [];

    for(let i = 0; i < 7; i++){
      array.push(
        this.brick(index, i)
      )
    }

    return (
      <View key={index} style={styles.brickRow}>
        {array}
      </View>
    )
  }

  renderBricks = () => {
    let array = [];
    for(let i = 0; i < 12; i++){
      array.push(
        this.renderRow(i)
      )
    }
    return (
      array
    )
  }

  setSliderPosition = (left, right) => {

    this.setState({
      leftSliderPostion: left,
      rightSliderPosition: right,
    })
  }

  render = () => {
    return (
        <View key={"grid"} style={styles.container}>
            
            <View style={styles.gameSpace}>
              <View style={styles.brickGrid}>
                {this.renderBricks()}
              </View>
            </View>
            <SliderAndBall
              setSliderPosition={this.setSliderPosition}
            />
        </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brick: {
    height: (parseInt((screenHeight * PixelRatio.get()) / 30))/PixelRatio.get()
  },
  brickGrid: {
    
  },
  brickRow: {
    flexDirection: "row",
  },
  gameSpace: {
    flexGrow: 1,
    // borderWidth: 1
  },
  brickImage: {
    flex: 1,
    height: "100%",
    width: "100%",
  }
});

export default Grid;
