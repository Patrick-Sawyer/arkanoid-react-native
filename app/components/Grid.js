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

const brickHeight = (parseInt((screenHeight * PixelRatio.get()) / 30))/PixelRatio.get();

class Grid extends Component{

  state = {
    brickArray: Levels[this.props.level],
    leftSliderPostion: parseInt(screenWidth/2 - screenWidth/8),
    rightSliderPosition: parseInt(screenWidth/2 + screenWidth/8),
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

  gradient = (cracked) => {
      return (
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)","rgba(0,0,0,0)", "rgba(255,255,255,0.2)"]}
          style={{flex: 1, overflow: "hidden"}}
        >
          <Image
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

  brick = (brick) => {
    return (
      <View 
        key={brick.column} 
        style={{flex: 1}}
      >
        <View 
          style={[
            styles.brick, 
            {
              backgroundColor: brick.color
            }
          ]} 
        >
          {this.gradient(brick.cracked)}
        </View>
      </View>
    )
  }

  renderRow = (rowArray, index) => {

    let emptyBrick = (index) => {
      return (
        <View key={index} style={styles.emptyBrick}/>
      )
    } 

    let array = [];
    for(let i = 0; i <= 7; i++){
      array.push(emptyBrick(i))
    }

    for(let i = 0; i < rowArray.length; i++){
      let column = rowArray[i].column;
      array[column] = this.brick(rowArray[i], i)
    }
    return (
      <View key={index} style={styles.brickRow}>
        {array}
      </View>
    )
  }

  renderBricks = () => {
    let array = []
    for(let i = 0; i < 12; i++){
      let bricksInThisRow = this.state.brickArray.filter((brick) => {
        if(brick.row == i){
          return true;
        }
      })
      array.push(this.renderRow(bricksInThisRow, i));
    }
    return array;
  }

  setSliderPosition = (left, right) => {

    this.setState({
      leftSliderPostion: left,
      rightSliderPosition: right,
    })
  }

  render = () => {
    return (
        <View 
          key={"grid"} 
          style={styles.container}
        >
          <View style={styles.gameSpace}>
            <View style={styles.brickGrid}>
              {this.renderBricks()}
            </View>
          </View>
          <View style={{position: "absolute", bottom: 0, height: "100%", width: "100%"}}>
            <SliderAndBall
              setSliderPosition={this.setSliderPosition}

            />
          </View>
        </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brick: {
    height: brickHeight,
    borderBottomColor: "rgba(0,0,0,0.35)",
    borderRightColor: "rgba(0,0,0,0.15)",
    borderLeftColor:"rgba(0,0,0,0.1)",
    borderTopColor: "rgba(255,255,255,0.1)",
    borderWidth: 4,
  },
  emptyBrick: {
    height: brickHeight,
    flex: 1,
  },
  brickGrid: {
    
  },
  brickRow: {
    flexDirection: "row",
  },
  gameSpace: {
    flexGrow: 1,
  },
  brickImage: {
    flex: 1,
    height: "100%",
    width: "100%",
  }
});

export default Grid;
