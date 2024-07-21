import {useCallback, useRef} from 'react';
import {Keyboard} from 'react-native';
import {Modalize} from 'react-native-modalize';

const useBottomSheet = () => {
  const bottomSheetRef = useRef<Modalize>(null);

  const open = () => {
    if (bottomSheetRef.current) {
      setTimeout(() => {
        bottomSheetRef.current?.open();
      }, 200);
    }
  };
  const close = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current?.close();
    }
    Keyboard.dismiss();
  };

  const closePrevAndOpen = useCallback(
    (prevBottomSheetRef: React.RefObject<Modalize>) => {
      setTimeout(() => {
        prevBottomSheetRef.current?.close(); // close prev
      }, 200);
      open(); // open current
    },
    [],
  );

  const closeAndOpenPrev = useCallback(
    (prevBottomSheetRef: React.RefObject<Modalize>) => {
      close(); //close current
      Keyboard.dismiss();
      setTimeout(() => {
        prevBottomSheetRef.current?.open(); //open prev
      }, 200);
    },
    [],
  );

  return {
    bottomSheetRef,
    open,
    close,
    closePrevAndOpen,
    closeAndOpenPrev,
  };
};

export default useBottomSheet;
