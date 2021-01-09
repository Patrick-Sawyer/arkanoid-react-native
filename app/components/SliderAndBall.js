import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, PixelRatio } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';

const gradient = ['rgba(255,255,255,0.3)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'];
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
const brickHeight = (parseInt((screenHeight * PixelRatio.get()) / 30))/PixelRatio.get();
const brickWidth = screenWidth/7;
const imageCache2 = require("../images/grunge2.png");

import Ball from "./Ball";

class SliderAndBall extends Component {

    state = { 
        currentWidth: screenWidth/4,
        sliderActive: false,
        leftPosition: parseInt(screenWidth/2 - screenWidth/8),
        rightPosition: parseInt(screenWidth/2 + screenWidth/8),
        oldFingerPostion: null,
        thumbYStartPosition: null,
        weaponFired: true,
        ballPositionLeft: parseInt(screenWidth/2 - 15),
        ballPositionBottom: 40,
        ballStuck: true,
        weaponFireTally: 0,
    }

    sliderMove = (position) => {
        position = position.toFixed(2);
        let leftEdge = this.state.leftPosition;
        let rightEdge = leftEdge + this.state.currentWidth;
        let difference = position - this.state.oldFingerPostion;
        let ballPositionInRelationToSlider = this.state.ballPositionLeft - leftEdge;

        if(position < leftEdge){
            this.setState({
                leftPosition: parseInt(position),
                rightPosition: parseInt(position + this.state.currentWidth),
            }, () => {
                this.ifBallStuck(parseInt(this.state.leftPosition + ballPositionInRelationToSlider))
            })
        }else if(position > rightEdge){

            this.setState({
                
                leftPosition: parseInt(position - this.state.currentWidth),
                rightPosition: parseInt(position),
            }, () => {
                this.ifBallStuck(parseInt(this.state.leftPosition + ballPositionInRelationToSlider))
            })
        }else{
            
            let newLeftPosition = parseInt(this.state.leftPosition + difference);
            if(newLeftPosition < 0){
                newLeftPosition = 0;
            }else if(newLeftPosition > parseInt(screenWidth - this.state.currentWidth)){
                newLeftPosition = parseInt(screenWidth - this.state.currentWidth);
            }

            this.setState({
                leftPosition: newLeftPosition,
                rightPosition: parseInt(newLeftPosition + this.state.currentWidth),
            }, () => {
                this.ifBallStuck(parseInt(this.state.leftPosition + ballPositionInRelationToSlider))
            })
        }
        
        this.props.setSliderPosition(this.state.leftPosition, this.state.leftPosition + this.state.currentWidth);

        this.setState({
            oldFingerPostion: parseInt(position)
        });
    }

    fireWeapon = () => {

       this.setState({
           weaponFireTally: this.state.weaponFireTally + 1,
       })
    }

    ifBallStuck = (newValue) => {
        if(this.state.ballStuck){
            this.setState({
                ballPositionLeft: newValue,
                ballPositionBottom: 40,
            })
            this.forceUpdate();
        }
    }

    
    shouldComponentUpdate = () => {
        return false;
    }

    slider = () => {
        return (
            <View style={styles.sliderContainer}
                key={"slider"}
                onStartShouldSetResponder={(event) => {
                        const pageX = event.nativeEvent.pageX.toFixed(2);
                    const pageY = event.nativeEvent.pageY.toFixed(2);

                    this.setState({
                        oldFingerPostion: pageX
                    })
                    let leftEdge = this.state.leftPosition;
                    let rightEdge = this.state.leftPosition + this.state.currentWidth;
                    
                    if((pageX > leftEdge) && (pageX < rightEdge)){
                        this.setState({
                            sliderActive: true,
                            thumbYStartPosition: pageY
                        })
                    };
                }}
                onMoveShouldSetResponder={(event) => {
                    const pageX = Math.round(event.nativeEvent.pageX);
                    const pageY = Math.round(event.nativeEvent.pageY);

                    let difference = pageX - this.state.oldFingerPostion;
                    if(difference >= 1 || difference <= -1){
                        if(this.state.sliderActive){
                            this.sliderMove(pageX);
                            if((pageY < (this.state.thumbYStartPosition - screenHeight/8)) && !this.state.weaponFired){
                                
                                this.setState({
                                    weaponFired: true,
                                })
                                this.fireWeapon();
                            }else if(pageY > (this.state.thumbYStartPosition - 50)){
                                this.setState({
                                    weaponFired: false,
                                })
                            }
                        };
                    }
                }}
                onResponderRelease={() => {
                    this.setState({
                        sliderActive: false,
                        weaponFired: false,
                    });
                }}
            >
                <View 
                    style={[styles.slider, 
                        {
                            left: this.state.leftPosition,
                            backgroundColor: "grey",
                            width: this.state.currentWidth,
                            borderRadius: 12
                        }
                ]}>
                    <LinearGradient 
                        colors={gradient} 
                        style={{width: 20, backgroundColor: "silver", borderTopLeftRadius: 12, borderBottomLeftRadius: 12}}
                    />
                    <LinearGradient 
                        colors={gradient} 
                        style={{width: (this.state.currentWidth - 40), backgroundColor: "grey"}}
                    />
                    <LinearGradient 
                        colors={gradient} 
                        style={{width: 20, backgroundColor: "silver", borderTopRightRadius: 12, borderBottomRightRadius: 12}}
                    />
                    <Image 
                        source={imageCache2}
                        style={{height: "100%", width: this.state.currentWidth, opacity: 0.7, overflow: "hidden", borderRadius: 12, position: "absolute", top: 0}}
                        resizeMode={"cover"}
                    />
                </View>
            </View>
        )
    }

    render = () => { 
        return ( 
            <View 
                onLayout={(event) => {
                var {height} = event.nativeEvent.layout;
                this.setState({
                    gameHeight: height - 30,
                })
              }}
              style={styles.container}>
                <Ball 
                    ballPositionLeft={this.state.ballPositionLeft}
                    ballPositionBottom={this.state.ballPositionBottom}
                    ballStuck={this.state.ballStuck}
                    weaponFireTally={this.state.weaponFireTally}
                    gameHeight={this.state.gameHeight}
                    sliderLeftPosition={this.state.leftPosition}
                    sliderRightPosition={this.state.rightPosition}
                    X={0}
                    Y={1}
                />
                {this.slider()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },
    slider: {
        height: 24,
        flexDirection: "row",
        width: "100%",
        position: "absolute",
        left: 50,
    },
    sliderContainer: {
        height: 40,
        position: "absolute",
        bottom: 0,
        zIndex: 2,
        width: "100%"  
    },
})
 
export default SliderAndBall;


