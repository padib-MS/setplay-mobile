import type { SearchGigsParams } from "@/api/gig/gig.types";
import type { SearchProducerParams } from "@/api/producer/producer.types";
import { Text } from "@/components/ui/Text";
import { GENRES, VENUES } from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type Props =
  | {
      tab: "gigs";
      filters: SearchGigsParams;
      onChange: <K extends keyof SearchGigsParams>(
        key: K,
        value: SearchGigsParams[K],
      ) => void;
    }
  | {
      tab: "users";
      filters: SearchProducerParams;
      onChange: <K extends keyof SearchProducerParams>(
        key: K,
        value: SearchProducerParams[K],
      ) => void;
    };

export function SearchFilters({ tab, filters, onChange }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {GENRES.map((genre) => {
              const isActive = filters.genres?.includes(genre) ?? false;

              return (
                <TouchableOpacity
                  key={genre}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => {
                    const currentGenres = filters.genres ?? [];
                    const chosen = isActive
                      ? currentGenres.filter((g) => g !== genre)
                      : [...currentGenres, genre];
                    (onChange as any)(
                      "genres",
                      chosen.length > 0 ? chosen : undefined,
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BPM</Text>
          <View style={styles.rangeRow}>
            {[
              { label: "Slow (60–90)", min: 60, max: 90 },
              { label: "Medium (90–120)", min: 90, max: 120 },
              { label: "Fast (120–150)", min: 120, max: 150 },
              { label: "Very Fast (150+)", min: 150, max: 300 },
            ].map((bpm) => {
              const isActive = filters.bpmRangeMin === bpm.min;
              return (
                <TouchableOpacity
                  key={bpm.label}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => {
                    if (isActive) {
                      (onChange as any)("bpmRangeMin", undefined);
                      (onChange as any)("bpmRangeMax", undefined);
                    } else {
                      (onChange as any)("bpmRangeMin", bpm.min);
                      (onChange as any)("bpmRangeMax", bpm.max);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {bpm.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {tab === "gigs" && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bid Range</Text>
              <View style={styles.rangeRow}>
                {[
                  { label: "$0–50", min: 0, max: 50 },
                  { label: "$50–200", min: 50, max: 200 },
                  { label: "$200–500", min: 200, max: 500 },
                  { label: "$500+", min: 500, max: undefined },
                ].map((range) => {
                  const gigFilters = filters as SearchGigsParams;
                  const isActive =
                    gigFilters.minBid === range.min &&
                    gigFilters.maxBid === range.max;
                  return (
                    <TouchableOpacity
                      key={range.label}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => {
                        const fn = onChange as <
                          K extends keyof SearchGigsParams,
                        >(
                          key: K,
                          value: SearchGigsParams[K],
                        ) => void;
                        if (isActive) {
                          fn("minBid", undefined);
                          fn("maxBid", undefined);
                        } else {
                          fn("minBid", range.min);
                          fn("maxBid", range.max);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Venue</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {VENUES.map((venue) => {
                  const gigFilters = filters as SearchGigsParams;
                  return (
                    <TouchableOpacity
                      key={venue}
                      style={[
                        styles.chip,
                        gigFilters.venue === venue && styles.chipActive,
                      ]}
                      onPress={() => {
                        const fn = onChange as <
                          K extends keyof SearchGigsParams,
                        >(
                          key: K,
                          value: SearchGigsParams[K],
                        ) => void;
                        fn(
                          "venue",
                          gigFilters.venue === venue ? undefined : venue,
                        );
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          gigFilters.venue === venue && styles.chipTextActive,
                        ]}
                      >
                        {venue}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                <TouchableOpacity
                  style={[styles.chip, { backgroundColor: COLORS.primary }]}
                  activeOpacity={1}
                >
                  <Text style={[styles.chipTextActive]}>Montreal</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        )}

        {tab === "users" && (
          <>
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>Min Rating</Text>
              <View style={styles.rangeRow}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const userFilters = filters as SearchProducerParams;
                  const isActive = userFilters.minRating === star;
                  return (
                    <TouchableOpacity
                      key={star}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => {
                        const fn = onChange as <
                          K extends keyof SearchProducerParams,
                        >(
                          key: K,
                          value: SearchProducerParams[K],
                        ) => void;
                        fn("minRating", isActive ? undefined : star);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.starRow}>
                        {Array.from({ length: star }).map((_, i) => (
                          <Ionicons
                            key={i}
                            name="star"
                            size={12}
                            color={isActive ? COLORS.background : "#FFD700"}
                          />
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View> */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completed Gigs</Text>
              <View style={styles.rangeRow}>
                {[
                  { label: "1–5", min: 1, max: 5 },
                  { label: "5–20", min: 5, max: 20 },
                  { label: "20–50", min: 20, max: 50 },
                  { label: "50+", min: 50, max: undefined },
                ].map((range) => {
                  const userFilters = filters as SearchProducerParams;
                  const isActive =
                    userFilters.completedGigsMin === range.min &&
                    userFilters.completedGigsMax === range.max;
                  return (
                    <TouchableOpacity
                      key={range.label}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => {
                        const fn = onChange as <
                          K extends keyof SearchProducerParams,
                        >(
                          key: K,
                          value: SearchProducerParams[K],
                        ) => void;
                        if (isActive) {
                          fn("completedGigsMin", undefined);
                          fn("completedGigsMax", undefined);
                        } else {
                          fn("completedGigsMin", range.min);
                          fn("completedGigsMax", range.max);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: "70%",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    marginBottom: SPACING.small,
  },
  scrollContent: {
    padding: SPACING.medium,
    gap: SPACING.medium,
  },
  section: {
    gap: SPACING.xSmall,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    fontWeight: "600",
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    gap: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.small,
  },
  chipTextActive: {
    color: COLORS.background,
  },
  rangeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
  },
});
