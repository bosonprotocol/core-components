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
      price: "1",
      sellerDeposit: "2",
      buyerCancelPenalty: "1",
      quantityAvailable: "10",
      exchangeToken: "0xf47E4fd9d2eBd6182F597eE12E487CcA37FC524c", // ropsten boson address
      redeemableFromDateInMS: (Date.now() + minuteInMS).toString(),
      validFromDateInMS: (Date.now() + minuteInMS).toString(),
      validUntilDateInMS: (Date.now() + dayInMs).toString(),
      fulfillmentPeriodDurationInMS: dayInMs.toString(),
      voucherValidDurationInMS: dayInMs.toString()
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
        <Row className="mb-3">
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
        <Row className="mb-3">
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
        </Row>
        <Row className="mb-3">
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
            <Form.Label>quantityAvailable</Form.Label>
            <Form.Control
              value={formik.values.quantityAvailable}
              onChange={formik.handleChange}
              name="quantityAvailable"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>voucherValidDurationInMS</Form.Label>
            <Form.Control
              value={formik.values.voucherValidDurationInMS}
              onChange={formik.handleChange}
              name="voucherValidDurationInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
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
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>redeemableFromDateInMS</Form.Label>
            <Form.Control
              value={formik.values.redeemableFromDateInMS}
              onChange={formik.handleChange}
              name="redeemableFromDateInMS"
              type="text"
              placeholder="..."
            />
          </Form.Group>
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
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </StyledForm>
    </Layout>
  );
}
