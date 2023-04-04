import { Swap } from "../generated/Pair/PancakePair"
import { Swap as SwapSchema } from "../generated/schema"
import { getUsdPricePerToken } from "./prices/index"
import { Address } from "@graphprotocol/graph-ts"
import { BigDecimal } from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { RDNTToken } from "./constants"

const BNBAddress = Address.fromHexString("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
const RDNTAddress = Address.fromHexString("0xf7DE7E8A6bd59ED41a4b5fe50278b3B7f31384dF")

export function handleSwap(event: Swap): void {
  let swap = new SwapSchema(event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString())

  let token0 = BNBAddress
  let token1 = RDNTAddress
  let amountBought = event.params.amount1Out

  if (BNBAddress.toHexString() > RDNTAddress.toHexString()) {
    token1 = BNBAddress
    token0 = RDNTAddress
    amountBought = event.params.amount0Out
  }

  if (amountBought <= BigInt.fromI32(0)) {
    return
  }
  swap.pair = event.address.toHexString()
  swap.timestamp = event.block.timestamp
  swap.account = event.params.to.toHexString()
  swap.amount0In = event.params.amount0In
  swap.amount0Out = event.params.amount0Out
  swap.amount1In = event.params.amount1In
  swap.amount1Out = event.params.amount1Out
  let tokenPrice: BigDecimal
  let fetchPrice = getUsdPricePerToken(RDNTToken)

  tokenPrice = fetchPrice.usdPrice.times(amountBought.divDecimal(BigDecimal.fromString("1000000000000000000")))

  swap.amountUSD = tokenPrice

  swap.save()
}
