import { View, Button, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, useAnimatedProps, withTiming } from 'react-native-reanimated';
import "../../global.css";
import { Circle, Svg } from 'react-native-svg';
import { use } from 'react';

export default function Second() {
  const translateX = useSharedValue(0);

  const handlePress = () => {
    translateX.value += 50
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value * 2) }],
  }));

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const radius = useSharedValue(50);

  const animatedRadius = useAnimatedProps(() => ({
    r: withTiming(radius.value)
  }))

  const handleRadiusPress = () => {
    radius.value += 10;
  }

  return (
    <View>
        <View style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle]} />
        <Button className='mt-4' onPress={handlePress} title="Click me" />
        </View>
    
        <View style={styles.container}>
            <Svg className='flex items-center justify-center'>
                <AnimatedCircle 
                    cx="50" 
                    cy="50" 
                    animatedProps={animatedRadius}
                    fill="blue" 
                />
            </Svg>
            <Button className='mt-4' title="Click me" onPress={handleRadiusPress} />
        </View>
    </View>
  );

}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
  container: {
    padding: 20 
  }
})

