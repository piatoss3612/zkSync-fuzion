import { FUZION_ROUTER_ABI, FUZION_ROUTER_ADDRESS } from "./FuzionRouter";
import { IPAYMASTER_ABI } from "./IPaymaster";
import { IMODULE_INTERFACE_ID, IMODULE_ABI } from "./IModule";

const abbreviateAddress = (address: string, startLength = 8, endLength = 6) => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  IPAYMASTER_ABI,
  IMODULE_INTERFACE_ID,
  IMODULE_ABI,
  abbreviateAddress,
};
