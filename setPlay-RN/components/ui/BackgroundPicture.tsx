import { modalStyles } from "@/components/ui/ModalStyles";
import React from "react";
import { ImageBackground, ImageSourcePropType } from "react-native";

interface BackgroundPictureProps {
  children: React.ReactNode;
  bgImage: ImageSourcePropType;
  styles?: any;
}

const BackgroundPicture = ({
  children,
  bgImage,
  styles,
}: BackgroundPictureProps) => {
  return (
    <ImageBackground
      source={bgImage || require("@/assets/images/offers-bg.webp")}
      style={{ ...modalStyles.background, ...styles }}
      resizeMode="cover"
    >
      <ImageBackground
        source={require("@/assets/images/dots-bg.webp")}
        style={modalStyles.dotsbackground}
        resizeMode="cover"
      />
      {children}
    </ImageBackground>
  );
};

export default BackgroundPicture;
