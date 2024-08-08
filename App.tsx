import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import SplashScreenComponent from './src/SplashScreenComponent';
import {styles} from './src/styles';
import CurrencyConverter from './src/CurrencyConverter';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data
        const timeoutPromise = new Promise(resolve =>
          setTimeout(resolve, 3000),
        );

        await timeoutPromise;
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

  if (loading) {
    return <SplashScreenComponent />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.message}</Text>;
  }

  return <CurrencyConverter />;
};

export default App;
