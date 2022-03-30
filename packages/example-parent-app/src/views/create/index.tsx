import { createOffer } from "@bosonprotocol/widgets-sdk";
import { Form, Button, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { useFormik } from "formik";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { parseEther } from "@ethersproject/units";
import { CONFIG } from "../../lib/config";
import { Layout } from "../../lib/components/Layout";
import { PageTitle } from "../../lib/components/PageTitle";

const StyledForm = styled(Form)`
  width: 800px;
`;

const dayInMs = 1000 * 60 * 60 * 24;
const hourInMs = 1000 * 60 * 60;

export function HomeView() {
  const formik = useFormik({
    initialValues: {
      title: "Baggy jeans",
      description: "Lore ipsum",
      additionalProperties: JSON.stringify({
        key: "value"
      }),
      price: "1",
      deposit: "2",
      penalty: "3",
      quantity: "10",
      exchangeToken: "0xf47E4fd9d2eBd6182F597eE12E487CcA37FC524c", // ropsten boson address
      redeemableDateInMS: (Date.now() + hourInMs).toString(),
      validFromDateInMS: (Date.now() + hourInMs).toString(),
      validUntilDateInMS: (Date.now() + dayInMs).toString(),
      fulfillmentPeriodDurationInMS: dayInMs.toString(),
      voucherValidDurationInMS: dayInMs.toString()
    },
    onSubmit: async (values) => {
      const storage = new IpfsMetadata({
        url: CONFIG.ipfsMetadataUrl
      });

      let additionalPropertiesHash;
      if (values.additionalProperties) {
        const parsed = JSON.parse(values.additionalProperties);
        additionalPropertiesHash = await storage.add(parsed);
      }

      const metadataHash = await storage.storeMetadata({
        title: values.title,
        description: values.description,
        additionalProperties: additionalPropertiesHash
      });
      const metadataUri = `${CONFIG.metadataBaseUrl}/${metadataHash}`;

      createOffer(
        {
          ...values,
          price: parseEther(values.price).toString(),
          deposit: parseEther(values.deposit).toString(),
          penalty: parseEther(values.penalty).toString(),
          metadataHash,
          metadataUri
        },
        CONFIG
      );
    }
  });

  return (
    <Layout>
      <PageTitle>Create Offer</PageTitle>
      <StyledForm onSubmit={formik.handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>title</Form.Label>
            <Form.Control
              value={formik.values.title}
              onChange={formik.handleChange}
              name="title"
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
            <Form.Label>deposit</Form.Label>
            <Form.Control
              value={formik.values.deposit}
              onChange={formik.handleChange}
              name="deposit"
              type="text"
              placeholder="..."
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>penalty</Form.Label>
            <Form.Control
              value={formik.values.penalty}
              onChange={formik.handleChange}
              name="penalty"
              type="text"
              placeholder="..."
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>quantity</Form.Label>
            <Form.Control
              value={formik.values.quantity}
              onChange={formik.handleChange}
              name="quantity"
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
            <Form.Label>redeemableDateInMS</Form.Label>
            <Form.Control
              value={formik.values.redeemableDateInMS}
              onChange={formik.handleChange}
              name="redeemableDateInMS"
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

        <Form.Group className="mb-3">
          <Form.Label>additional props as JSON (optional)</Form.Label>
          <Form.Control
            value={formik.values.additionalProperties}
            onChange={formik.handleChange}
            name="additionalProperties"
            as="textarea"
            placeholder="..."
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </StyledForm>
    </Layout>
  );
}
