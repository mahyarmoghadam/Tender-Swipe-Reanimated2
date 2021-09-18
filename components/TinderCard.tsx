import { Block } from "expo-ui-kit";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { mix, snapPoint } from "react-native-redash";
import { AntDesign } from "@expo/vector-icons";
import { MarsModel } from "../redux/MarsModel";

export interface CardProps {
  onLike: (index: number) => void;
  onDLike: (index: number) => void;
  item: MarsModel;
  step: number;
  index: number;
  aIndex: Animated.SharedValue<number>;
}

const TinderCard = ({
  index,
  aIndex,
  step,
  item,
  onLike,
  onDLike,
}: CardProps) => {
  const { width: wWidth } = useWindowDimensions();
  const width = wWidth * 0.75;
  const height = width * (425 / 275);
  const snapPoints = [-wWidth, 0, wWidth];

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const position = useDerivedValue(() => index * step - aIndex.value);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = event.translationX + ctx.x;
      translateY.value = event.translationY + ctx.y;
    },
    onEnd: ({ velocityX, velocityY }) => {
      translateY.value = withSpring(0, { velocity: velocityY });
      const dest = snapPoint(translateX.value, velocityX, snapPoints);
      translateX.value = withSpring(
        dest,
        {
          overshootClamping: dest === 0 ? false : true,
          restSpeedThreshold: dest === 0 ? 0.01 : 100,
          restDisplacementThreshold: dest === 0 ? 0.01 : 100,
        },
        () => {
          // dest !== 0 && runOnJS(onSwipe)();
          dest > 0 && runOnJS(onLike)(index);
          dest < 0 && runOnJS(onDLike)(index);
        }
      );
    },
  });

  const rotate = useDerivedValue(
    () => interpolate(translateX.value, [0, wWidth * 5], [0, 60]) + "deg"
  );

  const cardStyle = useAnimatedStyle(() => {
    const scale = mix(position.value, 1, 0.6);
    const ty = mix(position.value, 0, -140);
    const opacity = mix(position.value, 1, -2);
    return {
      transform: [
        { translateY: ty },
        { rotateZ: rotate.value },
        { translateX: translateX.value },
        { scale },
      ],
      opacity,
    };
  });

  const dlikeStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-wWidth, 0, wWidth],
      [1.5, 1, 1]
    );
    return {
      transform: [{ scale }],
    };
  });

  const likeStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-wWidth, 0, wWidth],
      [1, 1, 1.5]
    );
    return {
      transform: [{ scale }],
    };
  });
  return (
    <Block
      style={[StyleSheet.absoluteFill, { zIndex: 100 - index }]}
      paddingVertical={50}
      
    >
      <Block center>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                width,
                height,
                overflow: "hidden",
                backgroundColor:'#ccc',
                borderRadius: 8,
              },
              cardStyle,
            ]}
          >
            <Image style={styles.image} source={{ uri: item.url }} />
            <View style={styles.overlay}>
              <View style={styles.footer}>
                <Text style={styles.name}>{item.title}</Text>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
        <Block
          noflex
          width="100%"
          height={80}
          style={{
            position: "absolute",
            bottom: -10,
            zIndex: 901,
          }}
        >
          <Block row space="around">
            <TouchableOpacity onPress={() => onLike(index)}>
              <Animated.View
                style={[styles.like, { backgroundColor: "black" }, dlikeStyle]}
              >
                <AntDesign name="dislike1" size={25} color="white" />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDLike(index)}>
              <Animated.View
                style={[styles.like, { backgroundColor: "red" }, likeStyle]}
              >
                <AntDesign name="like1" size={25} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default TinderCard;

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
  },
  name: {
    color: "white",
    fontSize: 32,
  },
  like: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
