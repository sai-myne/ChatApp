import React, { useState } from 'react'
import { Row, Col, Form, Button } from "react-bootstrap";

export default function Register() {
    const [variable, setVariable] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      const submitRegisterForm = (e) => {
        e.preventDefault();
        console.log(variable)
      };
    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={variable.email}
                onChange={(e) =>
                  setVariable({ ...variable, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={variable.username}
                onChange={(e) =>
                  setVariable({ ...variable, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={variable.password}
                onChange={(e) =>
                  setVariable({ ...variable, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                value={variable.confirmPassword}
                onChange={(e) =>
                  setVariable({ ...variable, confirmPassword: e.target.value })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    )
}
