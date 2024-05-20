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
  return <View style={styles.optionContainer}>{children}</View>;
}

interface ButtonProps extends PressableProps {
  children: ReactNode;
  isDanger?: boolean;
}

function Button({children, isDanger = false, ...props}: ButtonProps) {
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
    </Pressable>
  );
}

function Title({children}: PropsWithChildren) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleText}>{children}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.border}></View>;
}

export const CompoundOption = Object.assign(OptionModal, {
  Container,
  Background,
  Button,
  Title,
  Divider,
});

const styles = StyleSheet.create({
  optionBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0 0 0 / 0.5)',
  },
  optionContainer: {
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: colors.GRAY_100,
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
    backgroundColor: colors.GRAY_200,
  },
  optionText: {
    fontSize: 17,
    color: colors.BLUE_500,
    fontWeight: '500',
  },
  dangerText: {
    color: colors.RED_500,
  },
  titleContainer: {
    alignItems: 'center',
    padding: 15,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.BLACK,
  },
  border: {
    borderBottomColor: colors.GRAY_200,
    borderBottomWidth: 1,
  },
});
