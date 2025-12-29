import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TealPineColors } from '../../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search games...',
}) => {
  const isSearchActive = value.length > 0;

  return (
    <View style={[styles.container, isSearchActive && styles.containerActive]}>
      <Icon
        name="magnify"
        size={20}
        color={isSearchActive ? TealPineColors.primary : "#94A3B8"}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isSearchActive && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color={TealPineColors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TealPineColors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerActive: {
    borderColor: TealPineColors.primary,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: TealPineColors.textPrimary,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
});
