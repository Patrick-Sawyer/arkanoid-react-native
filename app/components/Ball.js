import React, { Component } from 'react';
import { View, Dimensions, PixelRatio, StyleSheet, Animated, Easing } from "react-native";
import RadialGradient from 'react-native-radial-gradient';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
const brickHeight = (parseInt((screenHeight * PixelRatio.get()) / 30))/PixelRatio.get();
const brickWidth = screenWidth/7;

class Ball extends Component {
    state = {

        //BALL STUFF

        ballPositionLeft: this.props.ballPositionLeft,
        ballPositionBottom: 0,
        ballStuck: this.props.ballStuck,
        // ballInterval: null,
        // ballSpeed: 10,
        pixelsPerSecond: 500, //Change for larger screen
        // ballDirectionX: this.props.X,
        // ballDirectionY: this.props.Y,
        ballDirectionX: 0,
        ballDirectionY: 1,
        offsetX: new Animated.Value(this.props.ballPositionLeft),
        offsetY: new Animated.Value(0),


        //OTHER STUFF

        gameHeight: null,
        frameLength: 10,
        weaponFireTally: this.props.weaponFireTally,
        sliderLeftPosition: this.props.sliderLeftPosition,
        sliderRightPosition: this.props.sliderRightPosition,
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.ballStuck !== prevProps.ballStuck) {
            this.setState({
                ballStuck: this.props.ballStuck
            })
        }else if(this.props.weaponFireTally !== prevProps.weaponFireTally){
            this.setState({
                weaponFireTally: this.props.weaponFireTally,
            }, () => {
                this.fireWeapon();
            });
        }else if(this.props.gameHeight !== prevProps.gameHeight){
            this.setState({
                gameHeight: this.props.gameHeight.toFixed(2) - 40,
            })
            
        }else if(this.state.ballStuck){
            if(this.props.ballPositionLeft !== prevProps.ballPositionLeft) {
                this.setState({
                    ballPositionLeft: this.props.ballPositionLeft,
                    offsetX: new Animated.Value(this.props.ballPositionLeft),
                    ballPositionBottom: 0,
                })
            }
        }else if(!this.state.ballStuck){
            if(this.props.sliderLeftPosition !== prevProps.sliderLeftPosition){
                this.setState({
                    sliderLeftPosition: this.props.sliderLeftPosition,
                })
            }
            if(this.props.sliderRightPosition !== prevProps.sliderRightPosition){
                this.setState({
                    sliderRightPosition: this.props.sliderRightPosition,
                })
            }
        }
    }

    calculateNewAngle = async () => {
        let newX = (((this.state.ballPositionLeft - (this.state.sliderLeftPosition - 30))/(this.state.sliderRightPosition - (this.state.sliderLeftPosition - 30)) - 0.5)* 1.5).toFixed(2);
        let newY = Math.sqrt(1 - (newX * newX)).toFixed(2)
        console.log(newX, newY)
        this.setState({
            ballDirectionX: newX,
            ballDirectionY: newY,
        }, () => {
            return true;
        })
    }

    animateBall = async () => {

        if(this.state.ballPositionBottom <= 0){
            if((this.state.ballPositionLeft < (this.state.sliderLeftPosition - 30)) || this.state.ballPositionLeft > this.state.sliderRightPosition){
                return null;
            }else{
                await this.calculateNewAngle()
            }
        }


        let nextEdgeHitInfo = this.nextEdgeHit();

        //CALCULATE IF BRICK OR EDGE HIT

        let nextHit = nextEdgeHitInfo;

        this.animate(
            nextEdgeHitInfo.newLeftPosition,
            nextEdgeHitInfo.newBottomPosition,
            nextEdgeHitInfo.time + 25
        )
        
        setTimeout(this.animateBall, nextEdgeHitInfo.time);

        if(nextHit.flipPolarity == "X"){
            this.setState({
                ballDirectionX: 0 - this.state.ballDirectionX,
            })
        }else if(nextHit.flipPolarity == "Y"){
            this.setState({
                ballDirectionY: 0 - this.state.ballDirectionY,
            })
        }

        if(this.state.ballPositionBottom <= 0){
            this.calculateNewAngle()
        }
    }

    nextEdgeHit = () => {
        let { pixelsPerSecond, ballDirectionY, ballDirectionX, ballPositionLeft, ballPositionBottom, gameHeight } = this.state;

        let nextEdgeHits = {}

        if(ballDirectionY > 0){
            nextEdgeHits.ceiling = parseInt((gameHeight - ballPositionBottom) * 1000 / (ballDirectionY * pixelsPerSecond));
        }else if(ballDirectionY < 0){
            nextEdgeHits.floor = parseInt((ballPositionBottom) * 1000 / (Math.abs(ballDirectionY) * pixelsPerSecond));
        }

        if(ballDirectionX > 0){
            nextEdgeHits.right = parseInt((screenWidth - 30 - ballPositionLeft) * 1000 / (ballDirectionX * pixelsPerSecond));
        }else if(ballDirectionX < 0){
            nextEdgeHits.left = parseInt(ballPositionLeft * 1000 / (Math.abs(ballDirectionX) * pixelsPerSecond));
        }
        
        let whichEdgeFirst = Object.keys(nextEdgeHits).reduce((a, b) => nextEdgeHits[a] < nextEdgeHits[b] ? a : b);
        let timeToHit = nextEdgeHits[whichEdgeFirst];

        let returnObject = {
            time: timeToHit,
            newBottomPosition: null,
            newLeftPosition: null,
            flipPolarity: null
        }

        let getNewBottom = parseInt(ballPositionBottom + (ballDirectionY * pixelsPerSecond * timeToHit/1000));
        let getNewLeft = parseInt(ballPositionLeft + (ballDirectionX * pixelsPerSecond * timeToHit/1000));

        switch(whichEdgeFirst) {
            case "ceiling":
                returnObject.newBottomPosition = getNewBottom;
                returnObject.newLeftPosition = getNewLeft;
                returnObject.flipPolarity = "Y";
                break;
            case "floor":
                returnObject.newBottomPosition = 0;
                returnObject.newLeftPosition = getNewLeft;
                returnObject.flipPolarity = "Y";
                break;
            case "right":
                returnObject.newLeftPosition = getNewLeft;
                returnObject.newBottomPosition = getNewBottom;
                returnObject.flipPolarity = "X";
                break;
            case "left":
                returnObject.newLeftPosition = 0;
                returnObject.newBottomPosition = getNewBottom;
                returnObject.flipPolarity = "X";
                break;
            default:
          }

        return returnObject;
    }

    animate = (x, y, duration) => {
        Animated.timing(
            this.state.offsetX,
            { 
                toValue: x,
                useNativeDriver: true,
                easing: Easing.linear,  
                duration: duration,
            }
          ).start();
        Animated.timing(
            this.state.offsetY,
            { 
                toValue: -y,
                useNativeDriver: true,
                easing: Easing.linear,
                duration: duration,
            }
        ).start();

        this.setState({
            ballPositionBottom: y,
            ballPositionLeft: x
        })
    }


    fireWeapon = () => {
        if(this.state.gameHeight != null){
            if(this.state.ballStuck){
                this.setState({
                    ballStuck: false
                }, this.animateBall)
            }else{
                //FIRE WEAPON IF ONE IS AVAILABLE
            }
        }
    }



    render() { 
        return (  
            <Animated.View style={[styles.ball, {
                bottom: 40, 
    
                transform: [{ translateX: this.state.offsetX }, { translateY: this.state.offsetY}]
            }]}>
                <RadialGradient 
                style={{
                        height: 32,
                        width: 32,
                    }}
                colors={['black','#8f8f8f','#bfbfbf','#e6e6e6']}
                center={[15,40]}
                radius={30}> 
                </RadialGradient>
                
            </Animated.View> 
        );
    }
}

const styles = StyleSheet.create({
    ball: {
        height: 30,
        width: 30,
        borderRadius: 15,
        position: "absolute",
        overflow: "hidden",
        zIndex: 1,
    }
})
 
export default Ball;