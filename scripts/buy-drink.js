// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//Returns the ether balance of address
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Logs the ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++
  }
}

//Logs memos from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
// Get example accounts
const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

// Get the contract to deploy & deploy.
const BuyMeADrink = await hre.ethers.getContractFactory("BuyMeADrink");
const buyMeADrink = await BuyMeADrink.deploy();
await buyMeADrink.deployed();
console.log("Buymeadrink is deployed to", buyMeADrink.address);

// Check balances before purchases
const addresses = [owner.address, tipper.address, buyMeADrink.address];
console.log("=== start ===");
await printBalances(addresses);

// Buy drinks
const tip = {value: hre.ethers.utils.parseEther("1")};
await buyMeADrink.connect(tipper).buydrink("Osman", "Self buy", tip);
await buyMeADrink.connect(tipper2).buydrink("Albert", "You're great student", tip)

// Check balances after purchase
console.log("=== bought something ===");
await printBalances(addresses);

// Withdraw funds
await buyMeADrink.connect(owner).withdrawTips();

// Check balances after withdrawal
console.log("=== withdrawed tips ===");
await printBalances(addresses);

// Read memos
console.log("=== memos ===");
const memos = await buyMeADrink.getMemos();
printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
