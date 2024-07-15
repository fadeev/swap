"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Swap, Balances, useZetaChainClient, useEthersSigner } from "@/index";
import { useAccount, useSwitchChain, useChainId, useWalletClient } from "wagmi";

const contract = "0xb459F14260D1dc6484CE56EB0826be317171e91F";

function Page() {
  const account = useAccount();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId });
  const signer = useEthersSigner({ walletClient });
  const client = useZetaChainClient({ network: "testnet", signer });

  return (
    <div className="m-4">
      <div className="flex justify-end">
        <ConnectButton />
      </div>
      <div className="flex justify-center">
        <div className="w-[400px]">
          {client && (
            <div>
              {/* <Balances client={client} account={account}></Balances> */}

              <Swap
                contract={contract}
                client={client}
                switchChain={switchChain}
                account={account}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
