export const providers = [
  {
      name: "chain 2",
      chainId: 420,
      type: "web3auth_modal",
      description: "the second chain provider",
      url:"https://opt-goerli.g.alchemy.com/v2/API-KEY",
      ticker: "GoerliETH"
  },
  {
      name: "chain1",
      type: "hardhat",
      chainId: 31337,
      description: "the first chain provider",
      url:"http://127.0.0.1:8545/"
  }
]