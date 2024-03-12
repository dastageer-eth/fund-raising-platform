const { ethers } = require("hardhat");

async function main() {
  const multiSender = await ethers.deployContract("MultisendToken");
  console.log(`deployed to ${multiSender.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
