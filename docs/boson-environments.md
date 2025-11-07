[![banner](./assets/banner.png)](https://bosonprotocol.io)

< [Boson Protocol Widgets](../README.md)

## Boson Protocol Environment

Boson Protocol is deployed onto 3 public **environments**, to be used in different contexts, for different reasons and probably by different users:
 - ***testing*** is a development environment, very unstable by nature. Unless you're developing on Boson Protocol Components, you shouldn't use this environment.
 - ***staging*** is a validation environment, on testnet blockchain, specifically designed to test and discover the Boson Protocol Components without being on a real blockchain.
 - ***production*** is the production environment. Everything processed on this environment is **FOR REAL**.

In addition, it's possible to deploy your own environment on your local machine. We call it the ***local*** environment.

## Boson Protocol Configurations

Each environment (except ***local***) is currently deployed on several configurations, corresponding to different blockchains.

The dApps (Marketplace and Dispute Resolution Center) and widgets are able to switch between configurations of the same environment.

The following table recaps all configurations, per environment

<table>
<tr><th>Environment</th><th></th></tr>
<tr><td>production</td><td>
<table>
<tr><th>Configuration</th><th>Blockchain</th><th>Subgraph</th></tr>
<tr><td>production-137-0</td><td>Polygon</td><td>https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-polygon/latest/gn</td></tr>
<tr><td>production-1-0</td><td>Ethereum Mainnet</td><td>https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-ethereum/latest/gn</td></tr>
<tr><td>production-8453-0</td><td>Base</td><td>https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-base/latest/gn</td></tr>
<tr><td>production-10-0</td><td>Optimism</td><td>https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-optimism/latest/gn</td></tr>
<tr><td>production-42161-0</td><td>Arbitrum</td><td>https://api.0xgraph.xyz/api/public/b521f6b7-36c4-4117-8ad5-6b21c6eeb195/subgraphs/boson-arbitrum/latest/gn</td></tr>
</table>
<table>
<tr><th>dApps</th><th></th></tr>
<tr><td>Marketplace</td><td>https://bosonapp.io</td></tr>
<tr><td>Dispute Resolution Center</td><td>https://disputes.bosonprotocol.io</td></tr>
</table>
<table>
<tr><th>Widgets</th><th></th></tr>
<tr><td>Redemption</td><td>https://widgets.bosonprotocol.io/#/redeem</td></tr>
<tr><td>Commit</td><td>https://widgets.bosonprotocol.io/#/commit</td></tr>
<tr><td>Finance</td><td>https://widgets.bosonprotocol.io/#/finance</td></tr></table>
</td></tr>
<tr><td>staging</td><td>
<table>
<tr><th>Configuration</th><th>Blockchain</th><th>Subgraph</th></tr>
<tr><td>staging-80002-0</td><td>Polygon Amoy (testnet)</td><td>https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-amoy/latest/gn</td></tr>
<tr><td>staging-11155111-0</td><td>Ethereum Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-sepolia/latest/gn</td></tr>
<tr><td>staging-84532-0</td><td>Base Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-base/latest/gn</td></tr>
<tr><td>staging-11155420-0</td><td>Optimism Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-optimism/latest/gn</td></tr>
<tr><td>staging-421614-0</td><td>Arbitrum Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/da9367fc-3453-4e08-824f-19fb4281b6a1/subgraphs/boson-staging-arbitrum/latest/gn</td></tr>
</table>
<table>
<tr><th>dApps</th><th></th></tr>
<tr><td>Marketplace</td><td>https://interface-staging.on-fleek.app</td></tr>
<tr><td>Dispute Resolution Center</td><td>https://drcenter-staging.on-fleek.app/</td></tr>
</table>
<table>
<tr><th>Widgets</th><th></th></tr>
<tr><td>Redemption</td><td>https://widgets-staging.on-fleek.app/#/redeem</td></tr>
<tr><td>Commit</td><td>https://widgets-staging.on-fleek.app/#/commit</td></tr>
<tr><td>Finance</td><td>https://widgets-staging.on-fleek.app/#/finance</td></tr></table>
</td></tr>
<tr><td>testing</td><td>
<table>
<tr><th>Configuration</th><th>Blockchain</th><th>Subgraph</th></tr>
<tr><td>testing-80002-0</td><td>Polygon Amoy (testnet)</td><td>https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-amoy/latest/gn</td></tr>
<tr><td>testing-11155111-0</td><td>Ethereum Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-sepolia/latest/gn</td></tr>
<tr><td>testing-84532-0</td><td>Base Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-base/latest/gn</td></tr>
<tr><td>testing-11155420-0</td><td>Optimism Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-optimism/latest/gn</td></tr>
<tr><td>testing-421614-0</td><td>Arbitrum Sepolia (testnet)</td><td>https://api.0xgraph.xyz/api/public/c56471f5-5b1d-4a62-b1de-450044cb7ebc/subgraphs/boson-testing-arbitrum/latest/gn</td></tr>
</table>
<table>
<tr><th>dApps</th><th></th></tr>
<tr><td>Marketplace</td><td>https://interface-test.on-fleek.app</td></tr>
<tr><td>Dispute Resolution Center</td><td>https://drcenter-test.on-fleek.app/</td></tr>
</table>
<table>
<tr><th>Widgets</th><th></th></tr>
<tr><td>Redemption</td><td>https://widgets-test.on-fleek.app/#/redeem</td></tr>
<tr><td>Commit</td><td>https://widgets-test.on-fleek.app/#/commit</td></tr>
<tr><td>Finance</td><td>https://widgets-test.on-fleek.app/#/finance</td></tr></table>
</td></tr>
<tr><td>local</td><td>
<table>
<tr><th>Configuration</th><th>Blockchain</th><th>Subgraph</th></tr>
<tr><td>local-31337-0</td><td>local (testnet)</td><td>http://127.0.0.1:8000/subgraphs/name/boson/corecomponents</td></tr>
</table>
<table>
<tr><th>dApps</th><th></th></tr>
<tr><td>Marketplace</td><td>http://localhost:3333</td></tr>
<tr><td>Dispute Resolution Center</td><td>http://localhost:3333</td></tr>
</table>
<table>
<tr><th>Widgets</th><th></th></tr>
<tr><td>Redemption</td><td>http://localhost:3000/#/redeem</td></tr>
<tr><td>Commit</td><td>http://localhost:3000/#/commit</td></tr>
<tr><td>Finance</td><td>http://localhost:3000/#/finance</td></tr></table>
</td></tr>
</table>
