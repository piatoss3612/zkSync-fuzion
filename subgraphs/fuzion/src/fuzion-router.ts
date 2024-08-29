import {
  ModuleRatingUpdated as ModuleRatingUpdatedEvent,
  ModuleRegistered as ModuleRegisteredEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PaymasterCreated as PaymasterCreatedEvent
} from "../generated/FuzionRouter/FuzionRouter"
import {
  ModuleRatingUpdated,
  ModuleRegistered,
  OwnershipTransferred,
  PaymasterCreated
} from "../generated/schema"

export function handleModuleRatingUpdated(
  event: ModuleRatingUpdatedEvent
): void {
  let entity = new ModuleRatingUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.module = event.params.module
  entity.rater = event.params.rater
  entity.rating = event.params.rating
  entity.totalRating = event.params.totalRating
  entity.totalCount = event.params.totalCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleModuleRegistered(event: ModuleRegisteredEvent): void {
  let entity = new ModuleRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.module = event.params.module
  entity.moduleType = event.params.moduleType
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

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
  entity.paymaster = event.params.paymaster
  entity.owner = event.params.owner
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
