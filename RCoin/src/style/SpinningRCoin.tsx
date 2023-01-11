import React, {Component} from 'react';
import {View, Animated, Easing} from 'react-native';
import {Image} from 'react-native-ui-lib';
import styles from './style';

export default class SpinningRCoin extends Component {
  state = {
    rotateY: new Animated.Value(0),
  };

  animate() {
    const y = Animated.timing(this.state.rotateY, {
      toValue: 360,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.linear,
    });
    Animated.parallel([y]).start(() => {
      this.state.rotateY.setValue(0), this.animate();
    });
  }

  componentDidMount() {
    this.animate();
  }

  rotate1 = {
    transform: [
      {
        rotateY: this.state.rotateY.interpolate({
          inputRange: [0, 90],
          outputRange: ['270deg', '360deg'],
        }),
      },
    ],
  };

  render() {
    return (
      <View style={styles.containerCoin}>
        <Animated.View style={[styles.rotateCoin, this.rotate1]}>
          <Image
            style={{width: 100, height: 100}}
            source={require('./GoldCoin.png')}></Image>
        </Animated.View>
      </View>
    );
  }
}
