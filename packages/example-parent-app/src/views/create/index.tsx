import { createOffer } from "@bosonprotocol/widgets-sdk";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import { useFormik } from "formik";
import { IpfsMetadata } from "@bosonprotocol/ipfs-storage";
import { parseEther } from "@ethersproject/units";
import { CONFIG } from "../../lib/config";

const Root = styled.div`
  padding: 24px;
  max-width: 600px;
`;

const dayInMs = 1000 * 60 * 60 * 24;

export function HomeView() {
  const formik = useFormik({
    initialValues: {
      title: "Baggy jeans",
      price: "1",
      deposit: "2",
      penalty: "3",
      quantity: "10",
      exchangeToken: "0xf47E4fd9d2eBd6182F597eE12E487CcA37FC524c", // ropsten boson address
      validFromDateInMS: Date.now().toString(),
      validUntilDateInMS: (Date.now() + dayInMs).toString(),
      redeemableDateInMS: (Date.now() + dayInMs).toString(),
      fulfillmentPeriodDurationInMS: dayInMs.toString(),
      voucherValidDurationInMS: dayInMs.toString()
    },
    onSubmit: async (values) => {
      const storage = new IpfsMetadata({
        url: CONFIG.ipfsMetadataUrl
      });

      const metadataHash = await storage.storeMetadata({
        title: values.title,
        description: ""
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
    <Root>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>title</Form.Label>
          <Form.Control
            value={formik.values.title}
            onChange={formik.handleChange}
            name="title"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>exchangeToken</Form.Label>
          <Form.Control
            value={formik.values.exchangeToken}
            onChange={formik.handleChange}
            name="exchangeToken"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>price</Form.Label>
          <Form.Control
            value={formik.values.price}
            onChange={formik.handleChange}
            name="price"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>deposit</Form.Label>
          <Form.Control
            value={formik.values.deposit}
            onChange={formik.handleChange}
            name="deposit"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>penalty</Form.Label>
          <Form.Control
            value={formik.values.penalty}
            onChange={formik.handleChange}
            name="penalty"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>quantity</Form.Label>
          <Form.Control
            value={formik.values.quantity}
            onChange={formik.handleChange}
            name="quantity"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>validFromDateInMS</Form.Label>
          <Form.Control
            value={formik.values.validFromDateInMS}
            onChange={formik.handleChange}
            name="validFromDateInMS"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>validUntilDateInMS</Form.Label>
          <Form.Control
            value={formik.values.validUntilDateInMS}
            onChange={formik.handleChange}
            name="validUntilDateInMS"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>redeemableDateInMS</Form.Label>
          <Form.Control
            value={formik.values.redeemableDateInMS}
            onChange={formik.handleChange}
            name="redeemableDateInMS"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>fulfillmentPeriodDurationInMS</Form.Label>
          <Form.Control
            value={formik.values.fulfillmentPeriodDurationInMS}
            onChange={formik.handleChange}
            name="fulfillmentPeriodDurationInMS"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>voucherValidDurationInMS</Form.Label>
          <Form.Control
            value={formik.values.voucherValidDurationInMS}
            onChange={formik.handleChange}
            name="voucherValidDurationInMS"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Root>
  );
}
