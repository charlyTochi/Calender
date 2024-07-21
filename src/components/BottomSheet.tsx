import React, {ReactNode} from 'react';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {Portal} from 'react-native-portalize';
import {SizeUtils} from '../Utils/SizeUtils';

export interface IBottomSheet extends ModalizeProps {
  bottomSheetRef: React.RefObject<Modalize>;
  scrollEnabled?: boolean;
  horizontal?: boolean;
  handleClose?: () => void;
  withCloseIcon?: boolean;
  title?: string;
  SubTitleComponent?: ReactNode | string;
}

const BottomSheet = ({
  bottomSheetRef,
  scrollEnabled,
  horizontal,
  modalHeight,
  modalStyle,
  onClose,
  children,
  handleClose,
  withCloseIcon = false,
  title,
  SubTitleComponent,
  ...rest
}: IBottomSheet) => {
  const onPressClose = () => {
    if (handleClose) {
      handleClose();
    } else {
      bottomSheetRef.current?.close();
    }
  };

  return (
    <Portal>
      <Modalize
        ref={bottomSheetRef}
        useNativeDriver={true}
        adjustToContentHeight={modalHeight ? false : true}
        disableScrollIfPossible={false}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          nestedScrollEnabled: true,
          scrollEnabled: scrollEnabled,
          horizontal: horizontal,
          keyboardShouldPersistTaps: 'always',
        }}
        modalHeight={modalHeight}
        handleStyle={{display: 'none'}}
        handlePosition="inside"
        modalStyle={[styles.modalStyle, modalStyle]}
        keyboardAvoidingBehavior="padding"
        onClose={onClose}
        {...rest}>
        <View style={styles.children}>
          {withCloseIcon && (
            <Pressable style={styles.closeIcon} onPress={onPressClose}>
              {/* {ICONS.circularCloseIcon} */}
              <Text>sdfsd</Text>
            </Pressable>
          )}
          <View
            style={[
              styles.titleContainer,
              {marginBottom: title || SubTitleComponent ? 30 : 0},
            ]}>
            <Text style={styles.title}>{title}</Text>
            {typeof SubTitleComponent === 'string' ? (
              <Text style={styles.subTitle}>{SubTitleComponent}</Text>
            ) : (
              SubTitleComponent
            )}
          </View>
          {children}
        </View>
      </Modalize>
    </Portal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  modalStyle: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  children: {
    paddingTop: 20,
    paddingBottom: Platform.select({ios: 20, android: 30}),
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  titleContainer: {
    gap: 10,
    alignItems: 'center',
    maxWidth: SizeUtils.responsiveWidth(85),
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
