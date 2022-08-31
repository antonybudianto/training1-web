export interface CurrencyData {
  currencySymbol: string;
  name: string;
  logo: string;
}

export interface PriceChange {
  day: string;
  week: string;
  month: string;
  year: string;
  latestPrice: number;
}

export interface TokenListProps {
  search: string;
}
