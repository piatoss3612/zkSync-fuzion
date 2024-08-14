import { FUZION_ROUTER_ABI, FUZION_ROUTER_ADDRESS } from "./FuzionRouter";
import { GASLESS_PAYMASTER_ADDRESS } from "./PaymasterFactory";
import { IPAYMASTER_ABI } from "./IPaymaster";

const SupportedFactories: {
  address: `0x${string}`;
  name: string;
  description: string;
}[] = [
  {
    address: GASLESS_PAYMASTER_ADDRESS,
    name: "Gasless Paymaster",
    description:
      "A paymaster that pays for the gas of the transactions on behalf of the user",
  },
];

export {
  FUZION_ROUTER_ABI,
  FUZION_ROUTER_ADDRESS,
  GASLESS_PAYMASTER_ADDRESS,
  IPAYMASTER_ABI,
  SupportedFactories,
};
