import { useCallback, useEffect, useState } from "react";
import { PriceChange } from "@/types/token";

const usePriceChanges = () => {
  const [hashmap, setHashmap] = useState<Record<string, PriceChange>>({});

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
        setHashmap(hashmap);
      });
  }, []);

  useEffect(() => {
    const intId = setInterval(() => {
      fetchPriceChanges();
    }, 2000);
    return () => {
      clearInterval(intId);
    };
  }, [fetchPriceChanges]);

  return hashmap;
};

export default usePriceChanges;
