const hre = require("hardhat");

async function main() {
    // Get the contract to deploy & deploy.
    const BuyMeADrink = await hre.ethers.getContractFactory("BuyMeADrink");
    const buyMeADrink = await BuyMeADrink.deploy();
    await buyMeADrink.deployed();
    console.log("Buymeadrink is deployed to", buyMeADrink.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
