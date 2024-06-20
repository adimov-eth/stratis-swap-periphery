const web3 = require('web3')
async function main() {
  const factoryAdr = '0x868450D0b1B04bDEE690ed5dE2b2B5571050eFc4' // Use contract adress in previous step.

//   const WSTRAX = await ethers.getContractFactory('WSTRAX')
//   const _WSTRAX = await WSTRAX.deploy()
  wstraxAdr =  '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9' // _WSTRAX.address
//   console.log('WSTRAX deployed at:', wstraxAdr)

  const UniswapInterfaceMulticall = await ethers.getContractFactory('UniswapInterfaceMulticall')
  const _UniswapInterfaceMulticall = await UniswapInterfaceMulticall.deploy()
  console.log('UniswapInterfaceMulticall address:', _UniswapInterfaceMulticall.address)

  const Quoter = await ethers.getContractFactory('Quoter')
  const _Quoter = await Quoter.deploy(factoryAdr, wstraxAdr)
  console.log('Quoter address:', _Quoter.address)

  const nativeCurrencyLabelBytes = web3.utils.asciiToHex("STRAX\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0");
  const NFTDescriptor = await ethers.getContractFactory('NFTDescriptor')
  const _NFTDescriptor = await NFTDescriptor.deploy()
  console.log('NFTDescriptor address:', _NFTDescriptor.address)

  const NonfungibleTokenPositionDescriptor = await ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
    libraries: {
      NFTDescriptor: _NFTDescriptor.address
    }
  })
  const _NonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy(wstraxAdr, nativeCurrencyLabelBytes)
  console.log('NonfungibleTokenPositionDescriptor address:', _NonfungibleTokenPositionDescriptor.address)
  const NonfungibleTokenPositionDescriptorAddr = _NonfungibleTokenPositionDescriptor.address


  const NonfungiblePositionManager = await ethers.getContractFactory('NonfungiblePositionManager')
  const _NonfungiblePositionManager = await NonfungiblePositionManager.deploy(factoryAdr, wstraxAdr, NonfungibleTokenPositionDescriptorAddr)
  console.log('NonfungiblePositionManager address:', _NonfungiblePositionManager.address)
  const NonfungiblePositionManagerAddr = _NonfungiblePositionManager.address

  const SwapRouter = await ethers.getContractFactory('SwapRouter')
  const _SwapRouter = await SwapRouter.deploy(factoryAdr, wstraxAdr)
  console.log('SwapRouter address:', _SwapRouter.address)


  const V3Migrator = await ethers.getContractFactory('V3Migrator')
  const _V3Migrator = await V3Migrator.deploy(factoryAdr, wstraxAdr, NonfungiblePositionManagerAddr)
  console.log('V3Migrator address:', _V3Migrator.address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })