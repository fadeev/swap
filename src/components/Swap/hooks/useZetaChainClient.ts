import { useState, useEffect } from "react";
import { ZetaChainClient } from "@zetachain/toolkit/client";
import { Signer } from "ethers";

interface UseZetaChainClientProps {
  signer: Signer | undefined;
  url: string;
}

export const useZetaChainClient = ({
  signer,
  url,
}: UseZetaChainClientProps) => {
  const [client, setClient] = useState<ZetaChainClient | null>(null);

  useEffect(() => {
    if (!signer || !url) return;

    const initializeClient = async () => {
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
