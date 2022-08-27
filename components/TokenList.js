import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const pairMainCurrency = "idr";

const locale = Intl.NumberFormat("id");

const TokenList = () => {
  const [data, setData] = useState([]);
  const [priceChangeMap, setPriceChangeList] = useState({});

  const fetchPriceChanges = useCallback(() => {
    fetch("https://api.pintu.co.id/v2/trade/price-changes")
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        // setPriceChangeList(json.payload);
        const hashmap = json.payload.reduce((acc, curr) => {
          const newObj = { ...acc };
          newObj[curr.pair] = curr;
          return newObj;
        }, {});
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

  console.log(">>", data[0]);

  return (
    <div className="mt-10">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 uppercase">
            <th width={100} className="text-center" colSpan={2}>
              Crypto
            </th>
            <th width={300} className="text-right">
              Harga
            </th>
            <th width={120} className="text-center">
              24 Jam
            </th>
            <th width={120} className="text-center">
              1 MGG
            </th>
            <th width={120} className="text-center">
              1 BLN
            </th>
            <th width={120} className="text-center">
              1 THN
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
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
            return (
              <tr key={i}>
                <td className="p-3 border-green-400 border-1">
                  <div className="flex items-center">
                    <Image
                      src={d.logo}
                      alt={`logo ${d.name}`}
                      width={30}
                      height={30}
                    />
                    <span className="ml-2">{d.name}</span>
                  </div>
                </td>
                <td className="text-gray-400">{d.currencySymbol}</td>
                <td className="text-right">
                  Rp{locale.format(latest.latestPrice || 0)}
                </td>
                <td
                  className={`text-center ${
                    dayMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {dayMinus ? "-" : "+"}
                  {Math.abs(day)}%
                </td>
                <td
                  className={`text-center ${
                    weekMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {weekMinus ? "-" : "+"}
                  {Math.abs(week)}%
                </td>
                <td
                  className={`text-center ${
                    monthMinus ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {monthMinus ? "-" : "+"}
                  {Math.abs(month)}%
                </td>
                <td
                  className={`text-center ${
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
