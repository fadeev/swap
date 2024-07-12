"use client";

import { useEffect, useState } from "react";

import SwapLayout from "./Layout";
import useAmountValidation from "./hooks/useAmountValidation";
import useCrossChainFee from "./hooks/useCrossChainFee";
import useDestinationAddress from "./hooks/useDestinationAddress";
import useDestinationAmount from "./hooks/useDestinationAmount";
import useSendTransaction from "./hooks/useSendTransaction";
import { computeSendType, sendTypeDetails } from "./hooks/computeSendType";
import useSwapErrors from "./hooks/useSwapErrors";
import useTokenSelection from "./hooks/useTokenSelection";
import { formatAddress } from "./lib/utils";

interface SwapProps {
  contract: string;
  client: any;
  switchChain: (params: { chainId: number }) => void;
  address: `0x${string}` | undefined;
  chain: number;
  track?: any;
  balances?: any;
}

export const Swap: React.FC<SwapProps> = ({
  contract,
  track,
  balances: balancesProp,
  client,
  switchChain,
  address,
  chain,
}) => {
  const bitcoinAddress = ""; // temporary

  const [sourceAmount, setSourceAmount] = useState<string>("");
  const [isRightChain, setIsRightChain] = useState(true);
  const [sendButtonText, setSendButtonText] = useState("Send tokens");

  const [balances, setBalances] = useState<any>(balancesProp || []);
  const [balancesLoading, setBalancesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalances = async () => {
      setBalancesLoading(true);
      try {
        const result = await client.getBalances({ evmAddress: address });
        console.log("BALANCES", result);
        setBalances(result);
      } catch (error) {
        console.error("Error fetching local balances:", error);
      } finally {
        setBalancesLoading(false);
      }
    };

    if (balancesProp) {
      setBalances(balancesProp);
      setBalancesLoading(false);
    } else {
      fetchBalances();
    }
  }, []);

  const {
    setSourceToken,
    sourceTokenSelected,
    sourceBalances,
    setDestinationToken,
    destinationTokenSelected,
    destinationBalances,
  } = useTokenSelection(balances, bitcoinAddress);

  const { crossChainFee } = useCrossChainFee(
    sourceTokenSelected,
    destinationTokenSelected,
    client
  );

  const { isAmountGTFee, isAmountLTBalance } = useAmountValidation(
    sourceTokenSelected,
    destinationTokenSelected,
    sourceAmount,
    crossChainFee
  );

  const { destinationAmount, destinationAmountIsLoading } =
    useDestinationAmount(
      sourceTokenSelected,
      destinationTokenSelected,
      sourceAmount,
      crossChainFee,
      balances,
      client
    );

  const { priorityErrors } = useSwapErrors(
    sourceTokenSelected,
    destinationTokenSelected,
    sourceAmount,
    isAmountGTFee,
    isAmountLTBalance,
    destinationAmountIsLoading
  );

  const {
    addressSelected,
    isAddressSelectedValid,
    canChangeAddress,
    customAddress,
    setCustomAddress,
    isCustomAddressValid,
    saveCustomAddress,
  } = useDestinationAddress(address, destinationTokenSelected, bitcoinAddress);

  const { handleSend, isSending } = useSendTransaction(
    sourceTokenSelected,
    destinationTokenSelected,
    sourceAmount,
    addressSelected,
    setSourceAmount,
    contract,
    bitcoinAddress,
    client,
    address,
    track
  );

  const sendType = computeSendType(
    sourceTokenSelected,
    destinationTokenSelected
  );

  const sendDisabled =
    !sendType ||
    !isAmountGTFee ||
    !isAmountLTBalance ||
    isSending ||
    !isAddressSelectedValid ||
    destinationAmountIsLoading ||
    !destinationAmount ||
    balancesLoading;

  useEffect(() => {
    if (isSending) {
      setSendButtonText("Sending...");
    } else if (sendDisabled && priorityErrors.length > 0) {
      setSendButtonText(priorityErrors[0].message);
    } else {
      setSendButtonText("Send Tokens");
    }
  }, [isSending, sendDisabled, priorityErrors, destinationAmountIsLoading]);

  useEffect(() => {
    if (sourceTokenSelected?.chain_name === "btc_testnet") {
      setIsRightChain(true);
    } else if (chain && sourceTokenSelected) {
      setIsRightChain(
        chain.toString() === sourceTokenSelected.chain_id.toString()
      );
    }
  }, [chain, sourceTokenSelected]);

  const handleSwitchNetwork = () => {
    const chain_id = sourceTokenSelected?.chain_id;
    if (chain_id) {
      console.log(chain_id);
      switchChain({ chainId: chain_id });
    }
  };

  return (
    <div>
      <SwapLayout
        sendTypeDetails={sendTypeDetails}
        sendType={sendType}
        sourceAmount={sourceAmount}
        setSourceAmount={setSourceAmount}
        sourceTokenSelected={sourceTokenSelected}
        balancesLoading={balancesLoading}
        sourceBalances={sourceBalances}
        setSourceToken={setSourceToken}
        destinationAmount={destinationAmount}
        destinationAmountIsLoading={destinationAmountIsLoading}
        destinationTokenSelected={destinationTokenSelected}
        destinationBalances={destinationBalances}
        setDestinationToken={setDestinationToken}
        computeSendType={computeSendType}
        addressSelected={addressSelected}
        canChangeAddress={canChangeAddress}
        isAddressSelectedValid={isAddressSelectedValid}
        formatAddress={formatAddress}
        customAddress={customAddress}
        setCustomAddress={setCustomAddress}
        isCustomAddressValid={isCustomAddressValid}
        saveCustomAddress={saveCustomAddress}
        crossChainFee={crossChainFee}
        isRightChain={isRightChain}
        handleSend={handleSend}
        sendDisabled={sendDisabled}
        isSending={isSending}
        sendButtonText={sendButtonText}
        handleSwitchNetwork={handleSwitchNetwork}
      />
    </div>
  );
};
