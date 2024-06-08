import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Form, Input, Button, message, Spin, Select } from "antd";

import LeftContent from "../leftContent";
import Footer from "../footer";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../../redux/auth/authActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FormattedMessage } from "react-intl";

const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "foodService", label: "Food Service" },
  { value: "realEstate", label: "Real Estate" },
  { value: "transportation", label: "Transportation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "agriculture", label: "Agriculture" },
  { value: "construction", label: "Construction" },
  { value: "energy", label: "Energy" },
  { value: "pharmaceutical", label: "Pharmaceutical" },
  { value: "insurance", label: "Insurance" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "automotive", label: "Automotive" },
  { value: "aerospace", label: "Aerospace" },
  { value: "chemical", label: "Chemical" },
  { value: "consumerGoods", label: "Consumer Goods" },
];

export default function SignUp() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);
  const authMessage = useSelector((state) => state.auth.message);

  console.log(auth);
  const [form] = Form.useForm();
  const history = useHistory();

  // useEffect(()=>{
  //   // if(error){
  //   //   message.error(error);
  //   //   dispatch({
  //   //     type: "SET_ERROR",
  //   //     error: "",
  //   //   });
  //   // }
  //   if(authMessage){
  //     message.success(authMessage);
  //     history.push('/pages/authentication/login')
  //     dispatch({
  //       type: "SET_MESSAGE",
  //       error: "",
  //     });
  //   }

  // },[ authMessage ])

  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const register = async () => {
    const userPayload = {
      name,
      email,
      password,
      role,
      phoneNumber,
      address,
      location,
      ...(role === "company" && { companyName, companySize, industry }),
    };

    const response = dispatch(registerUser(userPayload));
    if (response) {
      message.success(authMessage);
      history.push("/pages/authentication/login");
    }
  };

  const resetStates = () => {
    setName("");
    setRole("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setAddress("");
    setLocation("");
    setCompanySize("");
    setCompanyName("");
    setIndustry("");
  };

  const handleChange = (value) => {
    setRole(value);
  };

  return (
    <Row gutter={[32, 0]} className="hp-authentication-page">
      <LeftContent />

      <Col lg={12} span={24} className="hp-py-sm-0 hp-py-md-64">
        <Row className="hp-h-100" align="middle" justify="center">
          <Col
            xxl={11}
            xl={15}
            lg={20}
            md={20}
            sm={24}
            className="hp-px-sm-8 hp-pt-24 hp-pb-48"
          >
            <span className="hp-d-block hp-p1-body hp-text-color-dark-0 hp-text-color-black-100 hp-font-weight-500 hp-mb-6">
              <FormattedMessage id="signup-free" />
            </span>
            <h1>Create Account</h1>
            <p className="hp-mt-8 hp-text-color-black-60">
              <FormattedMessage id="signup-intro" />
            </p>

            <Form
              layout="vertical"
              name="basic"
              form={form}
              className="hp-mt-sm-16 hp-mt-32"
              onFinish={register}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true }, { type: "string", min: 4 }]}
              >
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="E-mail :"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Phone Number :"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                  {
                    pattern: /^[0-9]{11}$/,
                    message: "The input is not a valid 11-digit phone number!",
                  },
                ]}
              >
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Address :"
                name="address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Location :"
                name="location"
                rules={[
                  { required: true, message: "Please input your location!" },
                ]}
              >
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Item>

              {role === "company" && (
                <>
                  <Form.Item
                    label="Company Name"
                    name="companyName"
                    rules={[
                      {
                        required: true,
                        message: "Please select your company name!",
                      },
                      { type: "string", min: 4 },
                    ]}
                  >
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Company Size"
                    name="companySize"
                    rules={[
                      {
                        required: true,
                        message: "Please select your company size!",
                      },
                    ]}
                  >
                    <Select
                      defaultValue={companySize}
                      onChange={(value) => setCompanySize(value)}
                      options={[
                        { value: "1-10", label: "1-10" },
                        { value: "11-50", label: "11-50" },
                        { value: "50-500", label: "50-500" },
                        { value: "500-1000", label: "500-1000" },
                        { value: "1000-5000", label: "1000-5000" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Industry"
                    name="industry"
                    rules={[
                      {
                        required: true,
                        message: "Please select your industry!",
                      },
                    ]}
                  >
                    <Select
                      defaultValue={industry}
                      onChange={(value) => setIndustry(value)}
                      options={industryOptions}
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Password :"
                name="password"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: "string",
                    min: 6,
                  },
                  {
                    validator: (_, value) =>
                      /^(?=.*[A-Z])(?=.*\d).+$/.test(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error(
                              "Password must contain at least one uppercase letter and one number."
                            )
                          ),
                  },
                ]}
              >
                <Input.Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password :"
                name="confirm-password"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: "string",
                    min: 6,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Role" name="role">
                <Select
                  defaultValue={role}
                  onChange={handleChange}
                  options={[
                    { value: "user", label: "Candidate" },
                    { value: "company", label: "Company" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
              </Form.Item>

              {/* {loading && <Spin />} */}
              <Form.Item className="hp-mt-16 hp-mb-8">
                <Button
                  loading={loading}
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Sign up
                </Button>
              </Form.Item>
            </Form>

            <div className="hp-form-info hp-text-center">
              <span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-mr-4">
                <FormattedMessage id="signup-have-account" />
              </span>

              <Link
                to="/pages/authentication/login"
                className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-caption"
              >
                Login
              </Link>
            </div>

            <Footer />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
