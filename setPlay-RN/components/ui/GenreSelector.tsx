import { modalStyles } from "@/components/ui/ModalStyles";
import { Text } from "@/components/ui/Text";
import { GENRES } from "@/constants/constants";
import { COLORS } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type GenreSelectorProps = {
  selectedGenre: string | null;
  onGenreSelect: (genre: string) => void;
};

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenre,
  onGenreSelect,
}) => {
  const [showGenreList, setShowGenreList] = useState(false);

  const selectGenre = (genre: string) => {
    onGenreSelect(genre);
    setShowGenreList(false);
  };

  return (
    <View style={modalStyles.column}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={modalStyles.input}
        onPress={() => setShowGenreList(!showGenreList)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="library-music"
            size={20}
            color={COLORS.secondary}
            style={modalStyles.icon}
          />
          <View style={modalStyles.inputContent}>
            <Text
              style={[
                modalStyles.placeholder,
                selectedGenre ? { color: COLORS.text } : {},
              ]}
            >
              {selectedGenre || "Genre"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {showGenreList && (
        <View
          style={{
            backgroundColor: COLORS.background,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.primary,
            marginHorizontal: 12,
            position: "absolute",
            maxHeight: 215,
            top: 60,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <ScrollView
            bounces={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          >
            {GENRES.map((item) => {
              const isSelected = item === selectedGenre;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    modalStyles.listItem,
                    isSelected && modalStyles.listItemSelected,
                  ]}
                  onPress={() => selectGenre(item)}
                >
                  <Text
                    style={[
                      modalStyles.listItemText,
                      isSelected && { color: COLORS.secondary },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default GenreSelector;
