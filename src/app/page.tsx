"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Balances } from "@/components/Balances";
import { useZetaChainClient } from "@/components/Balances/hooks/useZetaChainClient";
import { useEthersSigner } from "@/components/Balances/hooks/useEthersSigner";
import { useAccount, useSwitchChain, useChainId, useWalletClient } from "wagmi";

const url =
  "https://zetachain-athens.g.allthatnode.com/archive/evm/c8a40e8773fd4b0381f8447d2dcfb550";

function Page() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId });
  const signer = useEthersSigner({ walletClient });
  const client = useZetaChainClient({ signer, url });

  return (
    <div className="m-4">
      <div className="flex justify-end">
        <ConnectButton />
      </div>
      <div className="w-[400px]">
        <Balances client={client} address={address}></Balances>
      </div>
    </div>
  );
}

export default Page;
