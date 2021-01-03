import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

const gradient = ['rgba(255,255,255,0.3)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'];
const screenWidth = Dimensions.get("screen").width;

class Slider extends Component {
    state = { 
        currentWidth: 100,
        sliderActive: false,
        leftPosition: screenWidth/2 - 50,
        oldFingerPostion: null,
    }

    sliderMove = (position) => {
        let leftEdge = this.state.leftPosition;
        let rightEdge = this.state.leftPosition + this.state.currentWidth;
        if(position < leftEdge){
            this.setState({
                leftPosition: position
            })
        }else if(position > rightEdge){
            this.setState({
                leftPosition: position - this.state.currentWidth,
            })
        }else{
            let difference = position - this.state.oldFingerPostion;
            let newLeftPosition = this.state.leftPosition + difference;
            if(newLeftPosition < 0){
                newLeftPosition = 0;
            }else if(newLeftPosition > (screenWidth - this.state.currentWidth)){
                newLeftPosition = screenWidth - this.state.currentWidth
            }
            this.setState({
                leftPosition: newLeftPosition
            })
        }
        this.setState({
            oldFingerPostion: position
        })
    }

    slider = () => {
        return (
            <View style={styles.sliderContainer}
                onStartShouldSetResponder={(event) => {
                    const pageX = Math.round(event.nativeEvent.pageX, 0);
                    this.setState({
                        oldFingerPostion: pageX
                    })
                    let leftEdge = this.state.leftPosition;
                    let rightEdge = this.state.leftPosition + this.state.currentWidth;
                    
                    if((pageX > leftEdge) && (pageX < rightEdge)){
                        this.setState({
                            sliderActive: true,
                        })

                    };

                }}
                onMoveShouldSetResponder={(event) => {
                    const pageX = Math.round(event.nativeEvent.pageX, 0);
                    let difference = pageX - this.state.oldFingerPostion;
                    if(difference >= 1 || difference <= -1){
                        if(this.state.sliderActive){
                            this.sliderMove(pageX)
                        };
                    }
                }}
                onResponderRelease={() => {
                    this.setState({
                        sliderActive: false
                    });
                }}
            >
                <View 
                    style={[styles.slider, 
                        {
                            left: this.state.leftPosition
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
                </View>
            </View>
        )
    }
    render = () => { 
        return ( 
            <View style={styles.container}>
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
        height: "100%"
    }
})
 
export default Slider;


