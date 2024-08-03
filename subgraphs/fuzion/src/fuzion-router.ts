import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PaymasterCreated as PaymasterCreatedEvent,
  PaymasterFactorySet as PaymasterFactorySetEvent
} from "../generated/fuzion_router/fuzion_router"
import {
  OwnershipTransferred,
  PaymasterCreated,
  PaymasterFactorySet
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymasterCreated(event: PaymasterCreatedEvent): void {
  let entity = new PaymasterCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paymasterFactory = event.params.paymasterFactory
  entity.paymaster = event.params.paymaster
  entity.owner = event.params.owner
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymasterFactorySet(
  event: PaymasterFactorySetEvent
): void {
  let entity = new PaymasterFactorySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paymasterFactory = event.params.paymasterFactory

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
