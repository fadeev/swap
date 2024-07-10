// Swap component being imported

"use client";

import { useAccount } from "wagmi";

export const Swap = () => {
  const { address } = useAccount();
  return <div>Swap</div>;
};
