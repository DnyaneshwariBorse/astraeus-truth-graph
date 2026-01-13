import { QueryTruthScore } from "../generated/TruthVerification/TruthVerification";
import { TruthScore, Verification } from "../generated/schema";

export function handleQueryTruthScore(event: QueryTruthScore): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let verification = new Verification(id);
  
  verification.queryHash = event.params.queryHash;
  verification.score = event.params.score;
  verification.blockNumber = event.block.number;
  verification.save();

  let scoreId = event.params.queryHash.toHex();
  let truthScore = TruthScore.load(scoreId);
  
  if (truthScore == null) {
    truthScore = new TruthScore(scoreId);
    truthScore.user = event.transaction.from;
    truthScore.score = event.params.score;
    truthScore.timestamp = event.block.timestamp;
  } else {
    truthScore.score = event.params.score;
    truthScore.timestamp = event.block.timestamp;
  }
  
  truthScore.save();
}
