import React, { FC } from 'react';
import { currencyIcons } from './CurrencyIcons'; 
import GBPIcon from '../images/GBP.svg'; 

interface IconComponentProps {
  code: string;
  style?: object;
}

const IconComponent: FC<IconComponentProps> = ({ code, style }) => {
  const Component = currencyIcons[code] || GBPIcon;
  return <Component style={style} />;
};

export default IconComponent;
