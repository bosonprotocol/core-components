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
      quantity: "123"
    },
    onSubmit: (values) => {
      createOffer({
        ipfsCID: "1234",
        price: "1234",
        quantity: "1234"
      });
    }
  });

  return (
    <Root>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={formik.values.title}
            onChange={formik.handleChange}
            name="title"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            value={formik.values.price}
            onChange={formik.handleChange}
            name="price"
            type="text"
            placeholder="..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            value={formik.values.quantity}
            onChange={formik.handleChange}
            name="quantity"
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
