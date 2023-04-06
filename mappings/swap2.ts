import { Swap } from "../generated/PairV3/PancakePairV3"
import { Swap2 as SwapSchema } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts';

export function handleSwapV3(event: Swap): void {
 let swap = new SwapSchema(event.transaction.hash.toHex() + '-' + event.logIndex.toString());

  swap.sender = event.params.sender.toHexString();
  swap.recipient = event.params.recipient.toHexString();
  swap.amount0 = event.params.amount0;
  swap.amount1 = event.params.amount1;
  swap.sqrtPriceX96 = event.params.sqrtPriceX96;
  swap.liquidity = event.params.liquidity;
  swap.tick = event.params.tick;
  swap.protocolFeesToken0 = event.params.protocolFeesToken0;
  swap.protocolFeesToken1 = event.params.protocolFeesToken1;
  swap.timestamp = event.block.timestamp;

  // Log sender, recipient, and amounts
  log.info('Swap event: sender={}, recipient={}, amount0={}, amount1={}', [
    event.params.sender.toHexString(),
    event.params.recipient.toHexString(),
    event.params.amount0.toString(),
    event.params.amount1.toString(),
  ]);
  
  swap.save()
}
