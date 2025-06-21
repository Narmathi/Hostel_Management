import React from "react";

import { useState,useEffect } from "react";
import { TextField, Typography, Button, Box, Container } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //for Errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/hostel/login",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", response.data.userName);

        setFormData({
          email: "",
          password: "",
        });

        navigate("/dashboard", { replace: true });
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container
          maxWidth="xs"
          sx={{
            border: "1px solid #000",
            padding: 5,
            marginTop: 20,
            filter: loading ? "blur(4px)" : "none",
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <Typography
            variant="h4"
            textAlign={"center"}
            marginTop={1}
            marginBottom={3}
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection={"column"} gap={2}>
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
                Login
              </Button>
              <Typography>
                You don't have an account ? <Link to="/">Signup</Link>
              </Typography>
            </Box>
          </form>
        </Container>
      )}
    </>
  );
}
export default Login;
