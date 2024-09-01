import React, { useMemo } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const IMAGE_HEIGHT_BIG = Math.min(height * 0.3, width * 0.9);
const IMAGE_HEIGHT_SMALL = height * 0.13;

export enum ImageSize {
  BIG,
  SMALL,
}

interface GrowingImageContainerProps {
  scaleTo: ImageSize;
  children?: React.ReactNode;
}

export default function GrowingImageContainer({
  scaleTo,
  children,
}: GrowingImageContainerProps) {
  const image = require("../assets/images/rank.png");

  const { imageHeight, dynamicMargin } = useMemo(
    () => ({
      imageHeight: new Animated.Value(IMAGE_HEIGHT_BIG),
      dynamicMargin: new Animated.Value((height / 2 - IMAGE_HEIGHT_BIG) / 2),
    }),
    [],
  );

  if (scaleTo === ImageSize.SMALL) {
    Animated.parallel([
      Animated.timing(imageHeight, {
        // @ts-ignore
        duration: 300,
        // @ts-ignore
        toValue: IMAGE_HEIGHT_SMALL,
        useNativeDriver: false,
      }),
      Animated.timing(dynamicMargin, {
        // @ts-ignore
        duration: 300,
        // @ts-ignore
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
  } else {
    Animated.parallel([
      Animated.timing(imageHeight, {
        // @ts-ignore
        duration: 300,
        toValue: IMAGE_HEIGHT_BIG,
        useNativeDriver: false,
      }),
      Animated.timing(dynamicMargin, {
        // @ts-ignore
        duration: 300,
        // @ts-ignorer
        toValue: (height / 2 - IMAGE_HEIGHT_BIG) / 2,
        useNativeDriver: false,
      }),
    ]).start();
  }

  return (
    <Animated.View style={styles.container}>
      <Animated.Image
        source={image}
        style={{
          ...styles.image,
          height: imageHeight,
          marginBottom: dynamicMargin,
          marginTop: dynamicMargin,
        }}
      />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    alignSelf: "center",
    aspectRatio: "1/1",
  },
});
