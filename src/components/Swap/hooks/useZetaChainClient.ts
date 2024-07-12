"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Signer } from "ethers";

interface UseZetaChainClientProps {
  signer: Signer | undefined;
  url: string;
}

export const useZetaChainClient = ({
  signer,
  url,
}: UseZetaChainClientProps) => {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !signer || !url) return;

    const initializeClient = async () => {
      const { ZetaChainClient } = await import("@zetachain/toolkit/client");
      const zetaClient = new ZetaChainClient({
        signer: signer,
        network: "testnet",
        chains: {
          zeta_testnet: {
            api: [
              {
                url: url,
                type: "evm",
              },
            ],
          },
        },
      });

      setClient(zetaClient);
    };

    initializeClient();
  }, [signer, url]);

  return client;
};

export default useZetaChainClient;
