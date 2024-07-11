import { ConnectButton } from "@rainbow-me/rainbowkit";
import Swap from "@/components/Swap";

function Page() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      <div className="w-[400px]">
        <Swap contract="" client=""></Swap>
      </div>
    </div>
  );
}

export default Page;
