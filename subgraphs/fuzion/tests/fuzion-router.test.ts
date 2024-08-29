import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ModuleRatingUpdated } from "../generated/schema"
import { ModuleRatingUpdated as ModuleRatingUpdatedEvent } from "../generated/FuzionRouter/FuzionRouter"
import { handleModuleRatingUpdated } from "../src/fuzion-router"
import { createModuleRatingUpdatedEvent } from "./fuzion-router-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let module = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let rater = Address.fromString("0x0000000000000000000000000000000000000001")
    let rating = 123
    let totalRating = BigInt.fromI32(234)
    let totalCount = BigInt.fromI32(234)
    let newModuleRatingUpdatedEvent = createModuleRatingUpdatedEvent(
      module,
      rater,
      rating,
      totalRating,
      totalCount
    )
    handleModuleRatingUpdated(newModuleRatingUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ModuleRatingUpdated created and stored", () => {
    assert.entityCount("ModuleRatingUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ModuleRatingUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "module",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ModuleRatingUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rater",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ModuleRatingUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rating",
      "123"
    )
    assert.fieldEquals(
      "ModuleRatingUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalRating",
      "234"
    )
    assert.fieldEquals(
      "ModuleRatingUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalCount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
