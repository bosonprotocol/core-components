# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.23.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.23.0...@bosonprotocol/core-sdk@1.23.1) (2022-11-22)

**Note:** Version bump only for package @bosonprotocol/core-sdk





# [1.23.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.22.0...@bosonprotocol/core-sdk@1.23.0) (2022-11-17)


### Bug Fixes

* adapt meta-tx signature to ledger hardware wallet ([#374](https://github.com/bosonprotocol/core-components/issues/374)) ([51791bb](https://github.com/bosonprotocol/core-components/commit/51791bbed51640ae1ba559da4750e91661afdfe7))
* fix issue with metadata when signing meta-tx for createOfferWithCondi… ([#371](https://github.com/bosonprotocol/core-components/issues/371)) ([a241285](https://github.com/bosonprotocol/core-components/commit/a241285dd255abd8e37c9c050c275585f488a1bf))
* fix issue with signing the approve meta-tx for the USDC token ([#370](https://github.com/bosonprotocol/core-components/issues/370)) ([5d85c94](https://github.com/bosonprotocol/core-components/commit/5d85c94409ae28941a217440bee4807a32a5a7a3))
* validate address only once ([#393](https://github.com/bosonprotocol/core-components/issues/393)) ([2c1759a](https://github.com/bosonprotocol/core-components/commit/2c1759a72c617756b42a34e3b2a1d67ac2d44a57))


### Features

* activate meta-transactions for revokeVoucher()/completeExchangem()/extendDisputeTimeout() ([#367](https://github.com/bosonprotocol/core-components/issues/367)) ([9a7888e](https://github.com/bosonprotocol/core-components/commit/9a7888ec3d66b072604c7802a0834549f656bf19))
* add checkTokenGatedCondition ([#390](https://github.com/bosonprotocol/core-components/issues/390)) ([f07f6da](https://github.com/bosonprotocol/core-components/commit/f07f6dac20bcdd7a3f072876a6ae8d13f0b3e9de))
* add sellerId and disputeResolverId to productFilter ([#396](https://github.com/bosonprotocol/core-components/issues/396)) ([268657e](https://github.com/bosonprotocol/core-components/commit/268657ee48bc066fbd1f0a04a3c83400541927c8))
* fetch products with variants directly from subgraph ([#386](https://github.com/bosonprotocol/core-components/issues/386)) ([2bdb77a](https://github.com/bosonprotocol/core-components/commit/2bdb77aa2a5f4bafc2885e7d42f406b1c4f6c9a7))
* get token info from subgraph (when available) ([#380](https://github.com/bosonprotocol/core-components/issues/380)) ([61119f6](https://github.com/bosonprotocol/core-components/commit/61119f62c8c5f3f433f81339d8fbe0ebd4dace27))
* script to port images to pinata ([#388](https://github.com/bosonprotocol/core-components/issues/388)) ([c0af4a9](https://github.com/bosonprotocol/core-components/commit/c0af4a9b4d4147e0be46ca98b24e008de49846a1))





# [1.22.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.21.0...@bosonprotocol/core-sdk@1.22.0) (2022-10-28)


### Features

* add missing methods in core-sdk used for creating token-gated offers ([#365](https://github.com/bosonprotocol/core-components/issues/365)) ([413a345](https://github.com/bosonprotocol/core-components/commit/413a345c073cab7b6a467883eb2fcf64c08587ea))
* add the exchanges returned with the variants ([#362](https://github.com/bosonprotocol/core-components/issues/362)) ([62fd86a](https://github.com/bosonprotocol/core-components/commit/62fd86a77a557dd762e271e1741101f90fe11308))
* create and manage token gated offers ([#363](https://github.com/bosonprotocol/core-components/issues/363)) ([94978e8](https://github.com/bosonprotocol/core-components/commit/94978e81957bbca5c4cd28a5375be1b579a013c8))
* support meta transactions ([#348](https://github.com/bosonprotocol/core-components/issues/348)) ([1fa0992](https://github.com/bosonprotocol/core-components/commit/1fa0992b6fc426597565ce517cebef9d82d5875f))





# [1.21.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.20.1...@bosonprotocol/core-sdk@1.21.0) (2022-10-26)


### Bug Fixes

* assertCompletableExchange function ([#353](https://github.com/bosonprotocol/core-components/issues/353)) ([489c833](https://github.com/bosonprotocol/core-components/commit/489c833d1e780cd435333c3f80e22ed093e72cd4))
* set metadataStorage and theGraphStorage for createOffer meta-tx ([#342](https://github.com/bosonprotocol/core-components/issues/342)) ([35de252](https://github.com/bosonprotocol/core-components/commit/35de252d326804f12533e8e308d3fb7b5128a695))


### Features

* add method coreSdk.getProductWithVariants(productUUID) ([#351](https://github.com/bosonprotocol/core-components/issues/351)) ([9b5bc8b](https://github.com/bosonprotocol/core-components/commit/9b5bc8bf30506549cdd6a2afaab8059c67e9f8be))
* add method signMetaTxDepositFunds() ([#343](https://github.com/bosonprotocol/core-components/issues/343)) ([6d822f4](https://github.com/bosonprotocol/core-components/commit/6d822f43485fb41ea7ccee5ea2a0486d6427f263))
* add optional animationUrl prop to ProductV1Metadata ([#350](https://github.com/bosonprotocol/core-components/issues/350)) ([0ea5983](https://github.com/bosonprotocol/core-components/commit/0ea5983e00f11754bc2c9b757d95562fb6a1776a))
* ensure approve is called when needed  before committing to an offer ([#326](https://github.com/bosonprotocol/core-components/issues/326)) ([cb20d73](https://github.com/bosonprotocol/core-components/commit/cb20d73a418a6c07aea325553a4646ed9ac925a9))





## [1.20.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.20.0...@bosonprotocol/core-sdk@1.20.1) (2022-10-19)

**Note:** Version bump only for package @bosonprotocol/core-sdk





# [1.20.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.19.1...@bosonprotocol/core-sdk@1.20.0) (2022-10-18)


### Bug Fixes

* only save funds log for seller ([#325](https://github.com/bosonprotocol/core-components/issues/325)) ([5578bc9](https://github.com/bosonprotocol/core-components/commit/5578bc964c4a43166de73c065b553e2893788b3f))


### Features

* expose `metaTxHandler.getResubmitted` ([#330](https://github.com/bosonprotocol/core-components/issues/330)) ([e5abfa7](https://github.com/bosonprotocol/core-components/commit/e5abfa7d13ede12815c940f85ade3c4361525238))
* multi variant products ([#317](https://github.com/bosonprotocol/core-components/issues/317)) ([2863a66](https://github.com/bosonprotocol/core-components/commit/2863a66bb687d4da2ce0f6694466c03739a1c682))





## [1.19.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.19.0...@bosonprotocol/core-sdk@1.19.1) (2022-10-13)

**Note:** Version bump only for package @bosonprotocol/core-sdk





# [1.19.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.18.0...@bosonprotocol/core-sdk@1.19.0) (2022-10-13)


### Features

* add licenseUrl field to metadata ([#316](https://github.com/bosonprotocol/core-components/issues/316)) ([fee50b4](https://github.com/bosonprotocol/core-components/commit/fee50b4065f851fad409219715484eb62dcc18bd))





# [1.18.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.17.0...@bosonprotocol/core-sdk@1.18.0) (2022-10-12)


### Features

* allow to search for a seller account based on the auth token ([#295](https://github.com/bosonprotocol/core-components/issues/295)) ([31de408](https://github.com/bosonprotocol/core-components/commit/31de40861723b66e543e601606f27f668840efbc))
* contract uri and royalty support in subgraph ([#303](https://github.com/bosonprotocol/core-components/issues/303)) ([edc44c1](https://github.com/bosonprotocol/core-components/commit/edc44c1977190635becfb8110d39396545feb5df))
* fetch tokenIds in parallel ([#305](https://github.com/bosonprotocol/core-components/issues/305)) ([54a1017](https://github.com/bosonprotocol/core-components/commit/54a10170fe733e071518e0d5868b5ae13b5868fe))
* return all seller accounts linked to auth tokens ([#306](https://github.com/bosonprotocol/core-components/issues/306)) ([ad2c61a](https://github.com/bosonprotocol/core-components/commit/ad2c61a1c1276af696787c474050f75c45cda663))
* seller meta tx + batch methods ([#292](https://github.com/bosonprotocol/core-components/issues/292)) ([c7acc0d](https://github.com/bosonprotocol/core-components/commit/c7acc0d75c2b80896dc44250a03c99f7dbdc9aff))
* update to latest commit of contracts ([#297](https://github.com/bosonprotocol/core-components/issues/297)) ([0efcc9c](https://github.com/bosonprotocol/core-components/commit/0efcc9ca05dd85bffbd48fa927f69667c605f708))
* upgrade contracts to v2.0.0-rc.4 (testing & staging) ([#311](https://github.com/bosonprotocol/core-components/issues/311)) ([38319c4](https://github.com/bosonprotocol/core-components/commit/38319c400758a748849762c2c180a1d521f9b104))





# [1.17.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.16.0...@bosonprotocol/core-sdk@1.17.0) (2022-10-05)


### Features

* contractual agreement template ([#278](https://github.com/bosonprotocol/core-components/issues/278)) ([e516cf5](https://github.com/bosonprotocol/core-components/commit/e516cf56eda83aefe6fb115329b31ea68b383b7d))
* fix npm publish config ([#286](https://github.com/bosonprotocol/core-components/issues/286)) ([d57bc91](https://github.com/bosonprotocol/core-components/commit/d57bc91b348f5225d0890cc3256ac464bb8ad122))
* mkae npm packages public ([#287](https://github.com/bosonprotocol/core-components/issues/287)) ([98927c2](https://github.com/bosonprotocol/core-components/commit/98927c233740616b80da66a7de30e911e85ab09c))
* set up prod config & ci ([#284](https://github.com/bosonprotocol/core-components/issues/284)) ([830f193](https://github.com/bosonprotocol/core-components/commit/830f1939de1e4c232b5b575d391bff3d3ccfdbe7))
* update seller wrapper ([#281](https://github.com/bosonprotocol/core-components/issues/281)) ([08521f0](https://github.com/bosonprotocol/core-components/commit/08521f0a6214ae45b1fe7cd8123407e24bd9804f))





# [1.16.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.15.0...@bosonprotocol/core-sdk@1.16.0) (2022-10-03)


### Bug Fixes

* add base buyer and seller fields to base exchange fragment ([#277](https://github.com/bosonprotocol/core-components/issues/277)) ([37f6e8c](https://github.com/bosonprotocol/core-components/commit/37f6e8c484558b2f2f48e63290b93b2ee6eb3557))
* try fixing the isolatedModules issue when building the dApp ([#257](https://github.com/bosonprotocol/core-components/issues/257)) ([295a6d7](https://github.com/bosonprotocol/core-components/commit/295a6d709ef2948072cf9162022a0d94cf25af3a))


### Features

* add `EventLog` entity ([#280](https://github.com/bosonprotocol/core-components/issues/280)) ([73c128e](https://github.com/bosonprotocol/core-components/commit/73c128e61e5928101e081014cb5a79e477355d36))
* add a method to relay meta transactions through native API ([#239](https://github.com/bosonprotocol/core-components/issues/239)) ([51e370e](https://github.com/bosonprotocol/core-components/commit/51e370eaaa2466cf5c8f06116e705f6e01843d12)), closes [#268](https://github.com/bosonprotocol/core-components/issues/268)
* add num of commits / redemptions ([#273](https://github.com/bosonprotocol/core-components/issues/273)) ([96345d0](https://github.com/bosonprotocol/core-components/commit/96345d03adfbdf5c27a2216446733f8dc16d8791))
* add voided field to the subgraph queries ([#276](https://github.com/bosonprotocol/core-components/issues/276)) ([171a9c7](https://github.com/bosonprotocol/core-components/commit/171a9c7092ae245849fb1f0eecff32eadfded2ce))
* migrate TESTING env to Mumbai ([#254](https://github.com/bosonprotocol/core-components/issues/254)) ([ebfc5eb](https://github.com/bosonprotocol/core-components/commit/ebfc5eb3bf633ac317068b11dade7be3c78be1b2))
* nest dispute in base exchange fields ([#274](https://github.com/bosonprotocol/core-components/issues/274)) ([8b811a8](https://github.com/bosonprotocol/core-components/commit/8b811a8022df72d386953becb64f4a9acd8ba221))
* support complete exchange batch ([#264](https://github.com/bosonprotocol/core-components/issues/264)) ([f70eafb](https://github.com/bosonprotocol/core-components/commit/f70eafb47a979a67336776600bf265c9994cfe4e))





# [1.15.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.14.0...@bosonprotocol/core-sdk@1.15.0) (2022-09-13)

### Bug Fixes

* change expired state ([#248](https://github.com/bosonprotocol/core-components/issues/248)) ([6164cf2](https://github.com/bosonprotocol/core-components/commit/6164cf289cb2bb99606baa19159f5fea56d22c83))

### Features

* meta-tx dispute handlers ([#242](https://github.com/bosonprotocol/core-components/issues/242)) ([10dad7e](https://github.com/bosonprotocol/core-components/commit/10dad7e6900d28b70318deec2c417fb1ca8a7a94))

# [1.14.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.13.0...@bosonprotocol/core-sdk@1.14.0) (2022-09-08)

### Features

* **core-sdk:** support `voidOfferBatch` ([#227](https://github.com/bosonprotocol/core-components/issues/227)) ([136f844](https://github.com/bosonprotocol/core-components/commit/136f84489e6c4a8479d587ead233a6d119427171))
* **subgraph:** add dispute field to exchange entity ([#236](https://github.com/bosonprotocol/core-components/issues/236)) ([3f6cd3e](https://github.com/bosonprotocol/core-components/commit/3f6cd3e3db8f54afb01d93dd426f526aff2f20df))
* update contracts to pre-release v2.0.0-rc.1 ([#204](https://github.com/bosonprotocol/core-components/issues/204)) ([f74d664](https://github.com/bosonprotocol/core-components/commit/f74d6644ed3687d5eed6b503e3564581485a05b6))

# [1.13.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.6...@bosonprotocol/core-sdk@1.13.0) (2022-08-30)

### Features

* add explicit dispute dates ([#221](https://github.com/bosonprotocol/core-components/issues/221)) ([c239b0e](https://github.com/bosonprotocol/core-components/commit/c239b0e25293e597ef415dc08497be161c6487e7))

## [1.12.6](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.5...@bosonprotocol/core-sdk@1.12.6) (2022-08-26)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.12.5](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.4...@bosonprotocol/core-sdk@1.12.5) (2022-08-26)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.12.4](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.3...@bosonprotocol/core-sdk@1.12.4) (2022-08-25)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.12.3](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.2...@bosonprotocol/core-sdk@1.12.3) (2022-08-25)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.12.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.1...@bosonprotocol/core-sdk@1.12.2) (2022-08-25)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.12.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.0...@bosonprotocol/core-sdk@1.12.1) (2022-08-25)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.12.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.11.0...@bosonprotocol/core-sdk@1.12.0) (2022-08-25)

### Bug Fixes

* esm builds ([#196](https://github.com/bosonprotocol/core-components/issues/196)) ([32cf63a](https://github.com/bosonprotocol/core-components/commit/32cf63a11008b65d2c2c2156add5b2f1636e1544))
* fill voucherRedeemableUntil OR voucherValid with correct values … ([#203](https://github.com/bosonprotocol/core-components/issues/203)) ([9a2bdd2](https://github.com/bosonprotocol/core-components/commit/9a2bdd26ef8de06f32a6fd99727809656bd29aee))
* fix typo on core sdk ([#182](https://github.com/bosonprotocol/core-components/issues/182)) ([a2b7ee7](https://github.com/bosonprotocol/core-components/commit/a2b7ee7e124716e6d3a50a1faabc8170df9b5cba))
* rollup bundle compatibility ([#202](https://github.com/bosonprotocol/core-components/issues/202)) ([9da246b](https://github.com/bosonprotocol/core-components/commit/9da246b68be635026d493756e0a9b6dece80cf38))
* **subgraph:** make shipping field optional ([#192](https://github.com/bosonprotocol/core-components/issues/192)) ([1c1af5d](https://github.com/bosonprotocol/core-components/commit/1c1af5d9246a7738fe9054fbd8d4f1b681d643c3))

### Features

* bp292 - contractual agreement - implement rendering method ([#191](https://github.com/bosonprotocol/core-components/issues/191)) ([822fe1f](https://github.com/bosonprotocol/core-components/commit/822fe1f4ffba12e07456986e01bf3f474f780cef))
* contracts update ([#181](https://github.com/bosonprotocol/core-components/issues/181)) ([599a518](https://github.com/bosonprotocol/core-components/commit/599a5188cd350defe22c49626370b198c49bd6f7))
* contracts update ([#188](https://github.com/bosonprotocol/core-components/issues/188)) ([be1dbe4](https://github.com/bosonprotocol/core-components/commit/be1dbe43740b4a2fcd5c7a06147bcdb8f9c7b1b0))
* dispute resolver support in subgraph and core-sdk ([#185](https://github.com/bosonprotocol/core-components/issues/185)) ([0a12bba](https://github.com/bosonprotocol/core-components/commit/0a12bba6c46a1907df8417da6057aecd099283d9))
* sign dispute resolution proposal ([#207](https://github.com/bosonprotocol/core-components/issues/207)) ([707a7b2](https://github.com/bosonprotocol/core-components/commit/707a7b25a28efef2401d332bb6d2ee80f825fb15))
* subgraph and core-sdk DisputeHandlerFacet ([#186](https://github.com/bosonprotocol/core-components/issues/186)) ([ac58f3d](https://github.com/bosonprotocol/core-components/commit/ac58f3d3beb83d5526b99d410ea2ff6c02db58fa))

# [1.11.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.10.0...@bosonprotocol/core-sdk@1.11.0) (2022-07-26)

### Features

* **core-sdk:** add subgraph wrappers for metadata entities ([#166](https://github.com/bosonprotocol/core-components/issues/166)) ([9a720aa](https://github.com/bosonprotocol/core-components/commit/9a720aac5016ba1a422d48f8d3185d44bf2a3edd))
* **core-sdk:** expose buyer query methods ([#178](https://github.com/bosonprotocol/core-components/issues/178)) ([6fca300](https://github.com/bosonprotocol/core-components/commit/6fca3004b8cfe4b72471499a159d356628af3ec2))
* **core-sdk:** update auto-generated subgraph sdk ([#164](https://github.com/bosonprotocol/core-components/issues/164)) ([309ee88](https://github.com/bosonprotocol/core-components/commit/309ee8865999b8cff70a77e2b88896f536edd1ec))

# [1.10.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.9.0...@bosonprotocol/core-sdk@1.10.0) (2022-07-12)

### Bug Fixes

* withdraw funds with an available amount ([#144](https://github.com/bosonprotocol/core-components/issues/144)) ([0ad3ed0](https://github.com/bosonprotocol/core-components/commit/0ad3ed0617e362656b07103a8822285d14a1d095))

### Features

* **subgraph:** add buyer query and fix available quantity field ([#152](https://github.com/bosonprotocol/core-components/issues/152)) ([f7c7b82](https://github.com/bosonprotocol/core-components/commit/f7c7b827152e63d15956da3acf1346532f712267))

# [1.9.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.8.0...@bosonprotocol/core-sdk@1.9.0) (2022-07-05)

### Features

* **core-sdk:** expose `completeExchange` ([#132](https://github.com/bosonprotocol/core-components/issues/132)) ([129c84c](https://github.com/bosonprotocol/core-components/commit/129c84cc32060ab1761854148ec76aa9fe695f66))
* **core-sdk:** meta tx handler ([#135](https://github.com/bosonprotocol/core-components/issues/135)) ([ddaa489](https://github.com/bosonprotocol/core-components/commit/ddaa4890f043a7ca1b25daaec078fb16c4254db3))
* withdraw all funds ([#129](https://github.com/bosonprotocol/core-components/issues/129)) ([6ef814b](https://github.com/bosonprotocol/core-components/commit/6ef814bd6edf64556e5e1114a7a3953460c75eb4))

# [1.8.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.7.0...@bosonprotocol/core-sdk@1.8.0) (2022-06-27)

### Features

* adapt to new set of contracts ([#131](https://github.com/bosonprotocol/core-components/issues/131)) ([ffe5fc7](https://github.com/bosonprotocol/core-components/commit/ffe5fc7c64f5743b06212fb969f293cd64046459))

# [1.7.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.6.0...@bosonprotocol/core-sdk@1.7.0) (2022-06-22)

### Features

* rudimentary withdraw funds logic ([#127](https://github.com/bosonprotocol/core-components/issues/127)) ([47d6a0f](https://github.com/bosonprotocol/core-components/commit/47d6a0fc0f281b8fcf96532cfdbec75d0dcac69f))

# [1.6.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.5.0...@bosonprotocol/core-sdk@1.6.0) (2022-06-20)

### Bug Fixes

* **core-sdk:** gql import from graphql-request ([#113](https://github.com/bosonprotocol/core-components/issues/113)) ([4ac3624](https://github.com/bosonprotocol/core-components/commit/4ac362470729b67c82f395ac55cd95eef37ec65d))

### Features

* **core-sdk:** expose typed subgraph query helpers ([#118](https://github.com/bosonprotocol/core-components/issues/118)) ([f2e2945](https://github.com/bosonprotocol/core-components/commit/f2e294589c27d51528b98090a89f3d532f862723))
* revoke, cancel and redeem ([#120](https://github.com/bosonprotocol/core-components/issues/120)) ([c1612cb](https://github.com/bosonprotocol/core-components/commit/c1612cb7eb27f3a1071b8414d4e6f16d7a03f062))
* rudimentary deposit funds in widgets ([#110](https://github.com/bosonprotocol/core-components/issues/110)) ([2913068](https://github.com/bosonprotocol/core-components/commit/2913068026c0f8875485ed1c07cfbafd691c4e55))
* rudimentary funds handler support ([#108](https://github.com/bosonprotocol/core-components/issues/108)) ([76b7336](https://github.com/bosonprotocol/core-components/commit/76b733615598034b4787eff50b75a5de5b366f53))
* update create offer flow to new contracts ([#107](https://github.com/bosonprotocol/core-components/issues/107)) ([f5934a1](https://github.com/bosonprotocol/core-components/commit/f5934a18968d2a70fe0a3a3ffdf08cb785d1f63e))

# [1.5.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.4.1...@bosonprotocol/core-sdk@1.5.0) (2022-06-09)

### Features

* add Exchange view in the widget ([#103](https://github.com/bosonprotocol/core-components/issues/103)) ([b9098d4](https://github.com/bosonprotocol/core-components/commit/b9098d40e1a8955f960c1cfa3014b2ebad226650))

## [1.4.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.4.0...@bosonprotocol/core-sdk@1.4.1) (2022-05-27)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.4.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.3.0...@bosonprotocol/core-sdk@1.4.0) (2022-05-10)

### Features

* separate metadata package ([#86](https://github.com/bosonprotocol/core-components/issues/86)) ([2bf5069](https://github.com/bosonprotocol/core-components/commit/2bf5069256592e8ed5e80a3e557e1402ba437fc9))

# [1.3.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.2.1...@bosonprotocol/core-sdk@1.3.0) (2022-05-09)

### Features

* **core-sdk:** expose get seller by clerk ([#83](https://github.com/bosonprotocol/core-components/issues/83)) ([df7a4b1](https://github.com/bosonprotocol/core-components/commit/df7a4b1b842b77d4e08767fe6d888fdebd8a7efa))
* **core-sdk:** get seller by address method ([#82](https://github.com/bosonprotocol/core-components/issues/82)) ([de7f9d9](https://github.com/bosonprotocol/core-components/commit/de7f9d95c5fe536f277b01af210a7f66df420c67))

## [1.2.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.2.0...@bosonprotocol/core-sdk@1.2.1) (2022-05-04)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.2.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.1.1...@bosonprotocol/core-sdk@1.2.0) (2022-05-02)

### Features

* adapt create-offer to new offer-, account and orchestration handler contracts ([#67](https://github.com/bosonprotocol/core-components/issues/67)) ([86a589d](https://github.com/bosonprotocol/core-components/commit/86a589d69c65f178bf86f062f7ad77f3bfe33cad))
* commit functionality in sdks and subgraphs ([#75](https://github.com/bosonprotocol/core-components/issues/75)) ([519ca47](https://github.com/bosonprotocol/core-components/commit/519ca470318b2f1fceb44c5c6a5739a204d0a266))

## [1.1.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.1.0...@bosonprotocol/core-sdk@1.1.1) (2022-04-25)

### Bug Fixes

* include ts files to fix sourcemap warnings ([#61](https://github.com/bosonprotocol/core-components/issues/61)) ([e815e31](https://github.com/bosonprotocol/core-components/commit/e815e31f13c667522b1f3c18460a4f1a7de37b53))

# 1.1.0 (2022-04-21)

### Features

* add metadata validation helpers ([#32](https://github.com/bosonprotocol/core-components/issues/32)) ([f2b952c](https://github.com/bosonprotocol/core-components/commit/f2b952cf0461f17e9f38c7221c03d2883428d8ec))
* add rudimentary ipfs metadata storage ([#7](https://github.com/bosonprotocol/core-components/issues/7)) ([1cded98](https://github.com/bosonprotocol/core-components/commit/1cded9833deaf6ebdc93a07ab6840de263c70158))
* composable sdk structure ([#3](https://github.com/bosonprotocol/core-components/issues/3)) ([dc5c9ac](https://github.com/bosonprotocol/core-components/commit/dc5c9acfbffc319cd1bf3eb37a9012a0dcf21230))
* **core-sdk:** add method to get all offers of a seller ([#25](https://github.com/bosonprotocol/core-components/issues/25)) ([a19f0c8](https://github.com/bosonprotocol/core-components/commit/a19f0c8b4fc08672205775ed2c89ae1e99f9d72f))
* **core-sdk:** add rudimentary offers module ([#6](https://github.com/bosonprotocol/core-components/issues/6)) ([954b3f9](https://github.com/bosonprotocol/core-components/commit/954b3f9858f8f0f306a2bfe2f22205df4a7d45f4))
* **core-sdk:** add voidOffer method ([#19](https://github.com/bosonprotocol/core-components/issues/19)) ([da0b07f](https://github.com/bosonprotocol/core-components/commit/da0b07f08161640efd8da63d3c9ba14fcd86fd9a))
* **core-sdk:** approve exchange token ([#18](https://github.com/bosonprotocol/core-components/issues/18)) ([002b44c](https://github.com/bosonprotocol/core-components/commit/002b44c4f46b0ef9ae36647a4fad78e07a98dfee))
* **core-sdk:** get offer by id from subgraph ([#14](https://github.com/bosonprotocol/core-components/issues/14)) ([af78edf](https://github.com/bosonprotocol/core-components/commit/af78edfcea84f46bbc87493f145deabe04f0e726))
* dynamic widget config + default provider in widgets ([#26](https://github.com/bosonprotocol/core-components/issues/26)) ([467d411](https://github.com/bosonprotocol/core-components/commit/467d411113f53069953673a5707c52baef0582e5))
* extendable metadata ([#50](https://github.com/bosonprotocol/core-components/issues/50)) ([1f2da94](https://github.com/bosonprotocol/core-components/commit/1f2da941381104e32e6620d8d97808d2fabedc98))
* get created offer id from logs and display in widget ([#17](https://github.com/bosonprotocol/core-components/issues/17)) ([a7c0c36](https://github.com/bosonprotocol/core-components/commit/a7c0c36aae98b08a2a97eac5d9dd1f9c452bbcb3))
* integrate widgets core-sdk widgets-sdk ([#15](https://github.com/bosonprotocol/core-components/issues/15)) ([176b65d](https://github.com/bosonprotocol/core-components/commit/176b65d1a8a723567cadde2403ff45547a19cc0d))
* monorepo setup tweaks ([#10](https://github.com/bosonprotocol/core-components/issues/10)) ([b8cf248](https://github.com/bosonprotocol/core-components/commit/b8cf2481a684b7d0917c31478cad06354454115d))
