import { Claimed } from "../generated/schema";
import { Transfer } from "../generated/Transfer/GalxeOAT";

export function handleTransfer(event: Transfer): void {
  let transfer = Claimed.load(event.transaction.hash.toHex());
  if (transfer === null) {
    transfer = new Claimed(event.transaction.hash.toHex());
  }

  transfer.timestamp = event.block.timestamp;
  transfer.block = event.block.number;
  transfer.from = event.params.from.toHex();
  transfer.to = event.params.to.toHex();

  transfer.save();
}
