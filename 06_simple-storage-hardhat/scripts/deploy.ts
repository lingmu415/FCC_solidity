import { ethers, run, network } from "hardhat";

async function main(){
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to: ${simpleStorage.address}`);

  //verify the contract on etherscan
  // console.log(network.config);
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY){
    console.log("Wating for block confirmations...");
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  // get favNum
  const currentValue = await simpleStorage.retrieve()
  console.log(`Current Value is: ${currentValue}`);

  // store favNum
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Value is: ${updatedValue}`);
};

// async function verify(contractAddress, args){
  const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");
  try{
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  }catch (e: any) {
    if(e.message.toLowerCase().includes("already verified")){
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(()=> process.exit(0))
  .catch((error)=> {
    console.error(error);
    process.exit(1);
  });