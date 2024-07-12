import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Search } from "lucide-react";

export const Balances = ({
  client,
  address,
}: {
  client: any;
  address: any;
}) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedChain, setSelectedChain] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const result = await client.getBalances({ evmAddress: address });
        setBalances(result);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBalances();
  }, [client, address]);

  const uniqueChains = Array.from(
    new Set(balances.map((token: any) => token.chain_name))
  );

  const filteredBalances = balances
    .filter(
      (token: any) =>
        token.symbol.toLowerCase().includes(search.toLowerCase()) &&
        (selectedChain === "" || token.chain_name === selectedChain)
    )
    .sort((a: any, b: any) => parseFloat(b.balance) - parseFloat(a.balance)); // Sort tokens by amount

  return (
    <div>
      <Card>
        <div className="m-2 relative">
          <Input
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
        </div>

        <div className="relative overflow-x-auto scrollbar-hide px-2">
          <div className="flex">
            {uniqueChains.map((chain) => (
              <Button
                variant="outline"
                size="sm"
                key={chain}
                className={`mr-2 ${
                  selectedChain === chain ? "bg-slate-100" : ""
                }`}
                onClick={() =>
                  setSelectedChain(chain === selectedChain ? "" : chain)
                }
              >
                {chain}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <LoaderCircle className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="m-2 max-h-96 overflow-scroll">
            {filteredBalances.map((token: any) => (
              <div
                key={token.id}
                className="flex justify-between py-2 px-3 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                <div className="flex flex-col">
                  <span>{token.symbol}</span>
                  <span className="text-gray-500 text-xs">
                    {token.chain_name}
                  </span>
                </div>
                <span>{parseFloat(token.balance).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
