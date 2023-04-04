import { ReceiveFromChain, SendToChain } from "../generated/Bridge/RDNTBridge"
import { Transfer } from "../generated/schema"
import { getUsdPricePerToken } from "./prices/index"
import { BigDecimal } from "@graphprotocol/graph-ts"
import { BigInt } from "@graphprotocol/graph-ts"
import { RDNTToken } from "./constants"

export function handleSendToChain(event: SendToChain): void {
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString())

  transfer.account = event.params._from.toHexString()
  transfer.timestamp = event.block.timestamp
  transfer.dstChainId = BigInt.fromI32(event.params._dstChainId)
  transfer.amount = event.params._amount

  let tokenPrice: BigDecimal
  let fetchPrice = getUsdPricePerToken(RDNTToken)

  tokenPrice = fetchPrice.usdPrice.times(transfer.amount.divDecimal(BigDecimal.fromString("1000000000000000000")))

  transfer.amountUSD = tokenPrice

  transfer.save()
}

export function handleReceiveFromChain(event: ReceiveFromChain): void {
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString())

  transfer.account = event.params._to.toHexString()
  transfer.timestamp = event.block.timestamp
  transfer.srcChainId = BigInt.fromI32(event.params._srcChainId)
  transfer.amount = event.params._amount

  let tokenPrice: BigDecimal
  let fetchPrice = getUsdPricePerToken(RDNTToken)

  tokenPrice = fetchPrice.usdPrice.times(transfer.amount.divDecimal(BigDecimal.fromString("1000000000000000000")))

  transfer.amountUSD = tokenPrice

  transfer.save()
}
