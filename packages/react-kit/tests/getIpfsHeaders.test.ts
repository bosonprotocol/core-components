import { getIpfsHeaders } from "../src/hooks/ipfs/getIpfsHeaders";

const BASIC = `Basic ${Buffer.from("project-id:project-secret").toString(
  "base64"
)}`;

describe("#getIpfsHeaders()", () => {
  it("returns a Bearer header for a Pinata JWT", () => {
    expect(getIpfsHeaders({ ipfsJwt: "a.jwt.value" })).toEqual({
      Authorization: "Bearer a.jwt.value"
    });
  });

  it("prefers the JWT over the legacy project id and secret", () => {
    expect(
      getIpfsHeaders({
        ipfsJwt: "a.jwt.value",
        ipfsProjectId: "project-id",
        ipfsProjectSecret: "project-secret"
      })
    ).toEqual({ Authorization: "Bearer a.jwt.value" });
  });

  it("still builds a Basic header from the legacy pair", () => {
    expect(
      getIpfsHeaders({
        ipfsProjectId: "project-id",
        ipfsProjectSecret: "project-secret"
      })
    ).toEqual({ Authorization: BASIC });
  });

  it("returns no header when only half of the legacy pair is set", () => {
    expect(getIpfsHeaders({ ipfsProjectId: "project-id" })).toEqual({});
    expect(getIpfsHeaders({ ipfsProjectSecret: "project-secret" })).toEqual({});
  });

  it("falls back to the legacy pair when the JWT is empty", () => {
    expect(
      getIpfsHeaders({
        ipfsJwt: "",
        ipfsProjectId: "project-id",
        ipfsProjectSecret: "project-secret"
      })
    ).toEqual({ Authorization: BASIC });
  });

  it("returns no header when nothing is configured", () => {
    expect(getIpfsHeaders({})).toEqual({});
    expect(getIpfsHeaders()).toEqual({});
  });
});
