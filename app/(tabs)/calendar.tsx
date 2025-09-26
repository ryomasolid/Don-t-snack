import { CheckmarkComponent } from '@/components/CheckmarkComponent';
import { CircleWithTextComponent } from '@/components/CircleWithTextComponent';
import { ContainerComponent } from '@/components/ContainerComponent';
import { STATUS_NO, STATUS_NONE, STATUS_YES } from '@/constants/Status';
import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ActionSheetRef } from 'react-native-actions-sheet';
import ActionSheet from 'react-native-actions-sheet';
import { Calendar, DateData } from 'react-native-calendars';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const bannerAdUnitId = '';

export default function CalendarScreen() {
  const theme = useThemeStyles();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const {
    today,
    selectedDate,
    status,
    weight,
    memo,
    maxNoStreak,
    currentNoStreak,
    markedDates,
    handleDayPress,
    handleSetStatus,
    setStatus,
    setWeight,
    setMemo,
  } = useCalendarLogic();

  // 日付押下処理
  const handleDayPressWithSheet = (date: DateData) => {
    handleDayPress(date);

    if (actionSheetRef.current) {
      actionSheetRef.current.show();
    }
  };

  // Yes押下処理
  const handleClickYes = () => {
    const value = status === STATUS_YES ? STATUS_NONE : STATUS_YES;
    setStatus(value)
  };

  // No押下処理
  const handleClickNo = () => {
    const value = status === STATUS_NO ? STATUS_NONE : STATUS_NO;
    setStatus(value)
  };

  // 体重入力処理
  const handleChangeWeight = (value: string) => {
    if (value.length > 3) {
      return
    }

    setWeight(value)
  }

  // メモ入力処理
  const handleChangeMemo = (value: string) => {
    const byteLength = new TextEncoder().encode(value).length
    if (byteLength > 255) {
      return
    }

    setMemo(value)
  }

  const handleClose = () => {
    setWeight('')
    setMemo('')
    Keyboard.dismiss();

    if (status === '0' && !weight && !memo) {
      return
    }

    handleSetStatus(status, weight ?? '', memo ?? '')
  };

  return (
    <ContainerComponent>
      <Calendar
        key={theme.color2}
        current={today}
        markedDates={markedDates}
        onDayPress={handleDayPressWithSheet}
        firstDay={1}
        hideExtraDays={true}
        enableSwipeMonths={true}
        theme={{
          calendarBackground: theme.color2,
          arrowColor: '#2D4150',
        }}
        style={{
          backgroundColor: theme.color2,
        }}
      />

      <View style={styles.streakContainer}>
        <View style={styles.streakItem}>
          <Ionicons name="trophy-outline" size={32} color="#FFD700" />
          <Text style={styles.streakLabel}>最大連続日数</Text>
          <Text style={styles.streakValue}>{maxNoStreak}日</Text>
        </View>

        <View style={styles.streakItem}>
          <Ionicons name="flame" size={32} color="#FF4500" />
          <Text style={styles.streakLabel}>継続日数</Text>
          <Text style={styles.streakValue}>{currentNoStreak}日</Text>
        </View>
      </View>

      <View style={styles.bannerAdContainer}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.FULL_BANNER}
        />
      </View>

      <ActionSheet ref={actionSheetRef} headerAlwaysVisible={true} gestureEnabled={true} onClose={handleClose}>
        <View style={styles.bottomSheetContainer}>
          <View style={styles.checkContainer}>
            {selectedDate && (
              <>
                {status !== STATUS_YES ? (
                  <CircleWithTextComponent text1='Yes,' text2='I snacked' isGreen={false} handleClick={handleClickYes} />
                ) : (
                  <CheckmarkComponent isGreen={false} onPress={handleClickYes} />
                )}
                {status !== STATUS_NO ? (
                  <CircleWithTextComponent text1='No,' text2="I didn't" isGreen={true} handleClick={handleClickNo} />
                ) : (
                  <CheckmarkComponent isGreen={true} onPress={handleClickNo} />
                )}
              </>
            )}
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>体重</Text>
              <TextInput
                style={styles.textInputWeight}
                keyboardType="numeric"
                onChangeText={handleChangeWeight}
                value={weight}
                placeholder="体重を入力..."
                placeholderTextColor="#888"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>メモ</Text>
              <TextInput
                style={styles.textInputMemo}
                multiline={true}
                onChangeText={handleChangeMemo}
                value={memo}
                placeholder="メモを入力してください..."
                placeholderTextColor="#888"
              />
            </View>
          </View>
        </View>
      </ActionSheet>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    padding: 20,
    gap: 20,
  },
  checkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  inputSection: {
    gap: 20,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#383838',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  textInputWeight: {
    height: 40,
    color: '#fff',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  textInputMemo: {
    height: 100,
    color: '#fff',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginVertical: 20,
  },
  streakItem: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#383838',
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  streakLabel: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center',
  },
  streakValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  bannerAdContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80
  },
});