import Image from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import PriceCell from "./PriceCell";

const pairMainCurrency = "idr";

const locale = Intl.NumberFormat("id");

interface CurrencyData {
  currencySymbol: string;
  name: string;
  logo: string;
}

interface PriceChange {
  day: string;
  week: string;
  month: string;
  year: string;
  latestPrice: number;
}

interface TokenListProps {
  search: string;
}

const TokenList: FC<TokenListProps> = ({ search }) => {
  const [data, setData] = useState([]);
  const [priceChangeMap, setPriceChangeList] = useState<
    Record<string, PriceChange>
  >({});
  const animRef = useRef<Record<string, string>>({});

  const fetchPriceChanges = useCallback(() => {
    fetch("https://api.pintu.co.id/v2/trade/price-changes")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        const hashmap = json.payload.reduce(
          (acc: Record<string, unknown>, curr: { pair: string }) => {
            const newObj = { ...acc };
            newObj[curr.pair] = curr;
            return newObj;
          },
          {}
        );
        setPriceChangeList(hashmap);
      });
  }, []);

  const fetchCurrencies = useCallback(() => {
    fetch("https://api.pintu.co.id/v2/wallet/supportedCurrencies")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        setData(json.payload.slice(1));
      });
  }, []);

  useEffect(() => {
    fetchCurrencies();
    const intervalId = setInterval(() => {
      fetchPriceChanges();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
    // didmount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {data
            .filter((d: CurrencyData) => {
              if (!search) return true;
              return d.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            })
            .map((d: CurrencyData, i) => {
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
