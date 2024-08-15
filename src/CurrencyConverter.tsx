import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TextInput, Alert, Image} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconComponent from './IconComponent';
import {getExchangeRates} from '../api';
import {styles} from './styles';

interface Currency {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

type ExchangeRates = Currency[];

const CurrencyConverter: React.FC = () => {
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
  const [amountFrom, setAmountFrom] = useState<string>('0');
  const [amountTo, setAmountTo] = useState<string>('0');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>([]);

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedFromValue = await AsyncStorage.getItem('@fromValue');
        const storedToValue = await AsyncStorage.getItem('@toValue');
        const storedAmountFrom = await AsyncStorage.getItem('@amountFrom');
        const storedAmountTo = await AsyncStorage.getItem('@amountTo');

        if (storedFromValue) setFromValue(JSON.parse(storedFromValue));
        if (storedToValue) setToValue(JSON.parse(storedToValue));
        if (storedAmountFrom) setAmountFrom(storedAmountFrom);
        if (storedAmountTo) setAmountTo(storedAmountTo);
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exchangeRatesData = await getExchangeRates('gbp');
        const arrayOfCurrencies: Currency[] = Object.keys(
          exchangeRatesData,
        ).map(key => {
          return {code: key, ...exchangeRatesData[key]};
        });
        setExchangeRates(arrayOfCurrencies);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (fromValue.code && toValue.code) {
      fetchExchangeRate(fromValue.code, toValue.code);
    }
  }, [fromValue, toValue]);

  // Save data to AsyncStorage when values change
  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('@fromValue', JSON.stringify(fromValue));
        await AsyncStorage.setItem('@toValue', JSON.stringify(toValue));
        await AsyncStorage.setItem('@amountFrom', amountFrom);
        await AsyncStorage.setItem('@amountTo', amountTo);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    storeData();
  }, [fromValue, toValue, amountFrom, amountTo]);

  const fetchExchangeRate = async (from: string, to: string) => {
    try {
      const data = await getExchangeRates(from);
      const rate = data[to].rate;
      setExchangeRate(rate);
  
      setAmountFrom((prevAmountFrom) => {
        updateToAmount(prevAmountFrom, rate);
        return prevAmountFrom;
      });
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const handleFromAmountChange = useCallback(
    (amount: string) => {
      if (!isNaN(Number(amount))) {
        setAmountFrom(amount);
        updateToAmount(amount, exchangeRate);
      }
    },
    [exchangeRate],
  );

  const handleToAmountChange = useCallback(
    (amount: string) => {
      if (!isNaN(Number(amount))) {
        setAmountTo(amount);
        updateFromAmount(amount, exchangeRate);
      }
    },
    [exchangeRate],
  );

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

  const handleFromCurrencyChange = useCallback(
    (item: Currency) => {
      if (item.code === toValue.code) {
        Alert.alert(
          'Invalid Selection',
          'You cannot select the same currency for both.',
        );
      } else {
        setFromValue(item);
      }
    },
    [toValue.code],
  );

  const handleToCurrencyChange = useCallback(
    (item: Currency) => {
      if (item.code === fromValue.code) {
        Alert.alert(
          'Invalid Selection',
          'You cannot select the same currency for both.',
        );
      } else {
        setToValue(item);
      }
    },
    [fromValue.code],
  );

  return (
    <View style={styles.container}>
      <Image source={require('../images/SwapFrom.png')} />
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
        <View style={styles.inputContainer}>
          <Text>{fromValue.symbol}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amountFrom}
            onChangeText={handleFromAmountChange}
            placeholder="From Amount"
          />
        </View>
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
        <View style={styles.inputContainer}>
          <Text>{toValue.symbol}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amountTo}
            onChangeText={handleToAmountChange}
            placeholder="To Amount"
          />
        </View>
      </View>
    </View>
  );
};

export default CurrencyConverter;
