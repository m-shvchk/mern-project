import { useState, useEffect } from "react";
import { Logo, FormRow } from "../components";
import styled from "styled-components";

// global context and useNavigate later

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const handleChange = (e) => {
  console.log(e.target);
};

const onSubmit = (e) => {
  e.preventDefault();
  console.log(e.target);
};

const Register = () => {
  const [values, setValues] = useState(initialState);

  // global context and useNavigate later

  return (
    <Wrapper className="full-page">
      <form className="form">
        <Logo />
        <h3>Login</h3>

        {/*name input*/}
        <FormRow
          type="text"
          name="name"
          id="name"
          value={values.name}
          handleChange={handleChange}

        />

        {/*email input*/}
        <FormRow
          type="email"
          name="email"
          id="email"
          value={values.email}
          handleChange={handleChange}
        />

        {/*password input*/}
        <FormRow
          type="password"
          name="password"
          id="password"
          value={values.password}
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block" onSubmit={onSubmit}>
          submit
        </button>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;

export default Register;
