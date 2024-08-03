import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  PaymasterCreated,
  PaymasterFactorySet
} from "../generated/fuzion_router/fuzion_router"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPaymasterCreatedEvent(
  paymasterFactory: Address,
  paymaster: Address,
  owner: Address,
  name: string
): PaymasterCreated {
  let paymasterCreatedEvent = changetype<PaymasterCreated>(newMockEvent())

  paymasterCreatedEvent.parameters = new Array()

  paymasterCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "paymasterFactory",
      ethereum.Value.fromAddress(paymasterFactory)
    )
  )
  paymasterCreatedEvent.parameters.push(
    new ethereum.EventParam("paymaster", ethereum.Value.fromAddress(paymaster))
  )
  paymasterCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  paymasterCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return paymasterCreatedEvent
}

export function createPaymasterFactorySetEvent(
  paymasterFactory: Address
): PaymasterFactorySet {
  let paymasterFactorySetEvent = changetype<PaymasterFactorySet>(newMockEvent())

  paymasterFactorySetEvent.parameters = new Array()

  paymasterFactorySetEvent.parameters.push(
    new ethereum.EventParam(
      "paymasterFactory",
      ethereum.Value.fromAddress(paymasterFactory)
    )
  )

  return paymasterFactorySetEvent
}
