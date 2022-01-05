//https://eth-ropsten.alchemyapi.io/v2/LiZTr4y_YuuMcjGq3Sr_rGYH_VEBziI6

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks:{
    ropsten:{
      url: 'https://eth-ropsten.alchemyapi.io/v2/LiZTr4y_YuuMcjGq3Sr_rGYH_VEBziI6',
      accounts: ['b593c4a128b99f71d5f5ce05a3f21ba980a0e319f5b09ec0abd367dc4e8ebe0c']
    }
  }
}


















//The key gotten from alchemy should be pasted here