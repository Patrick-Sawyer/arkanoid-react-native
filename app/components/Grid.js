import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  PixelRatio
} from 'react-native';

import Levels from "../levels/levels";
const imageCache = require("../images/cracked.png");

class Grid extends Component{

  state = {
    brickArray: Levels[this.props.level]
  }

  cracked = (bool) => {
    if(bool){
      return (
        <Image
          style={styles.brickImage}
          source={imageCache}
          resizeMode={"contain"}
          resizeMethod={"resize"}
        />
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
              borderColor: "rgba(100,100,100,0.05)",
              borderWidth: 2,
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
        </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brick: {
    flex: 1,
    height: "100%",
  },
    brickGrid: {
    flex: 1,
  },
  brickRow: {
    flexDirection: "row",
    flex: 1,
  },
  space: {
    flex: 1.2
  },
  brickImage: {
    flex: 1,
    height: "100%",
    width: "100%",
    opacity: 0.7
  }
});

export default Grid;
