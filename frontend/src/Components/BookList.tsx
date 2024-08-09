import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Pagination,
  Table,
} from "react-bootstrap";
import moment from "moment";
import api from "../constants/api";
import AddBookModal from "./AddbookModal";

interface Book {
  name: string;
  description: string;
  publish_date: string;
  price: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const fetchBooks = async (page: number = 1, searchQuery: string = "") => {
    try {
      const data = await api.get("/books/getBooks", {
        params: {
          page,
          limit: 4,
          search: searchQuery,
        },
      });
      setBooks(data.data.books);
      setTotalPages(data.data.totalPages);
      console.log("books", data.data.books);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    fetchBooks(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchBooks(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchBooks(newPage, searchQuery);
  };

  return (
    <Container>
      <Row>
        <Card>
          <Card.Body>
            <Card.Title
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Book List
            </Card.Title>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <Col md={12}>
          <Button
            style={{ float: "right" }}
            title="Create new Book"
            type="submit"
            onClick={handleShow}
          >
            Add Book
          </Button>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={12}>
          <Form onSubmit={handleSearch} style={{ float: "right" }}>
            <Form.Control
              type="text"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Publish Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{book.name}</td>
                <td>{book.description}</td>
                <td>
                  {book.publish_date
                    ? moment(book.publish_date).format("DD/MM/YYYY")
                    : ""}
                </td>
                <td>{book.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row className="my-4">
        <Col>
          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
      {showModal && (
        <AddBookModal
          fetchBooks={fetchBooks}
          show={showModal}
          handleClose={handleClose}
        />
      )}
    </Container>
  );
};

export default BookList;