import { FC, useEffect, useState } from "react";

interface PriceCellProps {
  value: string;
  animation: string;
}

const PriceCell: FC<PriceCellProps> = ({ value, animation }) => {
  const [anim, setAnim] = useState(animation);

  useEffect(() => {
    setAnim(animation);
    setTimeout(() => {
      setAnim("");
    }, 1900);
  }, [value, animation]);

  return <td className={`text-right ${anim}`}>{value}</td>;
};

export default PriceCell;
