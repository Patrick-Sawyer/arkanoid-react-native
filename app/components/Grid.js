import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  PixelRatio,
  Dimensions
} from 'react-native';

import Levels from "../levels/levels";
import Slider from "./Slider";

const imageCache = require("../images/cracked.png");

class Grid extends Component{

  state = {
    brickArray: Levels[this.props.level],
    sliderPosition: 0.5
  }

  cracked = (bool) => {
    if(bool){
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
              borderBottomColor: "rgba(0,0,0,0.3)",
              borderRightColor: "rgba(0,0,0,0.2)",
              borderLeftColor:"rgba(255,255,255,0.2)",
              borderTopColor: "rgba(255,255,255,0.3)",
              borderWidth: 4,
            },
          ]} 
        >
          {this.cracked(brickData.cracked && brickData.exists)}
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

  render = () => {
    return (
        <View key={"grid"} style={styles.container}>
            <View style={styles.brickGrid}>
            {this.renderBricks()}
            </View>
            <View style={styles.space}></View>
            <Slider/>
        </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brick: {
    height: parseInt(Dimensions.get("screen").height / 17) / PixelRatio.get(),
  },
  brickGrid: {
  },
  brickRow: {
    flexDirection: "row",
  },
  space: {
    flexGrow: 1
  },
  brickImage: {
    flex: 1,
    height: "100%",
    width: "100%",
    opacity: 0.5,

  }
});

export default Grid;
