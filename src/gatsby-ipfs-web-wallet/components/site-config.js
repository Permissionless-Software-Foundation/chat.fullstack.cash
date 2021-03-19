/*
  This file is intended to be overwritten. It provides a common place to store
  site configuration data.
*/

const config = {
  title: 'P2P Chat',
  titleShort: 'Chat',
  balanceText: 'BCH Balance',
  balanceIcon: 'fab-bitcoin',

  // The BCH address used in a memo.cash account. Used for tracking the IPFS
  // hash of the mirror of this site.
  memoAddr: 'bitcoincash:qqy59nllta74xlxvu47m4z6hqy92p7mg9sjxgnq7c6',

  // Footer Information
  hostText: 'FullStack.cash',
  hostUrl: 'https://fullstack.cash/',
  sourceCode: 'https://github.com/Permissionless-Software-Foundation/chat.fullstack.cash',
  torUrl: 'dgrsg7ghtpyudmfvf52k4kgfqzszfdmu5z6mnbi7crwfmy6daiybsuid.onion',
  clearWebUrl: 'https://chat.fullstack.cash'
}

module.exports = config
