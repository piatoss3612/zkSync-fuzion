import { FUZION_ROUTER_ABI, FUZION_ROUTER_ADDRESS } from "./FuzionRouter";
import { IPAYMASTER_ABI } from "./IPaymaster";
import { FUZION_PAYMASTER_ABI } from "./FuzionPaymaster";
import { IMODULE_INTERFACE_ID, IMODULE_ABI } from "./IModule";
import { ModuleInitData } from "@/types";
import { encodeAbiParameters } from "viem";

const abbreviateAddress = (address: string, startLength = 8, endLength = 6) => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

const initializeAbiParameter = [
  {
    type: "tuple[]",
    name: "data",
    components: [
      { name: "moduleType", type: "uint8" },
      { name: "isDefault", type: "bool" },
      { name: "module", type: "address" },
      { name: "initData", type: "bytes" },
    ],
  },
];

const formatRatingCount = (count: number) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
};

const encodeModuleInitData = (moduleInitDataList: ModuleInitData[]) => {
  return encodeAbiParameters(initializeAbiParameter, [moduleInitDataList]);
};

export {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  IPAYMASTER_ABI,
  FUZION_PAYMASTER_ABI,
  IMODULE_INTERFACE_ID,
  IMODULE_ABI,
  abbreviateAddress,
  encodeModuleInitData,
  formatRatingCount,
};
