import React, { useState } from "react";
import { TextField, Typography, Button, Box, Container } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //for Errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    let isValid = true;

    // name
    if (!formData.name) {
      formErrors.name = "Name is requires";
      isValid = false;
    }

    // email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      formErrors.email = "Email is requires";
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      formErrors.email = "Invalid Email";
      isValid = false;
    }

    // password
    if (!formData.password) {
      formErrors.password = "Password is requires";
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = "Password must be atleast 6 characters";
      isValid = false;
    }
    setErrors(formErrors);

    if (isValid) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/hostel/signup",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        alert(response.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          border: "1px solid #000",
         
          padding: 5,
          marginTop: 20,
        }}
      >
        <Typography
          variant="h4"
          textAlign={"center"}
          marginTop={1}
          marginBottom={3}
        >
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection={"column"} gap={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />

            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
            <Typography>
              Do you already have an account ? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </form>
      </Container>
    </>
  );
}
export default Signup;
