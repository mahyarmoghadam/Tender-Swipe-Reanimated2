import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { Block, Button, Text } from "expo-ui-kit";
import { useTiming } from "react-native-redash";
import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import {
  addToFavorite,
  fetchMarsData,
  removeFromFavorite,
} from "../redux/marsSlice";
import TinderCard from "./TinderCard";
import { useAppDispatch } from "./../redux/hooks";
import { ActivityIndicator, Image } from "react-native";

interface TinderProps {
  back: number;
  onChangeIndex: (index: number) => void;
}

const Tinder = ({ back, onChangeIndex }: TinderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { items, pending } = useAppSelector((state) => state.mars);
  const appDispatch = useAppDispatch();
  const dispatch = useDispatch();

  const aIndex = useTiming(currentIndex);
  const step = 1 / (items.length - 1);

  useEffect(() => {
    dispatch(fetchMarsData());
  }, []);

  useEffect(() => {
    if (back) {
      if (currentIndex - step >= 0) {
        Undo();
      }
    }
  }, [back]);

  const Undo = () => {
    setCurrentIndex((prev) => currentIndex - step);
    onChangeIndex(currentIndex - step);
  };

  if (pending) {
    return (
      <Block center middle>
        <ActivityIndicator color="red" />
      </Block>
    );
  }

  if (currentIndex > items.length * step) {
    return (
      <Block center middle>
        <Image
          source={require("../assets/images/empty.png")}
          resizeMode="contain"
          style={{
            width: 330,
            height: 250,
          }}
        />
      </Block>
    );
  }

  return (
    <Block>
      <Block
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        {items.map(
          (item, index) =>
            currentIndex < index * step + step && (
              <TinderCard
                key={index}
                item={item}
                index={index}
                aIndex={aIndex}
                step={step}
                onLike={(index) => {
                  onChangeIndex(currentIndex + step);
                  setCurrentIndex((prev) => prev + step);
                  appDispatch(addToFavorite(items[index]));
                }}
                onDLike={(index) => {
                  onChangeIndex(currentIndex + step);
                  setCurrentIndex((prev) => prev + step);
                  appDispatch(removeFromFavorite(items[index]));
                }}
              />
            )
        )}
      </Block>
    </Block>
  );
};

export default Tinder;
