const { expect } = require("chai");
const { deployMockBosonVoucher } = require("./utils");

describe("MockBosonVoucher", () => {
  it("Deploy MockBosonVoucher", async () => {
    const sellerId = "1";
    const mockBosonVoucher = await deployMockBosonVoucher(sellerId);
    const mockBosonVoucherAddress = await mockBosonVoucher.getAddress();
    expect(!!mockBosonVoucherAddress).to.be.true;
  });

  it("Deploy MockBosonVoucher fails if sellerId is 0", async () => {
    const sellerId = "0";
    await expect(deployMockBosonVoucher(sellerId)).to.revertedWith(
      "SellerId can't be 0"
    );
  });

  it("MockBosonVoucher getSellerid()", async () => {
    const sellerId = "1";
    const mockBosonVoucher = await deployMockBosonVoucher(sellerId);
    expect((await mockBosonVoucher.getSellerId()).toString()).to.equal(
      sellerId
    );
  });

  it("MockBosonVoucher get name()", async () => {
    const sellerId = "1";
    const mockBosonVoucher = await deployMockBosonVoucher(sellerId);
    expect(await mockBosonVoucher.name()).to.equal("vouchers");
  });

  it("MockBosonVoucher get symbol()", async () => {
    const sellerId = "1";
    const mockBosonVoucher = await deployMockBosonVoucher(sellerId);
    expect(await mockBosonVoucher.symbol()).to.equal("VCHRS");
  });
});
