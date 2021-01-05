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

class SliderAndBall extends Component {

    state = { 
        currentWidth: screenWidth/4,
        sliderActive: false,
        leftPosition: parseInt(screenWidth/2 - screenWidth/8),
        rightPosition: parseInt(screenWidth/2 + screenWidth/8),
        oldFingerPostion: null,
        ballPositionLeft: parseInt(screenWidth/2 - 15),
        ballPositionBottom: 40,
        ballStuck: true,
        thumbYStartPosition: null,
        weaponFired: true,
        ballInterval: null,
        ballSpeed: 10,
        ballDirectionX: 0,
        ballDirectionY: 1,
        gameHeight: null,
    }

    sliderMove = (position) => {

        //NEEDS A PRETTY SERIOUS REFACTOR
        position = parseInt(position)
        let leftEdge = this.state.leftPosition;
        let rightEdge = leftEdge + this.state.currentWidth;
        let difference = position - this.state.oldFingerPostion;
        let ballPositionInRelationToSlider = this.state.ballPositionLeft - leftEdge;

        if(position < leftEdge){
            this.setState({
                leftPosition: position,
                rightPosition: position + this.state.currentWidth,
            }, () => {
                this.ifBallStuck(this.state.leftPosition + ballPositionInRelationToSlider)
            })
        }else if(position > rightEdge){
            this.setState({
                leftPosition: position - this.state.currentWidth,
                rightPosition: position + this.state.currentWidth,
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
                rightPosition: newLeftPosition + this.state.currentWidth,
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
                ballPositionBottom: 10,
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

    //BALL MOVING SECTION
    //BALL MOVING SECTION
    //BALL MOVING SECTION
    //BALL MOVING SECTION

    animateBall = () => {
        this.setState({
            ballStuck: false,
            ballInterval: setInterval(() => {
                this.calculateNewPosition();
            }, 33)
        });

    }

    ballTick = () => {

    }

    calculateNewPosition = () => {
        if(!this.state.gameHeight){
            return null;
        }

        let newVertical = parseInt(this.state.ballPositionBottom + this.state.ballDirectionY * this.state.ballSpeed);
        let newHorizontal = parseInt(this.state.ballPositionLeft + this.state.ballDirectionX * this.state.ballSpeed);

        //BOOLEANS

        let topWallImpact = (newVertical > this.state.gameHeight);
        let leftWallImpact = (newHorizontal <= 0);
        let rightWallImpact = (newHorizontal >= screenWidth - 30);
        let sliderImpact = (this.state.ballDirectionY < 0) &&((newVertical <= 40) && (newHorizontal >= (this.state.leftPosition - 30)) && (newHorizontal <= (this.state.rightPosition)));
        let dead = (newVertical <= 40 && ((newHorizontal < this.state.leftPosition) || (newHorizontal > this.state.rightPosition)));
        
        let ballDirectionY = this.state.ballDirectionY;
        let ballDirectionX = this.state.ballDirectionX;

        if(topWallImpact){
            newVertical = this.state.gameHeight;
            ballDirectionY = 0 - ballDirectionY;
        }else if(sliderImpact){
            let [newX, newY] = this.calculateNewAngle(newHorizontal);
            console.log(newX, newY)
            newVertical = 40,
            ballDirectionY = newY;
            ballDirectionX = newX;
        }else if(dead){
            //WHAT IF DEAD!!!!!!!!!!!!!!!!!!!
        }

        if(leftWallImpact){
            newHorizontal = 0;
            ballDirectionX = 0 - ballDirectionX;
        }else if(rightWallImpact){
            newHorizontal = screenWidth - 30;
            ballDirectionX = 0 - ballDirectionX;
        }

        this.setState({
            ballDirectionX: ballDirectionX,
            ballDirectionY: ballDirectionY,
            ballPositionLeft: newHorizontal,
            ballPositionBottom: newVertical
        })
    }

    calculateNewAngle = (newHorizontal) => {
        let positionOnSliderAsFraction = ((newHorizontal + 30 - this.state.leftPosition)/(this.state.rightPosition - this.state.leftPosition + 30)).toFixed(2);
        let newX = ((positionOnSliderAsFraction - 0.5) * 1.5).toFixed(2);
        let newY = Math.sqrt(1 - newX * newX).toFixed(2);
        return [newX, newY]
    }

    slider = () => {
        return (
            <View style={styles.sliderContainer}
                onStartShouldSetResponder={(event) => {
                    const pageX = Math.round(event.nativeEvent.pageX);
                    const pageY = Math.round(event.nativeEvent.pageY);

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
            <View 
                onLayout={(event) => {
                var {height} = event.nativeEvent.layout;
                this.setState({
                    gameHeight: height - 30,
                })
              }}
              style={styles.container}>
                {this.ball()}
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


