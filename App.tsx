import React, {useState, useEffect, FC} from 'react';
import {View, Text, TextInput, Alert, ScrollView} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import SwapFrom from './images/SwapFrom.svg';
import IconComponent from "./src/IconComponent"
import {getExchangeRates} from './api';
import SplashScreenComponent from './src/SplashScreenComponent';
import {styles} from './src/styles';

interface Currency {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

type ExchangeRates = Currency[];

const App = () => {
  const [fromValue, setFromValue] = useState<Currency>({
    code: 'GBP',
    name: 'British Pound',
    rate: 0.8575239,
    symbol: '£',
  });
  const [toValue, setToValue] = useState<Currency>({
    code: 'EUR',
    name: 'Euro',
    rate: 1.1661482,
    symbol: '€',
  });
  const [amountFrom, setAmountFrom] = useState<string>('');
  const [amountTo, setAmountTo] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const data = await getExchangeRates('aud');
    //     const arrayOfCurrencies: Currency[] = Object.keys(data).map(key => ({
    //       code: key,
    //       name: data[key].name,
    //       rate: data[key].rate,
    //       symbol: data[key].symbol,
    //     }));
    //     setExchangeRates(arrayOfCurrencies);
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       setError(error); // `error` is of type `Error`
    //     } else {
    //       setError(new Error('An unknown error occurred')); // Default error message
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchData = async () => {
      try {
        const dataPromise = getExchangeRates('gbp');
        const timeoutPromise = new Promise(resolve =>
          setTimeout(resolve, 3000),
        );

        const data = await Promise.all([dataPromise, timeoutPromise]);
        const exchangeRatesData = data[0];

        const arrayOfCurrencies: Currency[] = Object.keys(exchangeRatesData).map(key => {
          return {code: key, ...exchangeRatesData[key]};
        });
        setExchangeRates(arrayOfCurrencies);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (fromValue.code && toValue.code) {
      fetchExchangeRate(fromValue.code, toValue.code);
    }
  }, [fromValue, toValue]);

  const fetchExchangeRate = async (from: string, to: string) => {
    try {
      const data = await getExchangeRates(from);
      setExchangeRate(data[to].rate);
      updateToAmount(amountFrom, data[to].rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const handleFromAmountChange = (amount: string) => {
    if (!isNaN(Number(amount))) {
      setAmountFrom(amount);
      updateToAmount(amount, exchangeRate);
    }
  };

  const handleToAmountChange = (amount: string) => {
    if (!isNaN(Number(amount))) {
      setAmountTo(amount);
      updateFromAmount(amount, exchangeRate);
    }
  };

  const updateToAmount = (amount: string, rate: number | null) => {
    if (rate !== null) {
      const converted = Number(amount) * rate;
      setAmountTo(converted.toFixed(toValue.code === 'JPY' ? 0 : 2));
    }
  };

  const updateFromAmount = (amount: string, rate: number | null) => {
    if (rate !== null) {
      const converted = Number(amount) / rate;
      setAmountFrom(converted.toFixed(fromValue.code === 'JPY' ? 0 : 2));
    }
  };

  const DropdownItem = (item: {code: string}) => {
    return (
      <View style={styles.dropdownItem}>
        <IconComponent code={item?.code} style={styles.iconStyle} />
        <Text style={styles.dropdownTextItem}>{item?.code}</Text>
      </View>
    );
  };

  const handleFromCurrencyChange = (item: Currency) => {
    if (item.code === toValue.code) {
      Alert.alert(
        'Invalid Selection',
        'You cannot select the same currency for both.',
      );
    } else {
      setFromValue(item);
    }
  };

  const handleToCurrencyChange = (item: Currency) => {
    if (item.code === fromValue.code) {
      Alert.alert(
        'Invalid Selection',
        'You cannot select the same currency for both.',
      );
    } else {
      setToValue(item);
    }
  };

  if (loading) {
    return <SplashScreenComponent />;
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <SwapFrom width={80} height={80} />
        <Text style={styles.title}>Swap From</Text>
        <View style={styles.converterContainer}>
          {exchangeRates.length > 0 && (
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={exchangeRates}
              maxHeight={200}
              labelField="code"
              valueField="code"
              placeholder={'GBP'}
              value={fromValue.code}
              confirmSelectItem
              onConfirmSelectItem={handleFromCurrencyChange}
              closeModalWhenSelectedItem={true}
              renderLeftIcon={() => (
                <IconComponent code={fromValue.code} style={styles.iconStyle} />
              )}
              renderItem={DropdownItem}
              onChange={function (item: Currency): void {
                throw new Error('Function not implemented.');
              }}
            />
          )}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amountFrom}
            onChangeText={handleFromAmountChange}
            placeholder="From Amount"
          />
          <Text style={[styles.title, styles.equals]}>to</Text>
          <Text style={styles.conversionText}>
            {fromValue.code} {fromValue.symbol}1.00 = {toValue.code}{' '}
            {toValue.symbol}
            {(1 / exchangeRate!).toFixed(toValue.code === 'JPY' ? 0 : 4)}
          </Text>
          {exchangeRates.length > 0 && (
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={exchangeRates}
              maxHeight={200}
              labelField="code"
              valueField="code"
              placeholder={'EUR'}
              value={toValue.code}
              confirmSelectItem
              onConfirmSelectItem={handleToCurrencyChange}
              renderLeftIcon={() => (
                <IconComponent code={toValue.code} style={styles.iconStyle} />
              )}
              renderItem={DropdownItem}
              onChange={function (item: Currency): void {
                throw new Error('Function not implemented.');
              }}
            />
          )}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amountTo}
            onChangeText={handleToAmountChange}
            placeholder="To Amount"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default App;
