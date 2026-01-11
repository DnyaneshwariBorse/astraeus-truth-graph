import { QueryTruthScore } from "../generated/TruthVerification/TruthVerification";
import { TruthScore } from "../generated/schema";

export function handleTruthScore(event: QueryTruthScore): void {
  let entity = new TruthScore(event.transaction.hash.toHex());
  entity.eventHash = event.params.eventHash;
  entity.score = event.params.score;
  entity.timestamp = event.block.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}
