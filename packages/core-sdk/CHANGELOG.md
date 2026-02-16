# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.46.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.45.0...@bosonprotocol/core-sdk@1.46.0) (2026-02-16)

### Features

- adapt check exchange policy for bundle offers ([#999](https://github.com/bosonprotocol/core-components/issues/999)) ([6799fb5](https://github.com/bosonprotocol/core-components/commit/6799fb5903f1a547178b825969300c1e42e713d6)), closes [#1000](https://github.com/bosonprotocol/core-components/issues/1000)
- add PreMintButton and ReserveRangeButton ([#983](https://github.com/bosonprotocol/core-components/issues/983)) ([7188cf3](https://github.com/bosonprotocol/core-components/commit/7188cf3310fd36dac589605380dc9e99902ad940))

# [1.45.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.44.0...@bosonprotocol/core-sdk@1.45.0) (2025-10-29)

### Bug Fixes

- seller shall not be mandatory in the offer metadata structure ([#979](https://github.com/bosonprotocol/core-components/issues/979)) ([a3e6f40](https://github.com/bosonprotocol/core-components/commit/a3e6f40a0cad84ed542b9ef381b457b17038d21e))

### Features

- add create offer and commit ([#973](https://github.com/bosonprotocol/core-components/issues/973)) ([4d88ead](https://github.com/bosonprotocol/core-components/commit/4d88ead86160fb1cb0c733ee1a8fe389171608fc))
- change royaltyInfo struct expected to create offer ([#980](https://github.com/bosonprotocol/core-components/issues/980)) ([97a8d20](https://github.com/bosonprotocol/core-components/commit/97a8d203e280fcdb009090d5a21acaab89312e74))
- manage buyer-initiated offers ([#968](https://github.com/bosonprotocol/core-components/issues/968)) ([3e8d680](https://github.com/bosonprotocol/core-components/commit/3e8d68047ef8ce411b7e570fff26a09a1785b4be))

# [1.44.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.43.3...@bosonprotocol/core-sdk@1.44.0) (2025-09-17)

### Features

- accept returnTypedDataToSign for prepareDataSignatureParameters ([#958](https://github.com/bosonprotocol/core-components/issues/958)) ([1bb5f4f](https://github.com/bosonprotocol/core-components/commit/1bb5f4f5c5cf6b95246f8d6656efdf6a4b60292e))
- add getCurrentTimeMs in web3libadapter for assertCompletableExc… ([#961](https://github.com/bosonprotocol/core-components/issues/961)) ([5fac132](https://github.com/bosonprotocol/core-components/commit/5fac132f6913df35a7ec6ebbf358145e61674e78))
- add txRequest override to createOffer ([#946](https://github.com/bosonprotocol/core-components/issues/946)) ([19bc0a9](https://github.com/bosonprotocol/core-components/commit/19bc0a95f8cfd51a52e992e3e6469132fcc93188))
- allow createOfferWithCondition to return tx data ([#960](https://github.com/bosonprotocol/core-components/issues/960)) ([95a7a81](https://github.com/bosonprotocol/core-components/commit/95a7a817b9cc9fdc36a8ee87079d97b53576faf4))
- check if dispute resolver supports fee on create offer ([#959](https://github.com/bosonprotocol/core-components/issues/959)) ([500fc50](https://github.com/bosonprotocol/core-components/commit/500fc50818494432da05d004b8b63bba082b4e64))
- create agent adapter ([#947](https://github.com/bosonprotocol/core-components/issues/947)) ([75d6432](https://github.com/bosonprotocol/core-components/commit/75d64325fb654a4e2112bddf611231b1387b90bc)), closes [#948](https://github.com/bosonprotocol/core-components/issues/948)
- improve types protocolConfig ([#951](https://github.com/bosonprotocol/core-components/issues/951)) ([088bf9c](https://github.com/bosonprotocol/core-components/commit/088bf9ca43e21827a6a791837e096a12bbdd9f9c))
- retrieve seller id from seller update in getPendingSellerUpdateFromLogs ([#962](https://github.com/bosonprotocol/core-components/issues/962)) ([a80c69e](https://github.com/bosonprotocol/core-components/commit/a80c69e918ca12d2b9c6e380565411aed145f54e))

## [1.43.3](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.43.2...@bosonprotocol/core-sdk@1.43.3) (2025-04-08)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.43.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.43.1...@bosonprotocol/core-sdk@1.43.2) (2025-03-31)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.43.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.43.0...@bosonprotocol/core-sdk@1.43.1) (2025-03-19)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.43.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.42.2...@bosonprotocol/core-sdk@1.43.0) (2025-02-07)

### Features

- add cancelOrder method on Opensea ([#908](https://github.com/bosonprotocol/core-components/issues/908)) ([69472f5](https://github.com/bosonprotocol/core-components/commit/69472f5116ac9b74b739009b784844391da66ddf))

## [1.42.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.42.1...@bosonprotocol/core-sdk@1.42.2) (2025-01-29)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.42.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.42.0...@bosonprotocol/core-sdk@1.42.1) (2025-01-28)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.42.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.41.0...@bosonprotocol/core-sdk@1.42.0) (2025-01-28)

### Features

- allow to switch on direct transaction when the relayer service is down ([#865](https://github.com/bosonprotocol/core-components/issues/865)) ([82ded73](https://github.com/bosonprotocol/core-components/commit/82ded73ab3f28edf7a86938c4805ce4d922e23bb))

# [1.41.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.40.5...@bosonprotocol/core-sdk@1.41.0) (2024-11-20)

### Bug Fixes

- hack waiting for Opensea API bug to be fixed ([#818](https://github.com/bosonprotocol/core-components/issues/818)) ([26c0727](https://github.com/bosonprotocol/core-components/commit/26c0727cb0d38e473f9216f2d4fb391cd317e773))

### Features

- add listingTime and narrow down marketplace returned ([#829](https://github.com/bosonprotocol/core-components/issues/829)) ([8659149](https://github.com/bosonprotocol/core-components/commit/8659149ff7bcce6e53258e0e7212a9b6cb7627bb))
- add protocolFee events in subgraph ([#782](https://github.com/bosonprotocol/core-components/issues/782)) ([74dde63](https://github.com/bosonprotocol/core-components/commit/74dde63fa5e252a496896ce0b12dd832b7491cc7))
- improve opensea wrapper ([#790](https://github.com/bosonprotocol/core-components/issues/790)) ([eee07b2](https://github.com/bosonprotocol/core-components/commit/eee07b2cc57f1792d3d361ac2fb8b4b1f293f08e))

## [1.40.5](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.40.4...@bosonprotocol/core-sdk@1.40.5) (2024-07-29)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.40.4](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.40.3...@bosonprotocol/core-sdk@1.40.4) (2024-06-11)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.40.3](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.40.2...@bosonprotocol/core-sdk@1.40.3) (2024-05-21)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.40.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.40.1...@bosonprotocol/core-sdk@1.40.2) (2024-05-13)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.40.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.40.0...@bosonprotocol/core-sdk@1.40.1) (2024-04-15)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.40.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.39.1...@bosonprotocol/core-sdk@1.40.0) (2024-04-05)

### Bug Fixes

- finance widget is not loading ([#705](https://github.com/bosonprotocol/core-components/issues/705)) ([98681d2](https://github.com/bosonprotocol/core-components/commit/98681d253d7643f90d8d84b5a4d7b29cb47f705d))
- race condition in useSignerAddress and add uuid to web3lib adapters ([#685](https://github.com/bosonprotocol/core-components/issues/685)) ([f8e37e9](https://github.com/bosonprotocol/core-components/commit/f8e37e9dda6730c720817e093ae1a5d906b4f472))
- render Contractual Agreement fails on Sepolia network ([#704](https://github.com/bosonprotocol/core-components/issues/704)) ([a93ab3c](https://github.com/bosonprotocol/core-components/commit/a93ab3cf3386ddc341da9102d29eddcd3bdc5788))

### Features

- upgrade protocol 2.4.0 + royalties management ([#674](https://github.com/bosonprotocol/core-components/issues/674)) ([00fe7b5](https://github.com/bosonprotocol/core-components/commit/00fe7b58c309bf5280a0451ec69d74fd59293767))

## [1.39.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.39.0...@bosonprotocol/core-sdk@1.39.1) (2024-03-13)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.39.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.38.0...@bosonprotocol/core-sdk@1.39.0) (2024-03-13)

### Features

- add phygitals ([#673](https://github.com/bosonprotocol/core-components/issues/673)) ([e233f8c](https://github.com/bosonprotocol/core-components/commit/e233f8c44c8a234d6556a361905a2c59c4b9958e))

# [1.38.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.37.0...@bosonprotocol/core-sdk@1.38.0) (2024-03-08)

### Features

- add terms to nftitem metadata ([#675](https://github.com/bosonprotocol/core-components/issues/675)) ([575f0eb](https://github.com/bosonprotocol/core-components/commit/575f0eb6e3ee3b46e56f1ef43b611e4e60418369))

# [1.37.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.36.1...@bosonprotocol/core-sdk@1.37.0) (2024-02-23)

### Bug Fixes

- check token gated condition function for large ranges or high token ids ([#665](https://github.com/bosonprotocol/core-components/issues/665)) ([979654e](https://github.com/bosonprotocol/core-components/commit/979654e08dbdbe4bb82efb9bff302afe643e5702))
- testing issues ([#666](https://github.com/bosonprotocol/core-components/issues/666)) ([453de61](https://github.com/bosonprotocol/core-components/commit/453de61c9e5299a1c8381b4b568d06ba29de3d7d))
- validation error and access to property in wait biconomy ([#669](https://github.com/bosonprotocol/core-components/issues/669)) ([a97e98a](https://github.com/bosonprotocol/core-components/commit/a97e98adbc2ab608e54ccb0add39672239d8db81))

### Features

- export Media type ([#662](https://github.com/bosonprotocol/core-components/issues/662)) ([f1244ad](https://github.com/bosonprotocol/core-components/commit/f1244ad09692e74692022e7d7dae1fc31d1e90a8))
- request typename in offer metadata ([#672](https://github.com/bosonprotocol/core-components/issues/672)) ([afd95ef](https://github.com/bosonprotocol/core-components/commit/afd95ef27e6fbcc7c32c8085c45d59d32672332d))

## [1.36.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.36.0...@bosonprotocol/core-sdk@1.36.1) (2024-02-06)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.36.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.35.0...@bosonprotocol/core-sdk@1.36.0) (2024-02-05)

### Bug Fixes

- some commit widget issues ([#654](https://github.com/bosonprotocol/core-components/issues/654)) ([d1452c4](https://github.com/bosonprotocol/core-components/commit/d1452c497dfd2700062d85ccb664e5bd4d9ea2c2))

### Features

- add BUNDLE metadata to allow Phygitals offers ([#644](https://github.com/bosonprotocol/core-components/issues/644)) ([3a77f41](https://github.com/bosonprotocol/core-components/commit/3a77f4182c7b52394a86c8e62e9c495db2bd8318))

# [1.35.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.34.0...@bosonprotocol/core-sdk@1.35.0) (2024-01-24)

### Bug Fixes

- avoid crashing when lens profile can't be fetched ([#637](https://github.com/bosonprotocol/core-components/issues/637)) ([dc9e501](https://github.com/bosonprotocol/core-components/commit/dc9e501da098f5b0e11adafa6466e0c450ea5310))
- change getSellerByAddress in case the seller owns a LENS token ([#642](https://github.com/bosonprotocol/core-components/issues/642)) ([a19f68e](https://github.com/bosonprotocol/core-components/commit/a19f68e713415da25e253ed4443f595f6ea30081))
- vulnerability issue ([#635](https://github.com/bosonprotocol/core-components/issues/635)) ([ac0940e](https://github.com/bosonprotocol/core-components/commit/ac0940eb8c2bb1682e7761b8d9a85730bf4d7f57))

### Features

- commit widget ([#612](https://github.com/bosonprotocol/core-components/issues/612)) ([5c80a06](https://github.com/bosonprotocol/core-components/commit/5c80a06b00b377f24acacfaef0f648cde09b4d74))

# [1.34.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.33.0...@bosonprotocol/core-sdk@1.34.0) (2023-12-18)

### Features

- manage collections at seller level ([#630](https://github.com/bosonprotocol/core-components/issues/630)) ([f9b264e](https://github.com/bosonprotocol/core-components/commit/f9b264ed8c7a6adf0714d664028c945b303750d2))

# [1.33.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.32.0...@bosonprotocol/core-sdk@1.33.0) (2023-12-05)

### Bug Fixes

- checkTokenGatedCondition and typescript compilation warning ([#608](https://github.com/bosonprotocol/core-components/issues/608)) ([e466832](https://github.com/bosonprotocol/core-components/commit/e46683256877ef831e0897cf5e00d3249534a2dc))

### Features

- add ConditionalCommitAuthorizedEventLog ([#593](https://github.com/bosonprotocol/core-components/issues/593)) ([c799b27](https://github.com/bosonprotocol/core-components/commit/c799b2744a8c0f60401cf8c0d8df0ecf3fe5a231))
- add erc165SupportsInterface function to coreSDK ([#596](https://github.com/bosonprotocol/core-components/issues/596)) ([6a5b777](https://github.com/bosonprotocol/core-components/commit/6a5b777ef7ed6920daf3e0242cb073093893ade5))
- extend check offer condition to check if a buyer can commit to a token gated offer ([#592](https://github.com/bosonprotocol/core-components/issues/592)) ([16b69ec](https://github.com/bosonprotocol/core-components/commit/16b69ecd91370c76cddd2452999cfa8ed751c790))
- integrate finance widget ([#609](https://github.com/bosonprotocol/core-components/issues/609)) ([79983d1](https://github.com/bosonprotocol/core-components/commit/79983d15468e86f71bd6e15b5154a7b21fe24798))
- update contract offers no expiration ([#616](https://github.com/bosonprotocol/core-components/issues/616)) ([3954ade](https://github.com/bosonprotocol/core-components/commit/3954adea5a13242d8837cf71dab81f7be0498362))

# [1.32.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.31.0...@bosonprotocol/core-sdk@1.32.0) (2023-10-03)

### Features

- export metadata length limit used in validations ([#579](https://github.com/bosonprotocol/core-components/issues/579)) ([05e1948](https://github.com/bosonprotocol/core-components/commit/05e1948e43312fc9b18e5c3b3641ce790f8d8376))

# [1.31.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.30.0...@bosonprotocol/core-sdk@1.31.0) (2023-09-29)

### Bug Fixes

- ensure pin-to-pinata is working on production ([#577](https://github.com/bosonprotocol/core-components/issues/577)) ([713873b](https://github.com/bosonprotocol/core-components/commit/713873bbcc0c74e0e6adf64f9c55f9cccdff72cb))
- fix product metadata hack ([#575](https://github.com/bosonprotocol/core-components/issues/575)) ([8df4a08](https://github.com/bosonprotocol/core-components/commit/8df4a088136071fc02ab205b8a527b4fff67665e))

### Features

- add productOverrides to queries ([#576](https://github.com/bosonprotocol/core-components/issues/576)) ([7ef7d7b](https://github.com/bosonprotocol/core-components/commit/7ef7d7b679b21cfa95aae1ec9d8f0a18604403c3))

# [1.30.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.29.0...@bosonprotocol/core-sdk@1.30.0) (2023-09-27)

### Features

- get fewer offer fields pinata ([#552](https://github.com/bosonprotocol/core-components/issues/552)) ([5f12906](https://github.com/bosonprotocol/core-components/commit/5f12906609ae97191e66866a8ececce1e82d738a))
- multiple configs per env ([#542](https://github.com/bosonprotocol/core-components/issues/542)) ([9221cfd](https://github.com/bosonprotocol/core-components/commit/9221cfd47d766b9079d04bcb271e79578d6e3798))

# [1.29.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.28.0...@bosonprotocol/core-sdk@1.29.0) (2023-08-10)

### Bug Fixes

- ensure connection with wallet connect (upgrade wagmi / rainbowkit) ([#524](https://github.com/bosonprotocol/core-components/issues/524)) ([4b372ea](https://github.com/bosonprotocol/core-components/commit/4b372ea1e9a448764d9eda50e38c2093219e5ccd))

### Features

- allow checking an offer is compliant with the fair exchange policy ([#520](https://github.com/bosonprotocol/core-components/issues/520)) ([1ad4d0f](https://github.com/bosonprotocol/core-components/commit/1ad4d0f0997032a372cd481e1538590f84ab8ca6))
- redemption widget ([#460](https://github.com/bosonprotocol/core-components/issues/460)) ([953d9c3](https://github.com/bosonprotocol/core-components/commit/953d9c3ad2caafc0a8028637ad25afbebab7c9e2))

# [1.28.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.27.0...@bosonprotocol/core-sdk@1.28.0) (2023-07-05)

### Features

- add fit and position fields to images in seller metadata ([#517](https://github.com/bosonprotocol/core-components/issues/517)) ([7382fe9](https://github.com/bosonprotocol/core-components/commit/7382fe9c25283e18dc25344037e4a734eafa700a))
- add fit and position in seller metadata images ([#518](https://github.com/bosonprotocol/core-components/issues/518)) ([5ffbca4](https://github.com/bosonprotocol/core-components/commit/5ffbca4dc61afc1db9102ad32cc17532cc144b64))

# [1.27.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.26.0...@bosonprotocol/core-sdk@1.27.0) (2023-06-28)

### Features

- add name to sales channels ([#514](https://github.com/bosonprotocol/core-components/issues/514)) ([30e3c41](https://github.com/bosonprotocol/core-components/commit/30e3c41ce0cf1668655c90699e1a0d5420dfbe09))

# [1.26.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.25.3...@bosonprotocol/core-sdk@1.26.0) (2023-06-22)

### Bug Fixes

- convert SalesChannelDeployment.lastUpdated from BigInt to String ([#509](https://github.com/bosonprotocol/core-components/issues/509)) ([1ef97fe](https://github.com/bosonprotocol/core-components/commit/1ef97fed322e90bf05a528f8f5e0bda602cf9068))
- convert SalesChannelDeployment.lastUpdated from number into BigInt ([#508](https://github.com/bosonprotocol/core-components/issues/508)) ([10ee4db](https://github.com/bosonprotocol/core-components/commit/10ee4dbc070ca8b0e10ee44c0a4e79b6c5975643))

### Features

- add saleChannels in seller metadata ([#507](https://github.com/bosonprotocol/core-components/issues/507)) ([4cb6ea9](https://github.com/bosonprotocol/core-components/commit/4cb6ea958cb9c3e1e640c9af3e45d3728b309e5a))

## [1.25.3](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.25.2...@bosonprotocol/core-sdk@1.25.3) (2023-05-19)

### Bug Fixes

- merge origin/releases/mvfw-2023 ([#504](https://github.com/bosonprotocol/core-components/issues/504)) ([3561d45](https://github.com/bosonprotocol/core-components/commit/3561d453dcc117bf52daf04e66a6be5e0122485d))

## [1.25.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.25.1...@bosonprotocol/core-sdk@1.25.2) (2023-05-17)

**Note:** Version bump only for package @bosonprotocol/core-sdk

## [1.25.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.25.0...@bosonprotocol/core-sdk@1.25.1) (2023-05-15)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.25.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.24.0...@bosonprotocol/core-sdk@1.25.0) (2023-05-12)

### Bug Fixes

- dcl loading issue ([#439](https://github.com/bosonprotocol/core-components/issues/439)) ([0021e9f](https://github.com/bosonprotocol/core-components/commit/0021e9fef27b8bffbbbf7b681a6659c2618b5640))
- images metadata ([#447](https://github.com/bosonprotocol/core-components/issues/447)) ([7e43708](https://github.com/bosonprotocol/core-components/commit/7e437080e0ef1a2af6629702be70111a9dfc3915))
- omit erc mixins ([#437](https://github.com/bosonprotocol/core-components/issues/437)) ([5315c52](https://github.com/bosonprotocol/core-components/commit/5315c520af7a5a71a9f35c8f409e885a29d2032b))
- preMint with forwarder ([#422](https://github.com/bosonprotocol/core-components/issues/422)) ([700658a](https://github.com/bosonprotocol/core-components/commit/700658a9590e311f1b270bc972b62687bba9590c))
- seller metadata images type ([#495](https://github.com/bosonprotocol/core-components/issues/495)) ([1e4fd5e](https://github.com/bosonprotocol/core-components/commit/1e4fd5e4e2b9d4d49057a363e4618e61c2cd33f8))
- subgraph 2.2.0 ([#453](https://github.com/bosonprotocol/core-components/issues/453)) ([b5a2518](https://github.com/bosonprotocol/core-components/commit/b5a2518af35b24019b95f9b5757bf0654d2e0aa5))

### Features

- adapt biconomy relaying with forwarder ([#458](https://github.com/bosonprotocol/core-components/issues/458)) ([a567fc5](https://github.com/bosonprotocol/core-components/commit/a567fc5fa305746f3757f635206156251d695b98))
- add erc xxx mixins ([#435](https://github.com/bosonprotocol/core-components/issues/435)) ([5f6db24](https://github.com/bosonprotocol/core-components/commit/5f6db24f05e8e9af59766792e3b4ecffdfe71406))
- add finance widget to react kit ([#452](https://github.com/bosonprotocol/core-components/issues/452)) ([4740742](https://github.com/bosonprotocol/core-components/commit/474074234fadcf9c3cae5e821c2694e5eafa521e))
- add minted field in offer.range and update offer.quantityAvailable on reserving a range ([#474](https://github.com/bosonprotocol/core-components/issues/474)) ([4b6f0d1](https://github.com/bosonprotocol/core-components/commit/4b6f0d14dcc1d93c66b2466f04d1a7ff0b10c00a))
- add offer range in subgraph ([#449](https://github.com/bosonprotocol/core-components/issues/449)) ([c39c153](https://github.com/bosonprotocol/core-components/commit/c39c1531ea9873694d1ad709cb8bb1e5ef6524ac))
- add seller metadata ([#479](https://github.com/bosonprotocol/core-components/issues/479)) ([c988d5b](https://github.com/bosonprotocol/core-components/commit/c988d5b336f6813a0848033d27c88d451c0b86c1))
- add signMetaTxUpdateSellerAndOptIn ([#493](https://github.com/bosonprotocol/core-components/issues/493)) ([f908574](https://github.com/bosonprotocol/core-components/commit/f908574986a3ecb4f14aa92ea8526049dfe55cb2))
- add width, height, type and name to images in metadata ([#438](https://github.com/bosonprotocol/core-components/issues/438)) ([f95953f](https://github.com/bosonprotocol/core-components/commit/f95953f402f1d9992c3492e825d622b34f4e6bc2))
- make seller.metadata name, description and website optional ([#488](https://github.com/bosonprotocol/core-components/issues/488)) ([5b51c44](https://github.com/bosonprotocol/core-components/commit/5b51c4464f42fd6b5a84ca78104fb2f7f7e9f15c))
- omit web3lib erc mixins ([#436](https://github.com/bosonprotocol/core-components/issues/436)) ([23fcdd8](https://github.com/bosonprotocol/core-components/commit/23fcdd818d3191cff5f18566f5eab9abd65026de))
- remove seller metadata kind field ([#480](https://github.com/bosonprotocol/core-components/issues/480)) ([175b47e](https://github.com/bosonprotocol/core-components/commit/175b47e72315732b9020ab39ea88c66428d74ec5))
- store seller metadata uri in the graph ipfs node ([#494](https://github.com/bosonprotocol/core-components/issues/494)) ([f873143](https://github.com/bosonprotocol/core-components/commit/f873143687c0e83513895d04540cac26892867fc))
- support Biconomy meta tx with Trusted Forwarder ([#428](https://github.com/bosonprotocol/core-components/issues/428)) ([caa7498](https://github.com/bosonprotocol/core-components/commit/caa74982f146c0973f24b7043496768c5f238d68))
- update set contract uri of the seller ([#462](https://github.com/bosonprotocol/core-components/issues/462)) ([82833ed](https://github.com/bosonprotocol/core-components/commit/82833ed0e7f70182f4552a83f6e9595fb8d2c429))
- upgrade to contracts v2.2.0 ([#450](https://github.com/bosonprotocol/core-components/issues/450)) ([039d41e](https://github.com/bosonprotocol/core-components/commit/039d41e37caa067ca48f9d47bb8bc336ddfbafca))

# [1.24.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.23.2...@bosonprotocol/core-sdk@1.24.0) (2022-12-23)

### Features

- add update seller and opt in with meta transactions ([#413](https://github.com/bosonprotocol/core-components/issues/413)) ([39828a2](https://github.com/bosonprotocol/core-components/commit/39828a2fac33a246b86d3066d002883182d3293e))

## [1.23.2](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.23.1...@bosonprotocol/core-sdk@1.23.2) (2022-12-01)

### Bug Fixes

- remove treasury from getSellerByAddress ([#402](https://github.com/bosonprotocol/core-components/issues/402)) ([b13f78e](https://github.com/bosonprotocol/core-components/commit/b13f78e39e6beeb92c2acac8f1494f943790a25b))

## [1.23.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.23.0...@bosonprotocol/core-sdk@1.23.1) (2022-11-22)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.23.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.22.0...@bosonprotocol/core-sdk@1.23.0) (2022-11-17)

### Bug Fixes

- adapt meta-tx signature to ledger hardware wallet ([#374](https://github.com/bosonprotocol/core-components/issues/374)) ([51791bb](https://github.com/bosonprotocol/core-components/commit/51791bbed51640ae1ba559da4750e91661afdfe7))
- fix issue with metadata when signing meta-tx for createOfferWithCondi… ([#371](https://github.com/bosonprotocol/core-components/issues/371)) ([a241285](https://github.com/bosonprotocol/core-components/commit/a241285dd255abd8e37c9c050c275585f488a1bf))
- fix issue with signing the approve meta-tx for the USDC token ([#370](https://github.com/bosonprotocol/core-components/issues/370)) ([5d85c94](https://github.com/bosonprotocol/core-components/commit/5d85c94409ae28941a217440bee4807a32a5a7a3))
- validate address only once ([#393](https://github.com/bosonprotocol/core-components/issues/393)) ([2c1759a](https://github.com/bosonprotocol/core-components/commit/2c1759a72c617756b42a34e3b2a1d67ac2d44a57))

### Features

- activate meta-transactions for revokeVoucher()/completeExchangem()/extendDisputeTimeout() ([#367](https://github.com/bosonprotocol/core-components/issues/367)) ([9a7888e](https://github.com/bosonprotocol/core-components/commit/9a7888ec3d66b072604c7802a0834549f656bf19))
- add checkTokenGatedCondition ([#390](https://github.com/bosonprotocol/core-components/issues/390)) ([f07f6da](https://github.com/bosonprotocol/core-components/commit/f07f6dac20bcdd7a3f072876a6ae8d13f0b3e9de))
- add sellerId and disputeResolverId to productFilter ([#396](https://github.com/bosonprotocol/core-components/issues/396)) ([268657e](https://github.com/bosonprotocol/core-components/commit/268657ee48bc066fbd1f0a04a3c83400541927c8))
- fetch products with variants directly from subgraph ([#386](https://github.com/bosonprotocol/core-components/issues/386)) ([2bdb77a](https://github.com/bosonprotocol/core-components/commit/2bdb77aa2a5f4bafc2885e7d42f406b1c4f6c9a7))
- get token info from subgraph (when available) ([#380](https://github.com/bosonprotocol/core-components/issues/380)) ([61119f6](https://github.com/bosonprotocol/core-components/commit/61119f62c8c5f3f433f81339d8fbe0ebd4dace27))
- script to port images to pinata ([#388](https://github.com/bosonprotocol/core-components/issues/388)) ([c0af4a9](https://github.com/bosonprotocol/core-components/commit/c0af4a9b4d4147e0be46ca98b24e008de49846a1))

# [1.22.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.21.0...@bosonprotocol/core-sdk@1.22.0) (2022-10-28)

### Features

- add missing methods in core-sdk used for creating token-gated offers ([#365](https://github.com/bosonprotocol/core-components/issues/365)) ([413a345](https://github.com/bosonprotocol/core-components/commit/413a345c073cab7b6a467883eb2fcf64c08587ea))
- add the exchanges returned with the variants ([#362](https://github.com/bosonprotocol/core-components/issues/362)) ([62fd86a](https://github.com/bosonprotocol/core-components/commit/62fd86a77a557dd762e271e1741101f90fe11308))
- create and manage token gated offers ([#363](https://github.com/bosonprotocol/core-components/issues/363)) ([94978e8](https://github.com/bosonprotocol/core-components/commit/94978e81957bbca5c4cd28a5375be1b579a013c8))
- support meta transactions ([#348](https://github.com/bosonprotocol/core-components/issues/348)) ([1fa0992](https://github.com/bosonprotocol/core-components/commit/1fa0992b6fc426597565ce517cebef9d82d5875f))

# [1.21.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.20.1...@bosonprotocol/core-sdk@1.21.0) (2022-10-26)

### Bug Fixes

- assertCompletableExchange function ([#353](https://github.com/bosonprotocol/core-components/issues/353)) ([489c833](https://github.com/bosonprotocol/core-components/commit/489c833d1e780cd435333c3f80e22ed093e72cd4))
- set metadataStorage and theGraphStorage for createOffer meta-tx ([#342](https://github.com/bosonprotocol/core-components/issues/342)) ([35de252](https://github.com/bosonprotocol/core-components/commit/35de252d326804f12533e8e308d3fb7b5128a695))

### Features

- add method coreSdk.getProductWithVariants(productUUID) ([#351](https://github.com/bosonprotocol/core-components/issues/351)) ([9b5bc8b](https://github.com/bosonprotocol/core-components/commit/9b5bc8bf30506549cdd6a2afaab8059c67e9f8be))
- add method signMetaTxDepositFunds() ([#343](https://github.com/bosonprotocol/core-components/issues/343)) ([6d822f4](https://github.com/bosonprotocol/core-components/commit/6d822f43485fb41ea7ccee5ea2a0486d6427f263))
- add optional animationUrl prop to ProductV1Metadata ([#350](https://github.com/bosonprotocol/core-components/issues/350)) ([0ea5983](https://github.com/bosonprotocol/core-components/commit/0ea5983e00f11754bc2c9b757d95562fb6a1776a))
- ensure approve is called when needed before committing to an offer ([#326](https://github.com/bosonprotocol/core-components/issues/326)) ([cb20d73](https://github.com/bosonprotocol/core-components/commit/cb20d73a418a6c07aea325553a4646ed9ac925a9))

## [1.20.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.20.0...@bosonprotocol/core-sdk@1.20.1) (2022-10-19)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.20.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.19.1...@bosonprotocol/core-sdk@1.20.0) (2022-10-18)

### Bug Fixes

- only save funds log for seller ([#325](https://github.com/bosonprotocol/core-components/issues/325)) ([5578bc9](https://github.com/bosonprotocol/core-components/commit/5578bc964c4a43166de73c065b553e2893788b3f))

### Features

- expose `metaTxHandler.getResubmitted` ([#330](https://github.com/bosonprotocol/core-components/issues/330)) ([e5abfa7](https://github.com/bosonprotocol/core-components/commit/e5abfa7d13ede12815c940f85ade3c4361525238))
- multi variant products ([#317](https://github.com/bosonprotocol/core-components/issues/317)) ([2863a66](https://github.com/bosonprotocol/core-components/commit/2863a66bb687d4da2ce0f6694466c03739a1c682))

## [1.19.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.19.0...@bosonprotocol/core-sdk@1.19.1) (2022-10-13)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.19.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.18.0...@bosonprotocol/core-sdk@1.19.0) (2022-10-13)

### Features

- add licenseUrl field to metadata ([#316](https://github.com/bosonprotocol/core-components/issues/316)) ([fee50b4](https://github.com/bosonprotocol/core-components/commit/fee50b4065f851fad409219715484eb62dcc18bd))

# [1.18.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.17.0...@bosonprotocol/core-sdk@1.18.0) (2022-10-12)

### Features

- allow to search for a seller account based on the auth token ([#295](https://github.com/bosonprotocol/core-components/issues/295)) ([31de408](https://github.com/bosonprotocol/core-components/commit/31de40861723b66e543e601606f27f668840efbc))
- contract uri and royalty support in subgraph ([#303](https://github.com/bosonprotocol/core-components/issues/303)) ([edc44c1](https://github.com/bosonprotocol/core-components/commit/edc44c1977190635becfb8110d39396545feb5df))
- fetch tokenIds in parallel ([#305](https://github.com/bosonprotocol/core-components/issues/305)) ([54a1017](https://github.com/bosonprotocol/core-components/commit/54a10170fe733e071518e0d5868b5ae13b5868fe))
- return all seller accounts linked to auth tokens ([#306](https://github.com/bosonprotocol/core-components/issues/306)) ([ad2c61a](https://github.com/bosonprotocol/core-components/commit/ad2c61a1c1276af696787c474050f75c45cda663))
- seller meta tx + batch methods ([#292](https://github.com/bosonprotocol/core-components/issues/292)) ([c7acc0d](https://github.com/bosonprotocol/core-components/commit/c7acc0d75c2b80896dc44250a03c99f7dbdc9aff))
- update to latest commit of contracts ([#297](https://github.com/bosonprotocol/core-components/issues/297)) ([0efcc9c](https://github.com/bosonprotocol/core-components/commit/0efcc9ca05dd85bffbd48fa927f69667c605f708))
- upgrade contracts to v2.0.0-rc.4 (testing & staging) ([#311](https://github.com/bosonprotocol/core-components/issues/311)) ([38319c4](https://github.com/bosonprotocol/core-components/commit/38319c400758a748849762c2c180a1d521f9b104))

# [1.17.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.16.0...@bosonprotocol/core-sdk@1.17.0) (2022-10-05)

### Features

- contractual agreement template ([#278](https://github.com/bosonprotocol/core-components/issues/278)) ([e516cf5](https://github.com/bosonprotocol/core-components/commit/e516cf56eda83aefe6fb115329b31ea68b383b7d))
- fix npm publish config ([#286](https://github.com/bosonprotocol/core-components/issues/286)) ([d57bc91](https://github.com/bosonprotocol/core-components/commit/d57bc91b348f5225d0890cc3256ac464bb8ad122))
- mkae npm packages public ([#287](https://github.com/bosonprotocol/core-components/issues/287)) ([98927c2](https://github.com/bosonprotocol/core-components/commit/98927c233740616b80da66a7de30e911e85ab09c))
- set up prod config & ci ([#284](https://github.com/bosonprotocol/core-components/issues/284)) ([830f193](https://github.com/bosonprotocol/core-components/commit/830f1939de1e4c232b5b575d391bff3d3ccfdbe7))
- update seller wrapper ([#281](https://github.com/bosonprotocol/core-components/issues/281)) ([08521f0](https://github.com/bosonprotocol/core-components/commit/08521f0a6214ae45b1fe7cd8123407e24bd9804f))

# [1.16.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.15.0...@bosonprotocol/core-sdk@1.16.0) (2022-10-03)

### Bug Fixes

- add base buyer and seller fields to base exchange fragment ([#277](https://github.com/bosonprotocol/core-components/issues/277)) ([37f6e8c](https://github.com/bosonprotocol/core-components/commit/37f6e8c484558b2f2f48e63290b93b2ee6eb3557))
- try fixing the isolatedModules issue when building the dApp ([#257](https://github.com/bosonprotocol/core-components/issues/257)) ([295a6d7](https://github.com/bosonprotocol/core-components/commit/295a6d709ef2948072cf9162022a0d94cf25af3a))

### Features

- add `EventLog` entity ([#280](https://github.com/bosonprotocol/core-components/issues/280)) ([73c128e](https://github.com/bosonprotocol/core-components/commit/73c128e61e5928101e081014cb5a79e477355d36))
- add a method to relay meta transactions through native API ([#239](https://github.com/bosonprotocol/core-components/issues/239)) ([51e370e](https://github.com/bosonprotocol/core-components/commit/51e370eaaa2466cf5c8f06116e705f6e01843d12)), closes [#268](https://github.com/bosonprotocol/core-components/issues/268)
- add num of commits / redemptions ([#273](https://github.com/bosonprotocol/core-components/issues/273)) ([96345d0](https://github.com/bosonprotocol/core-components/commit/96345d03adfbdf5c27a2216446733f8dc16d8791))
- add voided field to the subgraph queries ([#276](https://github.com/bosonprotocol/core-components/issues/276)) ([171a9c7](https://github.com/bosonprotocol/core-components/commit/171a9c7092ae245849fb1f0eecff32eadfded2ce))
- migrate TESTING env to Mumbai ([#254](https://github.com/bosonprotocol/core-components/issues/254)) ([ebfc5eb](https://github.com/bosonprotocol/core-components/commit/ebfc5eb3bf633ac317068b11dade7be3c78be1b2))
- nest dispute in base exchange fields ([#274](https://github.com/bosonprotocol/core-components/issues/274)) ([8b811a8](https://github.com/bosonprotocol/core-components/commit/8b811a8022df72d386953becb64f4a9acd8ba221))
- support complete exchange batch ([#264](https://github.com/bosonprotocol/core-components/issues/264)) ([f70eafb](https://github.com/bosonprotocol/core-components/commit/f70eafb47a979a67336776600bf265c9994cfe4e))

# [1.15.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.14.0...@bosonprotocol/core-sdk@1.15.0) (2022-09-13)

### Bug Fixes

- change expired state ([#248](https://github.com/bosonprotocol/core-components/issues/248)) ([6164cf2](https://github.com/bosonprotocol/core-components/commit/6164cf289cb2bb99606baa19159f5fea56d22c83))

### Features

- meta-tx dispute handlers ([#242](https://github.com/bosonprotocol/core-components/issues/242)) ([10dad7e](https://github.com/bosonprotocol/core-components/commit/10dad7e6900d28b70318deec2c417fb1ca8a7a94))

# [1.14.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.13.0...@bosonprotocol/core-sdk@1.14.0) (2022-09-08)

### Features

- **core-sdk:** support `voidOfferBatch` ([#227](https://github.com/bosonprotocol/core-components/issues/227)) ([136f844](https://github.com/bosonprotocol/core-components/commit/136f84489e6c4a8479d587ead233a6d119427171))
- **subgraph:** add dispute field to exchange entity ([#236](https://github.com/bosonprotocol/core-components/issues/236)) ([3f6cd3e](https://github.com/bosonprotocol/core-components/commit/3f6cd3e3db8f54afb01d93dd426f526aff2f20df))
- update contracts to pre-release v2.0.0-rc.1 ([#204](https://github.com/bosonprotocol/core-components/issues/204)) ([f74d664](https://github.com/bosonprotocol/core-components/commit/f74d6644ed3687d5eed6b503e3564581485a05b6))

# [1.13.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.12.6...@bosonprotocol/core-sdk@1.13.0) (2022-08-30)

### Features

- add explicit dispute dates ([#221](https://github.com/bosonprotocol/core-components/issues/221)) ([c239b0e](https://github.com/bosonprotocol/core-components/commit/c239b0e25293e597ef415dc08497be161c6487e7))

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

- esm builds ([#196](https://github.com/bosonprotocol/core-components/issues/196)) ([32cf63a](https://github.com/bosonprotocol/core-components/commit/32cf63a11008b65d2c2c2156add5b2f1636e1544))
- fill voucherRedeemableUntil OR voucherValid with correct values … ([#203](https://github.com/bosonprotocol/core-components/issues/203)) ([9a2bdd2](https://github.com/bosonprotocol/core-components/commit/9a2bdd26ef8de06f32a6fd99727809656bd29aee))
- fix typo on core sdk ([#182](https://github.com/bosonprotocol/core-components/issues/182)) ([a2b7ee7](https://github.com/bosonprotocol/core-components/commit/a2b7ee7e124716e6d3a50a1faabc8170df9b5cba))
- rollup bundle compatibility ([#202](https://github.com/bosonprotocol/core-components/issues/202)) ([9da246b](https://github.com/bosonprotocol/core-components/commit/9da246b68be635026d493756e0a9b6dece80cf38))
- **subgraph:** make shipping field optional ([#192](https://github.com/bosonprotocol/core-components/issues/192)) ([1c1af5d](https://github.com/bosonprotocol/core-components/commit/1c1af5d9246a7738fe9054fbd8d4f1b681d643c3))

### Features

- bp292 - contractual agreement - implement rendering method ([#191](https://github.com/bosonprotocol/core-components/issues/191)) ([822fe1f](https://github.com/bosonprotocol/core-components/commit/822fe1f4ffba12e07456986e01bf3f474f780cef))
- contracts update ([#181](https://github.com/bosonprotocol/core-components/issues/181)) ([599a518](https://github.com/bosonprotocol/core-components/commit/599a5188cd350defe22c49626370b198c49bd6f7))
- contracts update ([#188](https://github.com/bosonprotocol/core-components/issues/188)) ([be1dbe4](https://github.com/bosonprotocol/core-components/commit/be1dbe43740b4a2fcd5c7a06147bcdb8f9c7b1b0))
- dispute resolver support in subgraph and core-sdk ([#185](https://github.com/bosonprotocol/core-components/issues/185)) ([0a12bba](https://github.com/bosonprotocol/core-components/commit/0a12bba6c46a1907df8417da6057aecd099283d9))
- sign dispute resolution proposal ([#207](https://github.com/bosonprotocol/core-components/issues/207)) ([707a7b2](https://github.com/bosonprotocol/core-components/commit/707a7b25a28efef2401d332bb6d2ee80f825fb15))
- subgraph and core-sdk DisputeHandlerFacet ([#186](https://github.com/bosonprotocol/core-components/issues/186)) ([ac58f3d](https://github.com/bosonprotocol/core-components/commit/ac58f3d3beb83d5526b99d410ea2ff6c02db58fa))

# [1.11.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.10.0...@bosonprotocol/core-sdk@1.11.0) (2022-07-26)

### Features

- **core-sdk:** add subgraph wrappers for metadata entities ([#166](https://github.com/bosonprotocol/core-components/issues/166)) ([9a720aa](https://github.com/bosonprotocol/core-components/commit/9a720aac5016ba1a422d48f8d3185d44bf2a3edd))
- **core-sdk:** expose buyer query methods ([#178](https://github.com/bosonprotocol/core-components/issues/178)) ([6fca300](https://github.com/bosonprotocol/core-components/commit/6fca3004b8cfe4b72471499a159d356628af3ec2))
- **core-sdk:** update auto-generated subgraph sdk ([#164](https://github.com/bosonprotocol/core-components/issues/164)) ([309ee88](https://github.com/bosonprotocol/core-components/commit/309ee8865999b8cff70a77e2b88896f536edd1ec))

# [1.10.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.9.0...@bosonprotocol/core-sdk@1.10.0) (2022-07-12)

### Bug Fixes

- withdraw funds with an available amount ([#144](https://github.com/bosonprotocol/core-components/issues/144)) ([0ad3ed0](https://github.com/bosonprotocol/core-components/commit/0ad3ed0617e362656b07103a8822285d14a1d095))

### Features

- **subgraph:** add buyer query and fix available quantity field ([#152](https://github.com/bosonprotocol/core-components/issues/152)) ([f7c7b82](https://github.com/bosonprotocol/core-components/commit/f7c7b827152e63d15956da3acf1346532f712267))

# [1.9.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.8.0...@bosonprotocol/core-sdk@1.9.0) (2022-07-05)

### Features

- **core-sdk:** expose `completeExchange` ([#132](https://github.com/bosonprotocol/core-components/issues/132)) ([129c84c](https://github.com/bosonprotocol/core-components/commit/129c84cc32060ab1761854148ec76aa9fe695f66))
- **core-sdk:** meta tx handler ([#135](https://github.com/bosonprotocol/core-components/issues/135)) ([ddaa489](https://github.com/bosonprotocol/core-components/commit/ddaa4890f043a7ca1b25daaec078fb16c4254db3))
- withdraw all funds ([#129](https://github.com/bosonprotocol/core-components/issues/129)) ([6ef814b](https://github.com/bosonprotocol/core-components/commit/6ef814bd6edf64556e5e1114a7a3953460c75eb4))

# [1.8.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.7.0...@bosonprotocol/core-sdk@1.8.0) (2022-06-27)

### Features

- adapt to new set of contracts ([#131](https://github.com/bosonprotocol/core-components/issues/131)) ([ffe5fc7](https://github.com/bosonprotocol/core-components/commit/ffe5fc7c64f5743b06212fb969f293cd64046459))

# [1.7.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.6.0...@bosonprotocol/core-sdk@1.7.0) (2022-06-22)

### Features

- rudimentary withdraw funds logic ([#127](https://github.com/bosonprotocol/core-components/issues/127)) ([47d6a0f](https://github.com/bosonprotocol/core-components/commit/47d6a0fc0f281b8fcf96532cfdbec75d0dcac69f))

# [1.6.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.5.0...@bosonprotocol/core-sdk@1.6.0) (2022-06-20)

### Bug Fixes

- **core-sdk:** gql import from graphql-request ([#113](https://github.com/bosonprotocol/core-components/issues/113)) ([4ac3624](https://github.com/bosonprotocol/core-components/commit/4ac362470729b67c82f395ac55cd95eef37ec65d))

### Features

- **core-sdk:** expose typed subgraph query helpers ([#118](https://github.com/bosonprotocol/core-components/issues/118)) ([f2e2945](https://github.com/bosonprotocol/core-components/commit/f2e294589c27d51528b98090a89f3d532f862723))
- revoke, cancel and redeem ([#120](https://github.com/bosonprotocol/core-components/issues/120)) ([c1612cb](https://github.com/bosonprotocol/core-components/commit/c1612cb7eb27f3a1071b8414d4e6f16d7a03f062))
- rudimentary deposit funds in widgets ([#110](https://github.com/bosonprotocol/core-components/issues/110)) ([2913068](https://github.com/bosonprotocol/core-components/commit/2913068026c0f8875485ed1c07cfbafd691c4e55))
- rudimentary funds handler support ([#108](https://github.com/bosonprotocol/core-components/issues/108)) ([76b7336](https://github.com/bosonprotocol/core-components/commit/76b733615598034b4787eff50b75a5de5b366f53))
- update create offer flow to new contracts ([#107](https://github.com/bosonprotocol/core-components/issues/107)) ([f5934a1](https://github.com/bosonprotocol/core-components/commit/f5934a18968d2a70fe0a3a3ffdf08cb785d1f63e))

# [1.5.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.4.1...@bosonprotocol/core-sdk@1.5.0) (2022-06-09)

### Features

- add Exchange view in the widget ([#103](https://github.com/bosonprotocol/core-components/issues/103)) ([b9098d4](https://github.com/bosonprotocol/core-components/commit/b9098d40e1a8955f960c1cfa3014b2ebad226650))

## [1.4.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.4.0...@bosonprotocol/core-sdk@1.4.1) (2022-05-27)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.4.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.3.0...@bosonprotocol/core-sdk@1.4.0) (2022-05-10)

### Features

- separate metadata package ([#86](https://github.com/bosonprotocol/core-components/issues/86)) ([2bf5069](https://github.com/bosonprotocol/core-components/commit/2bf5069256592e8ed5e80a3e557e1402ba437fc9))

# [1.3.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.2.1...@bosonprotocol/core-sdk@1.3.0) (2022-05-09)

### Features

- **core-sdk:** expose get seller by clerk ([#83](https://github.com/bosonprotocol/core-components/issues/83)) ([df7a4b1](https://github.com/bosonprotocol/core-components/commit/df7a4b1b842b77d4e08767fe6d888fdebd8a7efa))
- **core-sdk:** get seller by address method ([#82](https://github.com/bosonprotocol/core-components/issues/82)) ([de7f9d9](https://github.com/bosonprotocol/core-components/commit/de7f9d95c5fe536f277b01af210a7f66df420c67))

## [1.2.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.2.0...@bosonprotocol/core-sdk@1.2.1) (2022-05-04)

**Note:** Version bump only for package @bosonprotocol/core-sdk

# [1.2.0](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.1.1...@bosonprotocol/core-sdk@1.2.0) (2022-05-02)

### Features

- adapt create-offer to new offer-, account and orchestration handler contracts ([#67](https://github.com/bosonprotocol/core-components/issues/67)) ([86a589d](https://github.com/bosonprotocol/core-components/commit/86a589d69c65f178bf86f062f7ad77f3bfe33cad))
- commit functionality in sdks and subgraphs ([#75](https://github.com/bosonprotocol/core-components/issues/75)) ([519ca47](https://github.com/bosonprotocol/core-components/commit/519ca470318b2f1fceb44c5c6a5739a204d0a266))

## [1.1.1](https://github.com/bosonprotocol/core-components/compare/@bosonprotocol/core-sdk@1.1.0...@bosonprotocol/core-sdk@1.1.1) (2022-04-25)

### Bug Fixes

- include ts files to fix sourcemap warnings ([#61](https://github.com/bosonprotocol/core-components/issues/61)) ([e815e31](https://github.com/bosonprotocol/core-components/commit/e815e31f13c667522b1f3c18460a4f1a7de37b53))

# 1.1.0 (2022-04-21)

### Features

- add metadata validation helpers ([#32](https://github.com/bosonprotocol/core-components/issues/32)) ([f2b952c](https://github.com/bosonprotocol/core-components/commit/f2b952cf0461f17e9f38c7221c03d2883428d8ec))
- add rudimentary ipfs metadata storage ([#7](https://github.com/bosonprotocol/core-components/issues/7)) ([1cded98](https://github.com/bosonprotocol/core-components/commit/1cded9833deaf6ebdc93a07ab6840de263c70158))
- composable sdk structure ([#3](https://github.com/bosonprotocol/core-components/issues/3)) ([dc5c9ac](https://github.com/bosonprotocol/core-components/commit/dc5c9acfbffc319cd1bf3eb37a9012a0dcf21230))
- **core-sdk:** add method to get all offers of a seller ([#25](https://github.com/bosonprotocol/core-components/issues/25)) ([a19f0c8](https://github.com/bosonprotocol/core-components/commit/a19f0c8b4fc08672205775ed2c89ae1e99f9d72f))
- **core-sdk:** add rudimentary offers module ([#6](https://github.com/bosonprotocol/core-components/issues/6)) ([954b3f9](https://github.com/bosonprotocol/core-components/commit/954b3f9858f8f0f306a2bfe2f22205df4a7d45f4))
- **core-sdk:** add voidOffer method ([#19](https://github.com/bosonprotocol/core-components/issues/19)) ([da0b07f](https://github.com/bosonprotocol/core-components/commit/da0b07f08161640efd8da63d3c9ba14fcd86fd9a))
- **core-sdk:** approve exchange token ([#18](https://github.com/bosonprotocol/core-components/issues/18)) ([002b44c](https://github.com/bosonprotocol/core-components/commit/002b44c4f46b0ef9ae36647a4fad78e07a98dfee))
- **core-sdk:** get offer by id from subgraph ([#14](https://github.com/bosonprotocol/core-components/issues/14)) ([af78edf](https://github.com/bosonprotocol/core-components/commit/af78edfcea84f46bbc87493f145deabe04f0e726))
- dynamic widget config + default provider in widgets ([#26](https://github.com/bosonprotocol/core-components/issues/26)) ([467d411](https://github.com/bosonprotocol/core-components/commit/467d411113f53069953673a5707c52baef0582e5))
- extendable metadata ([#50](https://github.com/bosonprotocol/core-components/issues/50)) ([1f2da94](https://github.com/bosonprotocol/core-components/commit/1f2da941381104e32e6620d8d97808d2fabedc98))
- get created offer id from logs and display in widget ([#17](https://github.com/bosonprotocol/core-components/issues/17)) ([a7c0c36](https://github.com/bosonprotocol/core-components/commit/a7c0c36aae98b08a2a97eac5d9dd1f9c452bbcb3))
- integrate widgets core-sdk widgets-sdk ([#15](https://github.com/bosonprotocol/core-components/issues/15)) ([176b65d](https://github.com/bosonprotocol/core-components/commit/176b65d1a8a723567cadde2403ff45547a19cc0d))
- monorepo setup tweaks ([#10](https://github.com/bosonprotocol/core-components/issues/10)) ([b8cf248](https://github.com/bosonprotocol/core-components/commit/b8cf2481a684b7d0917c31478cad06354454115d))
