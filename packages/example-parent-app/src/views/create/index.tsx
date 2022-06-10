import { createOffer } from "@bosonprotocol/widgets-sdk";
import { Form, Button, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useFormik } from "formik";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { MetadataType } from "@bosonprotocol/common";
import { parseEther } from "@ethersproject/units";
import { CONFIG } from "../../lib/config";
import { Layout } from "../../lib/components/Layout";
import { PageTitle } from "../../lib/components/PageTitle";

const StyledForm = styled(Form)`
  width: 800px;
`;

const dayInMs = 1000 * 60 * 60 * 24;
const minuteInMS = 1000 * 60;

export function HomeView() {
  const formik = useFormik({
    initialValues: {
      name: "Baggy jeans",
      description: "Lore ipsum",
      externalUrl: "https://external-url.com",
      schemaUrl: "https://schema.org/schema",
      disputeResolverId: "1",
      price: "2",
      sellerDeposit: "2",
      protocolFee: "1",
      buyerCancelPenalty: "1",
      quantityAvailable: "10",
      exchangeToken: "0x0000000000000000000000000000000000000000",
      voucherRedeemableFromDateInMS: (Date.now() + minuteInMS).toString(),
      voucherRedeemableUntilDateInMS: (Date.now() + 2 * dayInMs).toString(),
      validFromDateInMS: (Date.now() + minuteInMS).toString(),
      validUntilDateInMS: (Date.now() + dayInMs).toString(),
      fulfillmentPeriodDurationInMS: dayInMs.toString(),
      resolutionPeriodDurationInMS: dayInMs.toString()
    },
    onSubmit: async (values) => {
      const storage = new IpfsMetadata({
        url: CONFIG.ipfsMetadataUrl
      });

      const metadataHash = await storage.storeMetadata({
        name: values.name,
        description: values.description,
        externalUrl: values.externalUrl,
        schemaUrl: values.schemaUrl,
        type: MetadataType.BASE
      });
      const metadataUri = `ipfs://${metadataHash}`;

      createOffer(
        {
          ...values,
          price: parseEther(values.price).toString(),
          sellerDeposit: parseEther(values.sellerDeposit).toString(),
          buyerCancelPenalty: parseEther(values.buyerCancelPenalty).toString(),
          protocolFee: parseEther(values.protocolFee).toString(),
          offerChecksum: metadataHash, // TODO: use correct checksum
          metadataUri
        },
        {
          ...CONFIG,
          widgetsUrl: "http://localhost:3000"
        }
      );
    }
  });

  return (
    <Layout>
      <PageTitle>Create Offer</PageTitle>
      <StyledForm onSubmit={formik.handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>name</Form.Label>
            <Form.Control
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>description</Form.Label>
            <Form.Control
              rows={1}
              value={formik.values.description}
              onChange={formik.handleChange}
              name="description"
              as="textarea"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-5">
          <Form.Group as={Col}>
            <Form.Label>externalUrl</Form.Label>
            <Form.Control
              value={formik.values.externalUrl}
              onChange={formik.handleChange}
              name="externalUrl"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>schemaUrl</Form.Label>
            <Form.Control
              value={formik.values.schemaUrl}
              onChange={formik.handleChange}
              name="schemaUrl"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-5">
          <Form.Group as={Col}>
            <Form.Label>price</Form.Label>
            <Form.Control
              value={formik.values.price}
              onChange={formik.handleChange}
              name="price"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>sellerDeposit</Form.Label>
            <Form.Control
              value={formik.values.sellerDeposit}
              onChange={formik.handleChange}
              name="sellerDeposit"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>buyerCancelPenalty</Form.Label>
            <Form.Control
              value={formik.values.buyerCancelPenalty}
              onChange={formik.handleChange}
              name="buyerCancelPenalty"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>protocolFee</Form.Label>
            <Form.Control
              value={formik.values.protocolFee}
              onChange={formik.handleChange}
              name="protocolFee"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>quantityAvailable</Form.Label>
            <Form.Control
              value={formik.values.quantityAvailable}
              onChange={formik.handleChange}
              name="quantityAvailable"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>disputeResolverId</Form.Label>
            <Form.Control
              value={formik.values.disputeResolverId}
              onChange={formik.handleChange}
              name="disputeResolverId"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-5">
          <Form.Group as={Col}>
            <Form.Label>exchangeToken</Form.Label>
            <Form.Control
              value={formik.values.exchangeToken}
              onChange={formik.handleChange}
              name="exchangeToken"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>validFromDateInMS</Form.Label>
            <Form.Control
              value={formik.values.validFromDateInMS}
              onChange={formik.handleChange}
              name="validFromDateInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>validUntilDateInMS</Form.Label>
            <Form.Control
              value={formik.values.validUntilDateInMS}
              onChange={formik.handleChange}
              name="validUntilDateInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-5">
          <Form.Group as={Col}>
            <Form.Label>voucherRedeemableFromDateInMS</Form.Label>
            <Form.Control
              value={formik.values.voucherRedeemableFromDateInMS}
              onChange={formik.handleChange}
              name="voucherRedeemableFromDateInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>voucherRedeemableUntilDateInMS</Form.Label>
            <Form.Control
              value={formik.values.voucherRedeemableUntilDateInMS}
              onChange={formik.handleChange}
              name="voucherRedeemableUntilDateInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>fulfillmentPeriodDurationInMS</Form.Label>
            <Form.Control
              value={formik.values.fulfillmentPeriodDurationInMS}
              onChange={formik.handleChange}
              name="fulfillmentPeriodDurationInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>resolutionPeriodDurationInMS</Form.Label>
            <Form.Control
              value={formik.values.resolutionPeriodDurationInMS}
              onChange={formik.handleChange}
              name="resolutionPeriodDurationInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </StyledForm>
    </Layout>
  );
}
