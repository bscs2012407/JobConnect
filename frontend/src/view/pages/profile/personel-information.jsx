import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Modal,
  Tag,
  Tooltip,
  List,
  Space,
} from "antd";
import { RiCloseFill, RiCalendarLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfilePicture,
  updateUser,
  updateUserInformation,
} from "../../../redux/auth/authActions";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { message, Upload } from "antd";
import moment from "moment";

export default function InfoProfile() {
  const user = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [address, setAddress] = useState(user.address);
  const [location, setLocation] = useState(user.location);
  const [summary, setSummary] = useState(user.summary);

  const [skills, setSkills] = useState(user?.technicalSkills);
  const [softSkills, setSoftSkills] = useState(user?.softSkills);
  const [inputValue, setInputValue] = useState("");
  const [softInputValue, setSoftInputValue] = useState("");
  const [certifications, setCertifications] = useState(
    user?.certifications.length > 0
      ? user?.certifications.map((certification) => ({
          id: certification._id,
          ...certification,
          dateObtained: moment(certification.dateObtained),
        }))
      : [{ id: Math.random(), title: "", issuingOrg: "", dateObtained: null }]
  );

  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [preferanceModalVisible, setPreferanceModalVisible] = useState(false);

  const listTitle = "hp-p1-body";
  const listResult =
    "hp-mt-sm-4 hp-p1-body hp-text-color-black-100 hp-text-color-dark-0";
  const dividerClass = "hp-border-color-black-40 hp-border-color-dark-80";

  const uploadPictureProps = {
    name: "photo",
    action: "http://localhost:3001/v1/users/profile/upload",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(info, "URL");
        message.success(`${info.file.name} file uploaded successfully`);
        dispatch(updateProfilePicture({ src: info?.file?.response?.url }));
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const validateCertifications = () => {
    const filteredCertifications = certifications.filter(
      (certification) =>
        !certification.title ||
        !certification.issuingOrg ||
        !certification.dateObtained
    );
    return !(filteredCertifications.length > 0);
  };

  const updateUserInfo = (updateType) => {
    let obj = { id: user?.id };
    switch (updateType) {
      case "BASIC_INFO":
        obj = {
          ...obj,
          name,
          phoneNumber,
          address,
          location,
          email,
          summary,
        };
        console.log(obj);
        break;
      case "TECH_SKILLS":
        obj = {
          ...obj,
          technicalSkills: skills,
        };
        console.log(obj);
        break;
      case "SOFT_SKILLS":
        obj = {
          ...obj,
          softSkills: softSkills,
        };
        console.log(obj);
        break;
      case "CERTIFICATIONS":
        if (validateCertifications()) {
          obj = {
            ...obj,
            certifications: certifications.map((certification) => ({
              title: certification.title,
              issuingOrg: certification.issuingOrg,
              dateObtained: new Date(certification.dateObtained.format()),
            })),
          };
          console.log(obj);
          break;
        } else {
          message.error(
            "Please fill all the mandatory fields of certifications!"
          );
          return;
        }
      default:
        message.error("Invalid update user type!");
        return;
    }
    dispatch(updateUserInformation(obj));
    contactModalCancel();
  };

  const contactModalShow = () => {
    setContactModalVisible(true);
  };

  const contactModalCancel = () => {
    setContactModalVisible(false);
  };

  const preferanceModalShow = () => {
    setPreferanceModalVisible(true);
  };

  const preferanceModalCancel = () => {
    setPreferanceModalVisible(false);
  };

  const handleSkillInputConfirm = () => {
    if (inputValue && !skills.includes(inputValue)) {
      setSkills([...skills, inputValue]);
    }
    setInputValue("");
  };

  const handleSoftSkillInputConfirm = () => {
    if (softInputValue && !softSkills.includes(softInputValue)) {
      setSoftSkills([...softSkills, softInputValue]);
    }
    setSoftInputValue("");
  };

  const removeSkill = (removedSkill) => {
    const newSkills = skills.filter((skill) => skill !== removedSkill);
    setSkills(newSkills);
  };

  const removeSoftSkill = (removedSoftSkill) => {
    const newSoftSkills = softSkills.filter(
      (softSkill) => softSkill !== removedSoftSkill
    );
    setSoftSkills(newSoftSkills);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: Math.random(),
        title: "",
        issuingOrg: "",
        dateObtained: null,
      },
    ]);
  };

  const removeCertification = (id) => {
    const filteredCertifications = certifications.filter(
      (certification) => certification.id !== id
    );
    setCertifications(filteredCertifications);
  };

  const updateCertification = (id, field, value) => {
    const newCertifications = [...certifications];
    newCertifications[id][field] = value;
    setCertifications(newCertifications);
  };

  return (
    <div>
      <Modal
        title="Contact Edit"
        width={416}
        centered
        visible={contactModalVisible}
        onCancel={contactModalCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
            email,
            name,
            address,
            phoneNumber,
            location,
            summary,
          }}
          onFinish={() => updateUserInfo("BASIC_INFO")}
          onFinishFailed={() => message.error("Profile edit failed!")}
        >
          <Form.Item
            rules={[{ required: true }, { type: "string", min: 4 }]}
            label="name"
            name="name"
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item
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
            label="email"
            name="email"
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item
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
            label="phoneNumber"
            name="phoneNumber"
          >
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Please input your location!" }]}
            label="location"
            name="location"
          >
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: "Please input your address!" }]}
            label="address"
            name="address"
          >
            <Input.TextArea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true }, { type: "string", min: 350 }]}
            label="summary"
            name="summary"
          >
            <Input.TextArea
              rows={16}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button block type="primary" htmlType="submit" loading={loading}>
                Edit
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={contactModalCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Preferance Edit"
        width={316}
        centered
        visible={preferanceModalVisible}
        onCancel={preferanceModalCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form layout="vertical" name="basic" initialValues={{ remember: true }}>
          <Form.Item label="Language" name="language">
            <Input />
          </Form.Item>

          <Form.Item label="Date Format" name="dateformat">
            <DatePicker
              className="hp-w-100"
              suffixIcon={
                <RiCalendarLine className="remix-icon hp-text-color-black-60" />
              }
            />
          </Form.Item>

          <Form.Item label="Timezone" name="timezone">
            <TimePicker className="hp-w-100" />
          </Form.Item>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button
                block
                type="primary"
                htmlType="submit"
                onClick={preferanceModalCancel}
              >
                Edit
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={preferanceModalCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Divider className={dividerClass} />

      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>
            <FormattedMessage id="sidebar-apps-contact" />
          </h3>
        </Col>

        <Col md={12} span={24} className="hp-profile-action-btn hp-text-right">
          <Button type="primary" ghost onClick={contactModalShow}>
            Edit
          </Button>
        </Col>

        <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-42"
        >
          <ul>
            <li>
              <span className={listTitle}>
                <FormattedMessage id="pi-fname" />
              </span>
              <span className={listResult}>{user?.name}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="pi-email" />
              </span>
              <span className={listResult}>{user?.email}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="pi-phone" />
              </span>
              {user?.phoneNumber ?? "- -"}
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="Location" />
              </span>
              <span className={listResult}>{user?.location ?? "- -"}</span>
            </li>

            <li className="hp-mt-18">
              <span className={listTitle}>
                <FormattedMessage id="pi-summary" />
              </span>
              <span className={listResult}>{user?.address ?? "- -"}</span>
            </li>

            {user?.summary && (
              <li className="hp-mt-18">
                <span className={listTitle}>
                  <FormattedMessage id="pi-summary" />
                </span>
                <span className={listResult}>{user?.summary ?? "- -"}</span>
              </li>
            )}
          </ul>
        </Col>
      </Row>

      <Divider className={dividerClass} />

      <Row align="middle" justify="space-between">
        <Col md={12} span={24}>
          <h3>Upload Image</h3>
        </Col>

        <Upload {...uploadPictureProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {/* <Col
          span={24}
          className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-42"
        >
          <ul>
            <li>
              <span className={listTitle}><FormattedMessage id="total-tokens" /></span>
              <span className={listResult}>{user?.tokens}</span>
            </li>
          </ul>
        </Col> */}
      </Row>

      {user?.role === "user" && (
        <>
          <Divider className={dividerClass} />

          <Row align="center" justify="space-between">
            <Col
              span={24}
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3>Technical Skills</h3>
                <Button
                  type="primary"
                  ghost
                  onClick={() => updateUserInfo("TECH_SKILLS")}
                >
                  Save Technical Skills
                </Button>
              </div>
              <div>
                <Input
                  style={{ width: "24rem" }}
                  type="text"
                  value={inputValue}
                  placeholder="Enter a skill and press enter"
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={handleSkillInputConfirm}
                />
                <div style={{ marginTop: "8px" }}>
                  {skills.map((skill, index) => (
                    <Tag
                      style={{ marginTop: "8px" }}
                      key={skill}
                      closable
                      onClose={() => removeSkill(skill)}
                    >
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <Divider className={dividerClass} />

          <Row align="center" justify="space-between">
            <Col
              span={24}
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3>Soft Skills</h3>
                <Button
                  type="primary"
                  ghost
                  onClick={() => updateUserInfo("SOFT_SKILLS")}
                >
                  Save Soft Skills
                </Button>
              </div>
              <div>
                <Input
                  style={{ width: "24rem" }}
                  type="text"
                  value={softInputValue}
                  placeholder="Enter a soft skill and press enter"
                  onChange={(e) => setSoftInputValue(e.target.value)}
                  onPressEnter={handleSoftSkillInputConfirm}
                />
                <div style={{ marginTop: "8px" }}>
                  {softSkills.map((softSkill, index) => (
                    <Tag
                      style={{ marginTop: "8px" }}
                      key={softSkill}
                      closable
                      onClose={() => removeSoftSkill(softSkill)}
                    >
                      {softSkill}
                    </Tag>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <Divider className={dividerClass} />

          <Row align="center" justify="space-between">
            <Col
              span={24}
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3>Certifications</h3>
                <Button icon={<PlusOutlined />} onClick={addCertification}>
                  Add Certification
                </Button>
              </div>

              <List
                itemLayout="horizontal"
                dataSource={certifications}
                renderItem={(item, index) => (
                  <List.Item>
                    <Space
                      direction="horizontal"
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Input
                        placeholder="Certification Title"
                        value={item.title}
                        onChange={(e) =>
                          updateCertification(index, "title", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Issuing Organization"
                        value={item.issuingOrg}
                        onChange={(e) =>
                          updateCertification(
                            index,
                            "issuingOrg",
                            e.target.value
                          )
                        }
                      />
                      <DatePicker
                        placeholder="Date Obtained"
                        value={item.dateObtained}
                        onChange={(date) => {
                          updateCertification(index, "dateObtained", date);
                        }}
                      />

                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => removeCertification(item.id)}
                      ></Button>
                    </Space>
                  </List.Item>
                )}
              />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  ghost
                  onClick={() => updateUserInfo("CERTIFICATIONS")}
                >
                  Save Certifications
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
