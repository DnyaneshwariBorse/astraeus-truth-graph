const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying TruthVerification...");
  
  // Contract deploy
  const TruthVerification = await ethers.getContractFactory("TruthVerification");
  const truth = await TruthVerification.deploy();
  
  await truth.waitForDeployment();
  const contractAddress = await truth.getAddress();
  
  console.log("✅ TruthVerification deployed to:", contractAddress);
  
  // TEST DATA - 3 transactions
  console.log("📝 Adding test truth scores...");
  
  const testCases = [
    { hash: "0xabc123", score: 85 },
    { hash: "0xdef456", score: 92 },
    { hash: "0xghi789", score: 78 }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const tx = await truth.verifyTruth(testCases[i].hash, testCases[i].score);
    await tx.wait();
    console.log(`✅ Test ${i+1}: ${testCases[i].hash} → ${testCases[i].score}`);
  }
  
  console.log("\n🎉 Check Subgraph in 30 seconds!");
  console.log("curl -X POST -H 'Content-Type: application/json' -d '{\"query\":\"{truthScores(first:3){id score}}\"}' https://api.studio.thegraph.com/query/1722808/astraeus-truth-verification/v0.0.2");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deploy failed:", error);
    process.exit(1);
  });
