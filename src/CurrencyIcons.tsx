import AEDIcon from '../images/AED.svg';
import AUDIcon from '../images/AUD.svg';
import CADIcon from '../images/CAD.svg';
import CHFIcon from '../images/CHF.svg';
import CNYIcon from '../images/CNY.svg';
import EURIcon from '../images/EUR.svg';
import GBPIcon from '../images/GBP.svg';
import JPYIcon from '../images/JPY.svg';
import NZDIcon from '../images/NZD.svg';
import THBIcon from '../images/THB.svg';
import USDIcon from '../images/USD.svg';
import ZARIcon from '../images/ZAR.svg';
import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

export type CurrencyIcons = {
  [key: string]: FC<SvgProps>;
};

export const currencyIcons: CurrencyIcons = {
  AED: AEDIcon,
  AUD: AUDIcon,
  CAD: CADIcon,
  CHF: CHFIcon,
  CNY: CNYIcon,
  EUR: EURIcon,
  GBP: GBPIcon,
  JPY: JPYIcon,
  NZD: NZDIcon,
  THB: THBIcon,
  USD: USDIcon,
  ZAR: ZARIcon,
};
