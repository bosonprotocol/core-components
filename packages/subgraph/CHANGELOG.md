# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.31.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.30.2...@bosonprotocol/subgraph@1.31.0) (2024-02-05)


### Features

* add BUNDLE metadata to allow Phygitals offers ([#644](https://github.com/bosonprotocol/core-components/issues/644)) ([3a77f41](https://github.com/bosonprotocol/core-components/commit/3a77f4182c7b52394a86c8e62e9c495db2bd8318))





## [1.30.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.30.1...@bosonprotocol/subgraph@1.30.2) (2024-01-24)


### Bug Fixes

* ensure the metadata.animationUrl is added to metadata.product.vi… ([#647](https://github.com/bosonprotocol/core-components/issues/647)) ([4739d77](https://github.com/bosonprotocol/core-components/commit/4739d77d9fba955a2b9bb688ed697ba64c026681))





## [1.30.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.30.0...@bosonprotocol/subgraph@1.30.1) (2023-12-18)


### Bug Fixes

* ensure collection are referenced for offers created before protocol v2.3.0 ([#634](https://github.com/bosonprotocol/core-components/issues/634)) ([34240ca](https://github.com/bosonprotocol/core-components/commit/34240ca8a85b9d904815489893d5e565198a15ab))





# [1.30.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.29.0...@bosonprotocol/subgraph@1.30.0) (2023-12-18)


### Features

* manage collections at seller level ([#630](https://github.com/bosonprotocol/core-components/issues/630)) ([f9b264e](https://github.com/bosonprotocol/core-components/commit/f9b264ed8c7a6adf0714d664028c945b303750d2))





# [1.29.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.28.1...@bosonprotocol/subgraph@1.29.0) (2023-12-05)


### Bug Fixes

* do not create an offer when the seller does not exist ([#614](https://github.com/bosonprotocol/core-components/issues/614)) ([ad49a79](https://github.com/bosonprotocol/core-components/commit/ad49a79c491d428a3cff8fb688eb062a75a24378))


### Features

* add ConditionalCommitAuthorizedEventLog ([#593](https://github.com/bosonprotocol/core-components/issues/593)) ([c799b27](https://github.com/bosonprotocol/core-components/commit/c799b2744a8c0f60401cf8c0d8df0ecf3fe5a231))
* extend check offer condition to check if a buyer can commit to a token gated offer ([#592](https://github.com/bosonprotocol/core-components/issues/592)) ([16b69ec](https://github.com/bosonprotocol/core-components/commit/16b69ecd91370c76cddd2452999cfa8ed751c790))
* set finalised date to exchanges in other states and add e2e test ([#595](https://github.com/bosonprotocol/core-components/issues/595)) ([59dd479](https://github.com/bosonprotocol/core-components/commit/59dd47943a88059e5ded922462f0f35d92f45e1f))





## [1.28.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.28.0...@bosonprotocol/subgraph@1.28.1) (2023-10-03)

**Note:** Version bump only for package @bosonprotocol/subgraph





# [1.28.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.27.0...@bosonprotocol/subgraph@1.28.0) (2023-09-29)


### Bug Fixes

* ensure identification of ProductV1ProductOverrides is correct ([#574](https://github.com/bosonprotocol/core-components/issues/574)) ([30cb56d](https://github.com/bosonprotocol/core-components/commit/30cb56d980c169cb4c01952670f7d1863fec67b0))
* fix product metadata hack ([#575](https://github.com/bosonprotocol/core-components/issues/575)) ([8df4a08](https://github.com/bosonprotocol/core-components/commit/8df4a088136071fc02ab205b8a527b4fff67665e))


### Features

* add productOverrides to queries ([#576](https://github.com/bosonprotocol/core-components/issues/576)) ([7ef7d7b](https://github.com/bosonprotocol/core-components/commit/7ef7d7b679b21cfa95aae1ec9d8f0a18604403c3))





# [1.27.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.26.0...@bosonprotocol/subgraph@1.27.0) (2023-09-27)


### Bug Fixes

* fundsEventLogs shall always contain a fundsEntity reference ([#561](https://github.com/bosonprotocol/core-components/issues/561)) ([fb8f598](https://github.com/bosonprotocol/core-components/commit/fb8f598dd2bdf68bbe6b79e342fd31575fb0924e))


### Features

* add coreSdkConfig prop to cta button ([#550](https://github.com/bosonprotocol/core-components/issues/550)) ([087c7f9](https://github.com/bosonprotocol/core-components/commit/087c7f9cb68b5911bb427ca3ff604abe5be02194))
* add goerli to the config setup and ci ([#555](https://github.com/bosonprotocol/core-components/issues/555)) ([1181d63](https://github.com/bosonprotocol/core-components/commit/1181d63a9022b5c5cd5d6598e806f09a35990dfd))
* multiple configs per env ([#542](https://github.com/bosonprotocol/core-components/issues/542)) ([9221cfd](https://github.com/bosonprotocol/core-components/commit/9221cfd47d766b9079d04bcb271e79578d6e3798))





# [1.26.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.25.0...@bosonprotocol/subgraph@1.26.0) (2023-07-05)


### Features

* add fit and position fields to images in seller metadata ([#517](https://github.com/bosonprotocol/core-components/issues/517)) ([7382fe9](https://github.com/bosonprotocol/core-components/commit/7382fe9c25283e18dc25344037e4a734eafa700a))





# [1.25.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.24.0...@bosonprotocol/subgraph@1.25.0) (2023-06-28)


### Features

* add name to sales channels ([#514](https://github.com/bosonprotocol/core-components/issues/514)) ([30e3c41](https://github.com/bosonprotocol/core-components/commit/30e3c41ce0cf1668655c90699e1a0d5420dfbe09))
* change sales channel id structure ([#515](https://github.com/bosonprotocol/core-components/issues/515)) ([fc5d5d7](https://github.com/bosonprotocol/core-components/commit/fc5d5d7b95d725e89c90abb341e81ae3953b68b2))





# [1.24.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.23.1...@bosonprotocol/subgraph@1.24.0) (2023-06-22)


### Bug Fixes

* convert SalesChannelDeployment.lastUpdated from BigInt to String ([#509](https://github.com/bosonprotocol/core-components/issues/509)) ([1ef97fe](https://github.com/bosonprotocol/core-components/commit/1ef97fed322e90bf05a528f8f5e0bda602cf9068))
* convert SalesChannelDeployment.lastUpdated from number into BigInt ([#508](https://github.com/bosonprotocol/core-components/issues/508)) ([10ee4db](https://github.com/bosonprotocol/core-components/commit/10ee4dbc070ca8b0e10ee44c0a4e79b6c5975643))


### Features

* add saleChannels in seller metadata ([#507](https://github.com/bosonprotocol/core-components/issues/507)) ([4cb6ea9](https://github.com/bosonprotocol/core-components/commit/4cb6ea958cb9c3e1e640c9af3e45d3728b309e5a))





## [1.23.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.23.0...@bosonprotocol/subgraph@1.23.1) (2023-05-17)

**Note:** Version bump only for package @bosonprotocol/subgraph





# [1.23.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.22.1...@bosonprotocol/subgraph@1.23.0) (2023-05-12)


### Bug Fixes

* images metadata ([#447](https://github.com/bosonprotocol/core-components/issues/447)) ([7e43708](https://github.com/bosonprotocol/core-components/commit/7e437080e0ef1a2af6629702be70111a9dfc3915))
* override media type in seller images ([#496](https://github.com/bosonprotocol/core-components/issues/496)) ([b7b54c3](https://github.com/bosonprotocol/core-components/commit/b7b54c3c341671a3daf796303777de128336904f))
* seller metadata images type ([#495](https://github.com/bosonprotocol/core-components/issues/495)) ([1e4fd5e](https://github.com/bosonprotocol/core-components/commit/1e4fd5e4e2b9d4d49057a363e4618e61c2cd33f8))
* subgraph 2.2.0 ([#453](https://github.com/bosonprotocol/core-components/issues/453)) ([b5a2518](https://github.com/bosonprotocol/core-components/commit/b5a2518af35b24019b95f9b5757bf0654d2e0aa5))


### Features

* add minted field in offer.range and update offer.quantityAvailable on reserving a range ([#474](https://github.com/bosonprotocol/core-components/issues/474)) ([4b6f0d1](https://github.com/bosonprotocol/core-components/commit/4b6f0d14dcc1d93c66b2466f04d1a7ff0b10c00a))
* add offer range in subgraph ([#449](https://github.com/bosonprotocol/core-components/issues/449)) ([c39c153](https://github.com/bosonprotocol/core-components/commit/c39c1531ea9873694d1ad709cb8bb1e5ef6524ac))
* add seller metadata ([#479](https://github.com/bosonprotocol/core-components/issues/479)) ([c988d5b](https://github.com/bosonprotocol/core-components/commit/c988d5b336f6813a0848033d27c88d451c0b86c1))
* add width, height, type and name to images in metadata ([#438](https://github.com/bosonprotocol/core-components/issues/438)) ([f95953f](https://github.com/bosonprotocol/core-components/commit/f95953f402f1d9992c3492e825d622b34f4e6bc2))
* make seller.metadata name, description and website optional ([#488](https://github.com/bosonprotocol/core-components/issues/488)) ([5b51c44](https://github.com/bosonprotocol/core-components/commit/5b51c4464f42fd6b5a84ca78104fb2f7f7e9f15c))
* remove seller metadata kind field ([#480](https://github.com/bosonprotocol/core-components/issues/480)) ([175b47e](https://github.com/bosonprotocol/core-components/commit/175b47e72315732b9020ab39ea88c66428d74ec5))
* support Biconomy meta tx with Trusted Forwarder ([#428](https://github.com/bosonprotocol/core-components/issues/428)) ([caa7498](https://github.com/bosonprotocol/core-components/commit/caa74982f146c0973f24b7043496768c5f238d68))
* update set contract uri of the seller ([#462](https://github.com/bosonprotocol/core-components/issues/462)) ([82833ed](https://github.com/bosonprotocol/core-components/commit/82833ed0e7f70182f4552a83f6e9595fb8d2c429))
* upgrade to contracts v2.2.0 ([#450](https://github.com/bosonprotocol/core-components/issues/450)) ([039d41e](https://github.com/bosonprotocol/core-components/commit/039d41e37caa067ca48f9d47bb8bc336ddfbafca))


### Reverts

* Revert "ci: fix deploy subgraph pipeline (#443)" (#444) ([de4d4da](https://github.com/bosonprotocol/core-components/commit/de4d4daa86f5de66da6f6990ff12533ba6c6b144)), closes [#443](https://github.com/bosonprotocol/core-components/issues/443) [#444](https://github.com/bosonprotocol/core-components/issues/444)





## [1.22.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.22.0...@bosonprotocol/subgraph@1.22.1) (2022-11-22)

**Note:** Version bump only for package @bosonprotocol/subgraph





# [1.22.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.21.0...@bosonprotocol/subgraph@1.22.0) (2022-11-17)


### Features

* add sellerId and disputeResolverId to productFilter ([#396](https://github.com/bosonprotocol/core-components/issues/396)) ([268657e](https://github.com/bosonprotocol/core-components/commit/268657ee48bc066fbd1f0a04a3c83400541927c8))
* fetch products with variants directly from subgraph ([#386](https://github.com/bosonprotocol/core-components/issues/386)) ([2bdb77a](https://github.com/bosonprotocol/core-components/commit/2bdb77aa2a5f4bafc2885e7d42f406b1c4f6c9a7))





# [1.21.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.20.0...@bosonprotocol/subgraph@1.21.0) (2022-10-28)


### Features

* create and manage token gated offers ([#363](https://github.com/bosonprotocol/core-components/issues/363)) ([94978e8](https://github.com/bosonprotocol/core-components/commit/94978e81957bbca5c4cd28a5375be1b579a013c8))





# [1.20.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.19.1...@bosonprotocol/subgraph@1.20.0) (2022-10-26)


### Bug Fixes

* ci ([#356](https://github.com/bosonprotocol/core-components/issues/356)) ([34a3f3f](https://github.com/bosonprotocol/core-components/commit/34a3f3f035621bacb4ae6f99577e8065d305a4ef))


### Features

* add optional animationUrl prop to ProductV1Metadata ([#350](https://github.com/bosonprotocol/core-components/issues/350)) ([0ea5983](https://github.com/bosonprotocol/core-components/commit/0ea5983e00f11754bc2c9b757d95562fb6a1776a))





## [1.19.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.19.0...@bosonprotocol/subgraph@1.19.1) (2022-10-19)


### Bug Fixes

* fix issue in subgraph when returnPeriod overflows ([#339](https://github.com/bosonprotocol/core-components/issues/339)) ([05b73bb](https://github.com/bosonprotocol/core-components/commit/05b73bb022cf01f8635cf52e48017668ebaedf8c))





# [1.19.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.18.1...@bosonprotocol/subgraph@1.19.0) (2022-10-18)


### Bug Fixes

* only save funds log for seller ([#325](https://github.com/bosonprotocol/core-components/issues/325)) ([5578bc9](https://github.com/bosonprotocol/core-components/commit/5578bc964c4a43166de73c065b553e2893788b3f))


### Features

* multi variant products ([#317](https://github.com/bosonprotocol/core-components/issues/317)) ([2863a66](https://github.com/bosonprotocol/core-components/commit/2863a66bb687d4da2ce0f6694466c03739a1c682))
* update polygon network name for correct native token indexing ([#327](https://github.com/bosonprotocol/core-components/issues/327)) ([099ea3f](https://github.com/bosonprotocol/core-components/commit/099ea3f8aa311f81cda3a7cfae146208c44e91cb))





## [1.18.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.18.0...@bosonprotocol/subgraph@1.18.1) (2022-10-13)

**Note:** Version bump only for package @bosonprotocol/subgraph





# [1.18.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.17.0...@bosonprotocol/subgraph@1.18.0) (2022-10-13)


### Features

* add licenseUrl field to metadata ([#316](https://github.com/bosonprotocol/core-components/issues/316)) ([fee50b4](https://github.com/bosonprotocol/core-components/commit/fee50b4065f851fad409219715484eb62dcc18bd))





# [1.17.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.16.0...@bosonprotocol/subgraph@1.17.0) (2022-10-12)


### Features

* contract uri and royalty support in subgraph ([#303](https://github.com/bosonprotocol/core-components/issues/303)) ([edc44c1](https://github.com/bosonprotocol/core-components/commit/edc44c1977190635becfb8110d39396545feb5df))
* fix prod subgraph deployment & update readme ([#289](https://github.com/bosonprotocol/core-components/issues/289)) ([b9e58a3](https://github.com/bosonprotocol/core-components/commit/b9e58a367b830582dae332e556781170ea437b23))
* handle VoucherExpired event ([#310](https://github.com/bosonprotocol/core-components/issues/310)) ([9ee7e62](https://github.com/bosonprotocol/core-components/commit/9ee7e6243928432f743b0dc033651cbed5ef52b7))
* update to latest commit of contracts ([#297](https://github.com/bosonprotocol/core-components/issues/297)) ([0efcc9c](https://github.com/bosonprotocol/core-components/commit/0efcc9ca05dd85bffbd48fa927f69667c605f708))





# [1.16.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.15.0...@bosonprotocol/subgraph@1.16.0) (2022-10-05)


### Features

* contractual agreement template ([#278](https://github.com/bosonprotocol/core-components/issues/278)) ([e516cf5](https://github.com/bosonprotocol/core-components/commit/e516cf56eda83aefe6fb115329b31ea68b383b7d))
* set up prod config & ci ([#284](https://github.com/bosonprotocol/core-components/issues/284)) ([830f193](https://github.com/bosonprotocol/core-components/commit/830f1939de1e4c232b5b575d391bff3d3ccfdbe7))





# [1.15.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.14.0...@bosonprotocol/subgraph@1.15.0) (2022-10-03)


### Features

* add `EventLog` entity ([#280](https://github.com/bosonprotocol/core-components/issues/280)) ([73c128e](https://github.com/bosonprotocol/core-components/commit/73c128e61e5928101e081014cb5a79e477355d36))
* add num of commits / redemptions ([#273](https://github.com/bosonprotocol/core-components/issues/273)) ([96345d0](https://github.com/bosonprotocol/core-components/commit/96345d03adfbdf5c27a2216446733f8dc16d8791))
* migrate TESTING env to Mumbai ([#254](https://github.com/bosonprotocol/core-components/issues/254)) ([ebfc5eb](https://github.com/bosonprotocol/core-components/commit/ebfc5eb3bf633ac317068b11dade7be3c78be1b2))
* update readme with testing subgraph details ([#263](https://github.com/bosonprotocol/core-components/issues/263)) ([a03065b](https://github.com/bosonprotocol/core-components/commit/a03065b492b532ee998feefcf6275de10e8484f1))





# [1.14.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.13.2...@bosonprotocol/subgraph@1.14.0) (2022-09-08)

### Features

* **subgraph:** add dispute field to exchange entity ([#236](https://github.com/bosonprotocol/core-components/issues/236)) ([3f6cd3e](https://github.com/bosonprotocol/core-components/commit/3f6cd3e3db8f54afb01d93dd426f526aff2f20df))
* update contracts to pre-release v2.0.0-rc.1 ([#204](https://github.com/bosonprotocol/core-components/issues/204)) ([f74d664](https://github.com/bosonprotocol/core-components/commit/f74d6644ed3687d5eed6b503e3564581485a05b6))

## [1.13.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.13.1...@bosonprotocol/subgraph@1.13.2) (2022-08-31)

### Bug Fixes

* voucher transferred handler ([#224](https://github.com/bosonprotocol/core-components/issues/224)) ([7c6c361](https://github.com/bosonprotocol/core-components/commit/7c6c361505116f4d2c1e6a35069b6a39c7daedd5))

## [1.13.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.13.0...@bosonprotocol/subgraph@1.13.1) (2022-08-31)

### Bug Fixes

* add voucher transferred handler to manifest ([#223](https://github.com/bosonprotocol/core-components/issues/223)) ([9aa796c](https://github.com/bosonprotocol/core-components/commit/9aa796c1a19588cf621e7fb368e409d1ba640211))

# [1.13.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.12.0...@bosonprotocol/subgraph@1.13.0) (2022-08-30)

### Features

* add subgraph handling for voucher transfers ([#222](https://github.com/bosonprotocol/core-components/issues/222)) ([bee6cf7](https://github.com/bosonprotocol/core-components/commit/bee6cf77eabbef9d844d758b35fce5309ce9c7b8))

# [1.12.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.11.0...@bosonprotocol/subgraph@1.12.0) (2022-08-30)

### Bug Fixes

* default the graph storage url ([#219](https://github.com/bosonprotocol/core-components/issues/219)) ([7ecdb97](https://github.com/bosonprotocol/core-components/commit/7ecdb97fb77a4d4cda7eba217cb748a1c832a004))

### Features

* add explicit dispute dates ([#221](https://github.com/bosonprotocol/core-components/issues/221)) ([c239b0e](https://github.com/bosonprotocol/core-components/commit/c239b0e25293e597ef415dc08497be161c6487e7))

# [1.11.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.10.2...@bosonprotocol/subgraph@1.11.0) (2022-08-26)

### Features

* update nativeCoin properties in subgraph & add nativeCoin info in the defaultConfig ([#214](https://github.com/bosonprotocol/core-components/issues/214)) ([a0a7891](https://github.com/bosonprotocol/core-components/commit/a0a78914c7622d0877ed413a6640a80d967ca317))

## [1.10.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.10.1...@bosonprotocol/subgraph@1.10.2) (2022-08-25)

**Note:** Version bump only for package @bosonprotocol/subgraph

## [1.10.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.10.0...@bosonprotocol/subgraph@1.10.1) (2022-08-25)

### Bug Fixes

* change subgraph URL on staging ([#208](https://github.com/bosonprotocol/core-components/issues/208)) ([964890d](https://github.com/bosonprotocol/core-components/commit/964890d63445f8f050f9a142d8aaf5e52a5c6c8c))

# [1.10.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.9.0...@bosonprotocol/subgraph@1.10.0) (2022-08-25)

### Bug Fixes

* **subgraph:** explicitly pass media type ([#189](https://github.com/bosonprotocol/core-components/issues/189)) ([20c4a7f](https://github.com/bosonprotocol/core-components/commit/20c4a7f85631f013bc2dbbf1bf58b4d4aa35feaf))
* **subgraph:** make shipping field optional ([#192](https://github.com/bosonprotocol/core-components/issues/192)) ([1c1af5d](https://github.com/bosonprotocol/core-components/commit/1c1af5d9246a7738fe9054fbd8d4f1b681d643c3))
* upgrade contactLinks definition ([#195](https://github.com/bosonprotocol/core-components/issues/195)) ([e093c5b](https://github.com/bosonprotocol/core-components/commit/e093c5bc5fe12c5f451e7cad7ea56cf1cb14e6d4))

### Features

* contracts update ([#181](https://github.com/bosonprotocol/core-components/issues/181)) ([599a518](https://github.com/bosonprotocol/core-components/commit/599a5188cd350defe22c49626370b198c49bd6f7))
* contracts update ([#188](https://github.com/bosonprotocol/core-components/issues/188)) ([be1dbe4](https://github.com/bosonprotocol/core-components/commit/be1dbe43740b4a2fcd5c7a06147bcdb8f9c7b1b0))
* dispute resolver support in subgraph and core-sdk ([#185](https://github.com/bosonprotocol/core-components/issues/185)) ([0a12bba](https://github.com/bosonprotocol/core-components/commit/0a12bba6c46a1907df8417da6057aecd099283d9))
* subgraph and core-sdk DisputeHandlerFacet ([#186](https://github.com/bosonprotocol/core-components/issues/186)) ([ac58f3d](https://github.com/bosonprotocol/core-components/commit/ac58f3d3beb83d5526b99d410ea2ff6c02db58fa))

# [1.9.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.8.0...@bosonprotocol/subgraph@1.9.0) (2022-07-26)

### Features

* **subgraph:** add handler for new PRODUCT_V1 offer type ([#160](https://github.com/bosonprotocol/core-components/issues/160)) ([c80bebf](https://github.com/bosonprotocol/core-components/commit/c80bebf4b75069b9bd03f1a1ddb7ca81dc0cba5d))

# [1.8.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.7.0...@bosonprotocol/subgraph@1.8.0) (2022-07-12)

### Features

* **subgraph:** add buyer query and fix available quantity field ([#152](https://github.com/bosonprotocol/core-components/issues/152)) ([f7c7b82](https://github.com/bosonprotocol/core-components/commit/f7c7b827152e63d15956da3acf1346532f712267))

# [1.7.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.6.0...@bosonprotocol/subgraph@1.7.0) (2022-07-05)

### Features

* **subgraph:** enrich metadata with `quantityAvailable` field ([#138](https://github.com/bosonprotocol/core-components/issues/138)) ([7c3cbdc](https://github.com/bosonprotocol/core-components/commit/7c3cbdcfffb8110a44d0c085ee7d19da410026e4))

# [1.6.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.5.0...@bosonprotocol/subgraph@1.6.0) (2022-06-27)

### Features

* adapt to new set of contracts ([#131](https://github.com/bosonprotocol/core-components/issues/131)) ([ffe5fc7](https://github.com/bosonprotocol/core-components/commit/ffe5fc7c64f5743b06212fb969f293cd64046459))

# [1.5.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.4.0...@bosonprotocol/subgraph@1.5.0) (2022-06-20)

### Features

* revoke, cancel and redeem ([#120](https://github.com/bosonprotocol/core-components/issues/120)) ([c1612cb](https://github.com/bosonprotocol/core-components/commit/c1612cb7eb27f3a1071b8414d4e6f16d7a03f062))
* rudimentary deposit funds in widgets ([#110](https://github.com/bosonprotocol/core-components/issues/110)) ([2913068](https://github.com/bosonprotocol/core-components/commit/2913068026c0f8875485ed1c07cfbafd691c4e55))
* rudimentary funds handler support ([#108](https://github.com/bosonprotocol/core-components/issues/108)) ([76b7336](https://github.com/bosonprotocol/core-components/commit/76b733615598034b4787eff50b75a5de5b366f53))
* update create offer flow to new contracts ([#107](https://github.com/bosonprotocol/core-components/issues/107)) ([f5934a1](https://github.com/bosonprotocol/core-components/commit/f5934a18968d2a70fe0a3a3ffdf08cb785d1f63e))

# [1.4.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.3.0...@bosonprotocol/subgraph@1.4.0) (2022-06-09)

### Features

* add code coverage and build status badges ([#97](https://github.com/bosonprotocol/core-components/issues/97)) ([7710760](https://github.com/bosonprotocol/core-components/commit/7710760051a7d77c0fd570f78aa5c7604c586317)), closes [#100](https://github.com/bosonprotocol/core-components/issues/100)

# [1.3.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.2.3...@bosonprotocol/subgraph@1.3.0) (2022-05-27)

### Features

* **subgraph:** add sellerId as bigint to seller entity ([#98](https://github.com/bosonprotocol/core-components/issues/98)) ([07025c7](https://github.com/bosonprotocol/core-components/commit/07025c7f55efeded40b82ebb5612b8942673152d))

## [1.2.3](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.2.2...@bosonprotocol/subgraph@1.2.3) (2022-05-13)

### Bug Fixes

* **subgraph:** correctly store sellerId in offer entity ([#87](https://github.com/bosonprotocol/core-components/issues/87)) ([d9829ab](https://github.com/bosonprotocol/core-components/commit/d9829ab2b07539f4433afd17266d56d0edf6bc80))

## [1.2.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.2.1...@bosonprotocol/subgraph@1.2.2) (2022-05-09)

**Note:** Version bump only for package @bosonprotocol/subgraph

## [1.2.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.2.0...@bosonprotocol/subgraph@1.2.1) (2022-05-04)

**Note:** Version bump only for package @bosonprotocol/subgraph

# [1.2.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.1.1...@bosonprotocol/subgraph@1.2.0) (2022-05-02)

### Bug Fixes

* **subgraph:** update voided prop on metadata ([#73](https://github.com/bosonprotocol/core-components/issues/73)) ([cbc509d](https://github.com/bosonprotocol/core-components/commit/cbc509d88e76f2fe5ccbba2fb18a419547853bc8))

### Features

* adapt create-offer to new offer-, account and orchestration handler contracts ([#67](https://github.com/bosonprotocol/core-components/issues/67)) ([86a589d](https://github.com/bosonprotocol/core-components/commit/86a589d69c65f178bf86f062f7ad77f3bfe33cad))
* commit functionality in sdks and subgraphs ([#75](https://github.com/bosonprotocol/core-components/issues/75)) ([519ca47](https://github.com/bosonprotocol/core-components/commit/519ca470318b2f1fceb44c5c6a5739a204d0a266))
* **subgraph:** enrich metadata schemas with fields from offer ([#68](https://github.com/bosonprotocol/core-components/issues/68)) ([10f0815](https://github.com/bosonprotocol/core-components/commit/10f081578598d9cc7a21eea9d8ccadbd8fb29875))

## [1.1.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/subgraph@1.1.0...@bosonprotocol/subgraph@1.1.1) (2022-04-25)

### Bug Fixes

* subgraph staging deploy config ([#55](https://github.com/bosonprotocol/core-components/issues/55)) ([aee4881](https://github.com/bosonprotocol/core-components/commit/aee488129005aff499123fd7fa497d79b554a46e))

# 1.1.0 (2022-04-21)

### Features

* add metadata validation helpers ([#32](https://github.com/bosonprotocol/core-components/issues/32)) ([f2b952c](https://github.com/bosonprotocol/core-components/commit/f2b952cf0461f17e9f38c7221c03d2883428d8ec))
* add minimal subgraph package and setup ([#1](https://github.com/bosonprotocol/core-components/issues/1)) ([3c7c24d](https://github.com/bosonprotocol/core-components/commit/3c7c24d3d9f2b74fed9cdb5f4fadb7e79fa5a655))
* composable sdk structure ([#3](https://github.com/bosonprotocol/core-components/issues/3)) ([dc5c9ac](https://github.com/bosonprotocol/core-components/commit/dc5c9acfbffc319cd1bf3eb37a9012a0dcf21230))
* dynamic widget config + default provider in widgets ([#26](https://github.com/bosonprotocol/core-components/issues/26)) ([467d411](https://github.com/bosonprotocol/core-components/commit/467d411113f53069953673a5707c52baef0582e5))
* **ethers-sdk:** erc20 typechain ([#11](https://github.com/bosonprotocol/core-components/issues/11)) ([cbd8637](https://github.com/bosonprotocol/core-components/commit/cbd8637a4aae74f1f1d98096ca203ad17cc16e5b))
* extendable metadata ([#50](https://github.com/bosonprotocol/core-components/issues/50)) ([1f2da94](https://github.com/bosonprotocol/core-components/commit/1f2da941381104e32e6620d8d97808d2fabedc98))
* monorepo setup tweaks ([#10](https://github.com/bosonprotocol/core-components/issues/10)) ([b8cf248](https://github.com/bosonprotocol/core-components/commit/b8cf2481a684b7d0917c31478cad06354454115d))
* **subgraph:** add handler for offer creation and void ([#2](https://github.com/bosonprotocol/core-components/issues/2)) ([6380b56](https://github.com/bosonprotocol/core-components/commit/6380b5619ed18355c3491d33e3d86109e4805cd6))
* **subgraph:** re-enable ipfs metadata saving ([#9](https://github.com/bosonprotocol/core-components/issues/9)) ([6dd0785](https://github.com/bosonprotocol/core-components/commit/6dd0785a5581135175b9e4ed1dafb31b8266bded))
