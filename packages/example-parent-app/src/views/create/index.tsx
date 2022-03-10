import { createOffer } from "@bosonprotocol/widgets-sdk";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import { useFormik } from "formik";

const Root = styled.div`
  padding: 24px;
  max-width: 600px;
`;

export function HomeView() {
  const formik = useFormik({
    initialValues: {
      title: "Baggy jeans",
      price: "123",
      deposit: "123",
      penalty: "123",
      quantity: "123",
      validFromDateInMS: "123",
      validUntilDateInMS: "123",
      redeemableDateInMS: "123",
      fulfillmentPeriodDurationInMS: "123",
      voucherValidDurationInMS: "123",
      seller: "123",
      exchangeToken: "ETH",
      metadataUri: "123",
      metadataHash: "123"
    },
    onSubmit: (values) => {
      createOffer(values);
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
        <Form.Group className="mb-3">
          <Form.Label>seller</Form.Label>
          <Form.Control
            value={formik.values.seller}
            onChange={formik.handleChange}
            name="seller"
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
          <Form.Label>metadataUri</Form.Label>
          <Form.Control
            value={formik.values.metadataUri}
            onChange={formik.handleChange}
            name="metadataUri"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>metadataHash</Form.Label>
          <Form.Control
            value={formik.values.metadataHash}
            onChange={formik.handleChange}
            name="metadataHash"
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
