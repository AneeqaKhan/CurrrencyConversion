import React, { FC } from 'react';
import { currencyIcons } from './CurrencyIcons'; // Adjust the path as needed
import GBPIcon from '../images/GBP.svg'; // Adjust the path as needed

interface IconComponentProps {
  code: string;
  style?: object;
}

const IconComponent: FC<IconComponentProps> = ({ code, style }) => {
  const Component = currencyIcons[code] || GBPIcon;
  return <Component style={style} />;
};

export default IconComponent;
