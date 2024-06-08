import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Form, Input, Button, Checkbox,message, Spin } from "antd";

import LeftContent from "../leftContent";
import Footer from "../footer";
import { loginUser } from "../../../../redux/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FormattedMessage } from "react-intl";

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state);
  console.log(auth)
  const [form] = Form.useForm();
  const history = useHistory();

  const loading = useSelector((state) => state.auth.loading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);


  useEffect(()=>{
    if(isLoggedIn){
      history.push('/pages/workspace')
    }
  },[isLoggedIn])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  const login = async () => {
    await dispatch(loginUser({ email, password }));
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
            <h1 className="hp-mb-sm-0">Login</h1>
            <p className="hp-mt-sm-0 hp-mt-8 hp-text-color-black-60">
              {/* Welcome back, please login to your account.
               */}
               <FormattedMessage id="login-welcome-back" />
            </p>

            <Form
              layout="vertical"
              name="basic"
              initialValues={{ remember: true }}
              className="hp-mt-sm-16 hp-mt-32"
              onFinish={login}
              form={form}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Email :"
                className="hp-mb-16"
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
                label="Password :"
                className="hp-mb-8"
                name="password"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: "string",
                    min: 8,
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

              <Row align="middle" justify="space-between">
                <Form.Item className="hp-mb-0">
                  <Checkbox name="remember"><FormattedMessage id="remember-me" /></Checkbox>
                </Form.Item>

                <Link
                  className="hp-button hp-text-color-black-80 hp-text-color-dark-40"
                  to="/pages/authentication/recover-password"
                >
                  <FormattedMessage id="forgot-password" />
                </Link>
              </Row>
              {/* {loading && <Spin />} */}

              <Form.Item className="hp-mt-16 hp-mb-8">
                {/* <Link to="/"> */}
                <Button loading={loading} block type="primary" htmlType="submit">
                  Sign in
                </Button>
                {/* </Link> */}
              </Form.Item>
            </Form>

            <Col className="hp-form-info hp-text-center">
              <span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-font-weight-400 hp-mr-4">
                {/* Don’t you have an account? */}
                <FormattedMessage id="login-have-account" />
              </span>

              <Link
                className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-caption"
                to="/pages/authentication/register"
              >
                {/* Create an account */}
                <FormattedMessage id="create-an-account" />
                
              </Link>
            </Col>

            <Footer />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
