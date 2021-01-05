import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';

const gradient = ['rgba(255,255,255,0.3)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'];
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
const imageCache2 = require("../images/grunge2.png");

class SliderAndBall extends Component {
    state = { 
        currentWidth: screenWidth/4,
        sliderActive: false,
        leftPosition: screenWidth/2 - screenWidth/8,
        oldFingerPostion: null,
        ballPositionLeft: (screenWidth/2 - 15),
        ballPositionBottom: 40,
        ballStuck: true,
        thumbYStartPosition: null,
        weaponFired: true,
        ballInterval: null,
        ballSpeed: 5,
        ballDirectionX: 1,
        ballDirectionY: 0,
    }

    sliderMove = (position) => {

        //NEEDS A PRETTY SERIOUS REFACTOR

        let leftEdge = this.state.leftPosition;
        let rightEdge = leftEdge + this.state.currentWidth;
        let difference = position - this.state.oldFingerPostion;
        let ballPositionInRelationToSlider = this.state.ballPositionLeft - leftEdge;

        if(position < leftEdge){
            this.setState({
                leftPosition: position,
            }, () => {
                this.ifBallStuck(this.state.leftPosition + ballPositionInRelationToSlider)
            })
        }else if(position > rightEdge){
            this.setState({
                leftPosition: position - this.state.currentWidth,

            }, () => {
                this.ifBallStuck(this.state.leftPosition + ballPositionInRelationToSlider)
            })
        }else{

            let newLeftPosition = this.state.leftPosition + difference;
            if(newLeftPosition < 0){
                newLeftPosition = 0;
            }else if(newLeftPosition > (screenWidth - this.state.currentWidth)){
                newLeftPosition = screenWidth - this.state.currentWidth;
            }
            this.setState({
                leftPosition: newLeftPosition,
            }, () => {
                this.ifBallStuck(this.state.leftPosition + ballPositionInRelationToSlider)
            })
        }

        //CODE TO UPDATE PARENT WITH SLIDER POSITION - WILL NEED TO ADD BALL POSITION
        //this.props.setSliderPosition(this.state.leftPosition, this.state.leftPosition + this.state.currentWidth);

        this.setState({
            oldFingerPostion: position
        });
    }

    ifBallStuck = (newValue) => {
        if(this.state.ballStuck){
            this.setState({
                ballPositionLeft: newValue,
                ballPositionBottom: 40,
            })
        }
    }

    ball = () => {
        return (
            <View style={[styles.ball, {
                bottom: this.state.ballPositionBottom, 
                left: this.state.ballPositionLeft
            }]}>
                <RadialGradient 
                style={{
                        height: 30,
                        width: 30,
                    }}
                colors={['black','#8f8f8f','#bfbfbf','#e6e6e6']}
                center={[15,40]}
                radius={30}> 
                </RadialGradient>
                
            </View>
        );
    }

    fireWeapon = () => {
        if(this.state.ballStuck){
            this.animateBall()
        }else{
            //FIRE WEAPON IF ONE IS AVAILABLE
        }
    }

    animateBall = () => {
        this.setState({
            ballStuck: false,
        })
    }

    ballTick = () => {

    }

    slider = () => {
        return (
            <View style={styles.sliderContainer}
                onStartShouldSetResponder={(event) => {
                    const pageX = Math.round(event.nativeEvent.pageX, 0);
                    const pageY = Math.round(event.nativeEvent.pageY, 0);

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
                    const pageX = Math.round(event.nativeEvent.pageX, 0);
                    const pageY = Math.round(event.nativeEvent.pageY, 0);

                    let difference = pageX - this.state.oldFingerPostion;
                    if(difference >= 1 || difference <= -1){
                        if(this.state.sliderActive){
                            this.sliderMove(pageX);
                            if((pageY < (this.state.thumbYStartPosition - screenHeight/8)) && !this.state.weaponFired){
                                this.setState({
                                    weaponFired: true,
                                })
                                this.fireWeapon();
                            }else if(pageY > (this.state.thumbYStartPosition - 20)){
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
            <View style={styles.container}>
                {this.ball()}
                {this.slider()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 40,
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
        height: "100%",
        zIndex: 2,
    },
    ball: {
        height: 30,
        width: 30,
        borderRadius: 15,
        position: "absolute",
        overflow: "hidden",
        zIndex: 1,
    }
})
 
export default SliderAndBall;


