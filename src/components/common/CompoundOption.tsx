import {PropsWithChildren, ReactNode, createContext, useContext} from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  PressableProps,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
} from 'react-native';

import {colors} from '@/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useThemeStore from '@/store/useThemeStore';
import {ThemeMode} from '@/types';

interface OptionModalProps extends ModalProps {
  children: ReactNode;
  isVisible: boolean;
  hideOption: () => void;
  animateType?: ModalProps['animationType'];
}

interface OptionContextValue {
  onClickOutSide?: (event: GestureResponderEvent) => void;
}

const OptionContext = createContext<OptionContextValue | undefined>(undefined);

function OptionModal({
  children,
  isVisible,
  hideOption,
  animateType = 'slide',
  ...props
}: OptionModalProps) {
  const onClickOutSide = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      hideOption();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType={animateType}
      onRequestClose={hideOption}
      {...props}>
      <OptionContext.Provider value={{onClickOutSide}}>
        {children}
      </OptionContext.Provider>
    </Modal>
  );
}

function Background({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const optionContext = useContext(OptionContext);

  return (
    <SafeAreaView
      style={styles.optionBackground}
      onTouchEnd={optionContext?.onClickOutSide}>
      {children}
    </SafeAreaView>
  );
}

function Container({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return <View style={styles.optionContainer}>{children}</View>;
}

interface ButtonProps extends PressableProps {
  children: ReactNode;
  isDanger?: boolean;
  isChecked?: boolean;
}

function Button({
  children,
  isDanger = false,
  isChecked = false,
  ...props
}: ButtonProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <Pressable
      style={({pressed}) => [
        pressed && styles.optionButtonPressed,
        styles.optionButton,
      ]}
      {...props}>
      <Text style={[styles.optionText, isDanger && styles.dangerText]}>
        {children}
      </Text>

      {isChecked && (
        <Ionicons name="checkmark" size={20} color={colors[theme].BLUE_500} />
      )}
    </Pressable>
  );
}

function Title({children}: PropsWithChildren) {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{children}</Text>
    </View>
  );
}

function Divider() {
  const {theme} = useThemeStore();
  const styles = styling(theme);

  return <View style={styles.border}></View>;
}

export const CompoundOption = Object.assign(OptionModal, {
  Container,
  Background,
  Button,
  Title,
  Divider,
});

const styling = (theme: ThemeMode) =>
  StyleSheet.create({
    optionBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0 0 0 / 0.5)',
    },
    optionContainer: {
      borderRadius: 15,
      marginHorizontal: 10,
      marginBottom: 10,
      backgroundColor: colors[theme].GRAY_100,
      overflow: 'hidden',
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      gap: 5,
    },
    optionButtonPressed: {
      backgroundColor: colors[theme].GRAY_200,
    },
    optionText: {
      fontSize: 17,
      color: colors[theme].BLUE_500,
      fontWeight: '500',
    },
    dangerText: {
      color: colors[theme].RED_500,
    },
    titleContainer: {
      alignItems: 'center',
      padding: 15,
    },
    titleText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors[theme].BLACK,
    },
    border: {
      borderBottomColor: colors[theme].GRAY_200,
      borderBottomWidth: 1,
    },
  });
