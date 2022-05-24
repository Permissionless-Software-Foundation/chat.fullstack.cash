/*
  This file is how you add new menu items to your site. It uses the Gatsby
  concept of Component Shadowing:
  https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/

  It over-rides he default file in the gatsby-theme-bch-wallet Theme.
*/

import React from 'react'
import { Sidebar } from 'adminlte-2-react'

// Example/Demo component. This is how you would build a component internal to
// your wallet app/site.
// import DemoComponent from '../../demo-component'

// TX History Plugin.
// This is an example of an external plugin for the wallet. It's a modular
// approach to sharing 'lego blocks' between wallet apps.
// import TXHistory from 'gatsby-plugin-bch-tx-history/src/components/txhistory'
import TXHistory from 'gatsby-plugin-bch-tx-history'

// Default components from gatsby-theme-bch-wallet.
import Wallet from 'gatsby-theme-bch-wallet/src/components/admin-lte/wallet'
import Tokens from 'gatsby-theme-bch-wallet/src/components/admin-lte/tokens'
import Configure from 'gatsby-theme-bch-wallet/src/components/admin-lte/configure'
import SendReceive from 'gatsby-theme-bch-wallet/src/components/admin-lte/send-receive'
import Chat from '../../chat'

const { Item } = Sidebar

const MenuComponents = props => {
  return [
    {
      active: true,
      key: 'Chat',
      component: <Chat key='Chat' {...props} />,
      menuItem: <Item icon='fa-comments' key='Chat' text='Chat' />
    },
    {
      key: 'Tokens',
      component: <Tokens key='Tokens' {...props} />,
      menuItem: <Item icon='fas-coins' key='Tokens' text='Tokens' />
    },
    {
      key: 'Send/Receive BCH',
      component: <SendReceive key='Send/Receive BCH' {...props} />,
      menuItem: (
        <Item
          icon='fa-exchange-alt'
          key='Send/Receive BCH'
          text='Send/Receive BCH'
        />
      )
    },
    {
      key: 'Wallet',
      component: <Wallet key='Wallet' {...props} />,
      menuItem: <Item icon='fa-wallet' key='Wallet' text='Wallet' />
    },
    {
      key: 'Configure',
      component: <Configure key='Configure' {...props} />,
      menuItem: <Item icon='fas-cog' key='Configure' text='Configure' />
    },
    {
      key: 'TX History',
      component: <TXHistory key='TX History' {...props} />,
      menuItem: <Item icon='fas-cog' key='TX History' text='TX History' />
    }
  ]
}

export default MenuComponents
