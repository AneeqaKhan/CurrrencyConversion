import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import SwapFrom from './images/SwapFrom.svg';
import GBPIcon from './images/GBP.svg';
import {currencyIcons} from './src/CurrencyIcons';
import {getExchangeRates} from './api';

const App = () => {
  const [fromValue, setFromValue] = useState({
    code: 'GBP',
    name: 'British Pound',
    rate: 0.8575239,
    symbol: '£',
  });
  const [toValue, setToValue] = useState({
    code: 'EUR',
    name: 'Euro',
    rate: 1.1661482,
    symbol: '€',
  });
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExchangeRates('aud');
        const arrayOfCurrencies = Object.keys(data).map(key => {
          return {code: key, ...data[key]};
        });
        setExchangeRates(arrayOfCurrencies);
      } catch (error) {
        setError(error);
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

  const fetchExchangeRate = async (from, to) => {
    try {
      const data = await getExchangeRates(from);
      setExchangeRate(data[to].rate);
      updateToAmount(amountFrom, data[to].rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const handleFromAmountChange = amount => {
    if (!isNaN(amount)) {
      setAmountFrom(amount);
      updateToAmount(amount, exchangeRate);
    }
  };

  const handleToAmountChange = amount => {
    if (!isNaN(amount)) {
      setAmountTo(amount);
      updateFromAmount(amount, exchangeRate);
    }
  };

  const updateToAmount = (amount, rate) => {
    const converted = amount * rate;
    setAmountTo(converted.toFixed(toValue.code === 'JPY' ? 0 : 2));
  };

  const updateFromAmount = (amount, rate) => {
    const converted = amount / rate;
    setAmountFrom(converted.toFixed(fromValue.code === 'JPY' ? 0 : 2));
  };

  const IconComponent = ({code, style}) => {
    const Component = currencyIcons[code] || GBPIcon;
    return <Component style={style} />;
  };

  const DropdownItem = item => {
    return (
      <View style={styles.dropdownItem}>
        <IconComponent code={item?.code} style={styles.iconStyle} />
        <Text style={styles.dropdownTextItem}>{item?.code}</Text>
      </View>
    );
  };

  const handleFromCurrencyChange = item => {
    if (item.code === toValue.code) {
      Alert.alert(
        'Invalid Selection',
        'You cannot select the same currency for both.',
      );
    } else {
      setFromValue(item);
    }
  };

  const handleToCurrencyChange = item => {
    if (item.code === fromValue.code) {
      Alert.alert(
        'Invalid Selection',
        'You cannot select the same currency for both.',
      );
    } else {
      setToValue(item);
    }
  };

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
            {fromValue.code} {fromValue.symbol}1.00 = {toValue.symbol}
            {(1 / exchangeRate).toFixed(toValue.code === 'JPY' ? 0 : 4)}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  converterContainer: {
    padding: 20,
    width: '100%',
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  input: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    marginVertical: 30,
  },
  equals: {
    alignSelf: 'center',
  },
  conversionText: {
    alignSelf: 'center',
    margin: 15,
    fontSize: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownTextItem: {
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default App;
