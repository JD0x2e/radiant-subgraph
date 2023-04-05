import { Swap } from "../generated/PairV3/PancakePairV3"
import { Swap2 as SwapSchema } from "../generated/schema"
import { getUsdPricePerToken } from "./prices/index"
import { Address } from "@graphprotocol/graph-ts"
import { BigDecimal } from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { RDNTToken } from "./constants"

const BNBAddress = Address.fromHexString("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
const RDNTAddress = Address.fromHexString("0xf7DE7E8A6bd59ED41a4b5fe50278b3B7f31384dF")

export function handleSwapV3(event: Swap): void {
  let swap = new SwapSchema(event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString())

  let token0 = BNBAddress
  let token1 = RDNTAddress
  let amountBought = event.params.amount1

  if (BNBAddress.toHexString() > RDNTAddress.toHexString()) {
    token1 = BNBAddress
    token0 = RDNTAddress
    amountBought = event.params.amount0
  }

  if (amountBought <= BigInt.fromI32(0)) {
    return
  }
  swap.pair = event.address.toHexString()
  swap.timestamp = event.block.timestamp
  swap.account = event.params.sender.toHexString()
  swap.amount0 = event.params.amount0
  swap.amount1 = event.params.amount1
  let tokenPrice: BigDecimal
  let fetchPrice = getUsdPricePerToken(RDNTToken)

  tokenPrice = fetchPrice.usdPrice.times(amountBought.divDecimal(BigDecimal.fromString("1000000000000000000")))

  swap.amountUSD = tokenPrice

  swap.save()
}
