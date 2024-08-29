import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ModuleRatingUpdated,
  ModuleRegistered,
  OwnershipTransferred,
  PaymasterCreated
} from "../generated/FuzionRouter/FuzionRouter"

export function createModuleRatingUpdatedEvent(
  module: Address,
  rater: Address,
  rating: i32,
  totalRating: BigInt,
  totalCount: BigInt
): ModuleRatingUpdated {
  let moduleRatingUpdatedEvent = changetype<ModuleRatingUpdated>(newMockEvent())

  moduleRatingUpdatedEvent.parameters = new Array()

  moduleRatingUpdatedEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  )
  moduleRatingUpdatedEvent.parameters.push(
    new ethereum.EventParam("rater", ethereum.Value.fromAddress(rater))
  )
  moduleRatingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "rating",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(rating))
    )
  )
  moduleRatingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalRating",
      ethereum.Value.fromUnsignedBigInt(totalRating)
    )
  )
  moduleRatingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalCount",
      ethereum.Value.fromUnsignedBigInt(totalCount)
    )
  )

  return moduleRatingUpdatedEvent
}

export function createModuleRegisteredEvent(
  module: Address,
  moduleType: i32,
  name: string
): ModuleRegistered {
  let moduleRegisteredEvent = changetype<ModuleRegistered>(newMockEvent())

  moduleRegisteredEvent.parameters = new Array()

  moduleRegisteredEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  )
  moduleRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "moduleType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(moduleType))
    )
  )
  moduleRegisteredEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return moduleRegisteredEvent
}

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
  paymaster: Address,
  owner: Address,
  name: string
): PaymasterCreated {
  let paymasterCreatedEvent = changetype<PaymasterCreated>(newMockEvent())

  paymasterCreatedEvent.parameters = new Array()

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
