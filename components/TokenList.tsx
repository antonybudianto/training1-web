import Image from "next/image";
import { FC, useMemo, useRef } from "react";

import useCurrencies from "@/hooks/useCurrencies";
import usePriceChanges from "@/hooks/usePriceChanges";
import type { CurrencyData, TokenListProps } from "@/types/token";
import PriceCell from "./PriceCell";

const pairMainCurrency = "idr";

const locale = Intl.NumberFormat("id");

const TokenList: FC<TokenListProps> = ({ search }) => {
  const currencies = useCurrencies();
  const priceChangeMap = usePriceChanges();
  const animRef = useRef<Record<string, string>>({});
  const filteredCurrencies = useMemo(() => {
    return currencies.filter((d: CurrencyData) => {
      if (!search) return true;
      return d.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
  }, [search, currencies]);

  return (
    <div className="mt-10 mx-auto">
      <table className="table-auto">
        <thead>
          <tr className="text-gray-400 uppercase">
            <td width={100} className="font-bold text-center" colSpan={2}>
              Crypto
            </td>
            <td width={300} className="font-bold text-right">
              Harga
            </td>
            <td width={120} className="font-bold text-center">
              24 Jam
            </td>
            <td
              width={120}
              className="font-bold text-center hidden lg:table-cell"
            >
              1 MGG
            </td>
            <td
              width={120}
              className="font-bold text-center hidden lg:table-cell"
            >
              1 BLN
            </td>
            <td
              width={120}
              className="font-bold text-center hidden lg:table-cell"
            >
              1 THN
            </td>
          </tr>
        </thead>
        <tbody className="text-sm lg:text-lg">
          {filteredCurrencies.map((d: CurrencyData, i) => {
            const latest =
              priceChangeMap[
                `${d.currencySymbol.toLowerCase()}/${pairMainCurrency}`
              ] || {};
            const day = parseFloat(latest.day) || 0;
            const dayMinus = day < 0;
            const week = parseFloat(latest.week) || 0;
            const weekMinus = week < 0;
            const month = parseFloat(latest.month) || 0;
            const monthMinus = month < 0;
            const year = parseFloat(latest.year) || 0;
            const yearMinus = year < 0;
            animRef.current[d.currencySymbol] = dayMinus
              ? "animate-orange-change"
              : "animate-green-change";
            setTimeout(() => {
              animRef.current[d.currencySymbol] = "";
            }, 2000);
            return (
              <tr key={i}>
                <td className="p-3 border-green-400 border-1">
                  <div className="flex items-center">
                    <Image
                      src={d.logo}
                      alt={`logo ${d.name}`}
                      width={30}
                      height={30}
                      style={{
                        backgroundColor: "white",
                      }}
                    />
                    <span className="ml-2">{d.name}</span>
                  </div>
                </td>
                <td className="text-gray-400">{d.currencySymbol}</td>
                <PriceCell
                  animation={
                    dayMinus ? "animate-red-change" : "animate-green-change"
                  }
                  value={`Rp${locale.format(latest.latestPrice || 0)}`}
                />

                <td
                  className={`text-center ${
                    dayMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {dayMinus ? "-" : "+"}
                  {Math.abs(day)}%
                </td>
                <td
                  className={`text-center hidden lg:table-cell ${
                    weekMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {weekMinus ? "-" : "+"}
                  {Math.abs(week)}%
                </td>
                <td
                  className={`text-center hidden lg:table-cell ${
                    monthMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {monthMinus ? "-" : "+"}
                  {Math.abs(month)}%
                </td>
                <td
                  className={`text-center hidden lg:table-cell ${
                    yearMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {yearMinus ? "-" : "+"}
                  {Math.abs(year)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;
