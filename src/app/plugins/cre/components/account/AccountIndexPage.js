import React from 'react'
import Tabs from 'core/components/tabs/Tabs'
import Tab from 'core/components/tabs/Tab'
import AccountListPage from './AccountsListPage'
import PageContainer from 'core/components/pageContainer/PageContainer'

const AccountIndexPage = () => (
  <PageContainer>
    <Tabs>
      <Tab value="accounts" label="Accounts"><AccountListPage /></Tab>
    </Tabs>
  </PageContainer>
)

export default AccountIndexPage
