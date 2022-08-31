import { FC, useEffect, useRef, useState } from "react";

interface PriceCellProps {
  latestPrice: number;
}

const locale = Intl.NumberFormat("id");

const PriceCell: FC<PriceCellProps> = ({ latestPrice }) => {
  const [anim, setAnim] = useState("");
  const priceRef = useRef(latestPrice);

  useEffect(() => {
    if (latestPrice > priceRef.current) {
      setAnim("animate-green-change");
    } else {
      setAnim("animate-red-change");
    }
    priceRef.current = latestPrice;

    setTimeout(() => {
      setAnim("");
    }, 1900);
  }, [latestPrice]);

  return (
    <td className={`text-right ${anim}`}>
      Rp{locale.format(latestPrice || 0)}
    </td>
  );
};

export default PriceCell;
