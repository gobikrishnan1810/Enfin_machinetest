import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../constants/api";
import { useSnackbar } from "notistack";

interface AddBookModalProps {
  fetchBooks: (page: number, search: string) => void;
  show: boolean;
  handleClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ fetchBooks, show, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    publish_date: string;
    price: string;
  }>({
    name: "",
    description: "",
    publish_date: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API
    console.log(formData);

    api
      .post("/books/insert-book", formData)
      .then((res) => {
        console.log("success", res);
        fetchBooks(1, "");
        enqueueSnackbar("Book Added Successfully!", { variant: "success" });
        handleClose();
      })
      .catch((err) => {
        if (err.response && err.response.data.errors) {
          enqueueSnackbar(err.response.data.errors[0].msg, { variant: "error" });
          console.log("error", err.response.data.errors[0].msg);
        }
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a New Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter book name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPublishDate">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control
              type="date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Add Book
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBookModal;
