import { CheckmarkComponent } from '@/components/CheckmarkComponent';
import { CircleWithTextComponent } from '@/components/CircleWithTextComponent';
import { ContainerComponent } from '@/components/ContainerComponent';
import { STATUS_NO, STATUS_NONE, STATUS_YES } from '@/constants/Status';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { calendarAtom } from '@/store/atoms';
import { getAllData, getStatusByDate, setStatusForDate } from '@/store/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Text } from 'react-native-paper';

const bannerAdUnitId = process.env.EXPO_PUBLIC_BANNER_AD_UNIT1_ID ?? '';

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const yyyymmdd = `${year}${month}${day}`;

export default function CheckScreen() {
  const theme = useThemeStyles()

  const [status, setStatus] = useState<string>('0');

  const { useSetAtom } = require("jotai");
  const setClendarValues = useSetAtom(calendarAtom);

  const loadData = async () => {
    try {
      const fetchedData = await getAllData();
      setClendarValues(fetchedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetStatus = async (value: string) => {
    await setStatusForDate({
      date: yyyymmdd,
      status: value,
      weight: "",
      memo: ''
    });
    await loadData()
  };

  const handleClickYes = () => {
    if (status === STATUS_YES) {
      setStatus(STATUS_NONE)
      handleSetStatus(STATUS_NONE)
      return
    }

    setStatus(STATUS_YES)
    handleSetStatus(STATUS_YES)
  }

  const handleClickNo = () => {
    if (status === STATUS_NO) {
      setStatus(STATUS_NONE)
      handleSetStatus(STATUS_NONE)
      return
    }

    setStatus(STATUS_NO)
    handleSetStatus(STATUS_NO)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await getStatusByDate(yyyymmdd);
        setStatus(String(fetchedData));
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [])

  return (
    <ContainerComponent>
      <View style={styles.checkContainer}>
        <Text variant="bodyLarge" style={[styles.titleContainer, { color: theme.color1 }]}>Did you snack today?</Text>

        <View style={styles.bodyContainer}>
          {status !== STATUS_YES
            ? <CircleWithTextComponent text1='Yes,' text2='I snacked' isGreen={false} handleClick={handleClickYes} />
            : <CheckmarkComponent isGreen={false} onPress={handleClickYes} />
          }
          {status !== STATUS_NO
            ? <CircleWithTextComponent text1='No,' text2="I didn't" isGreen={true} handleClick={handleClickNo} />
            : <CheckmarkComponent isGreen={true} onPress={handleClickNo} />
          }
        </View>

        <Text variant="bodyLarge" style={[styles.dateText, { color: theme.color1 }]}>{formattedDate}</Text>
      </View>

      <View style={styles.bannerAdContainer}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  checkContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  titleContainer: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 10
  },
  bodyContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 14,
  },
  bannerAdContainer: {
    alignItems: 'center',
    marginBottom: 70
  },
});
