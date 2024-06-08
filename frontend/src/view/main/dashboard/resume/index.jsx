import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Typography, Divider, List } from "antd";
const { Title, Paragraph, Text } = Typography;

const Resume = () => {
  const user = useSelector((state) => state.auth?.user);
  const [educationArray, setEducationArray] = useState([]);
  const [experienceArray, setExperienceArray] = useState([]);
  const resumeRef = useRef();

  const fetchEducation = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get(
        `http://localhost:3001/v1/users/education`,
        config
      );
      setEducationArray(response?.data);
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };

  const fetchExperience = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get(
        `http://localhost:3001/v1/users/experience`,
        config
      );
      setExperienceArray(response?.data);
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };

  const downloadResumeAsPDF = () => {
    // Use html2canvas to capture the content of the reference element and then generate a PDF using jsPDF
    html2canvas(resumeRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${user.name.toUpperCase()}-RESUME.pdf`);
    });
  };

  useEffect(() => {
    fetchEducation();
    fetchExperience();
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          style={{ marginBottom: "20px" }}
          type="primary"
          onClick={downloadResumeAsPDF}
        >
          Download PDF
        </Button>
      </div>
      <div
        ref={resumeRef}
        style={{
          padding: "24px",
          background: "#fff",
          minHeight: "100vh",
          borderRadius: "12px",
        }}
      >
        <div>
          <Title style={{ textAlign: "center" }}>{user?.name}</Title>
          <div
            style={{
              width: "100%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "0.5rem",
              }}
            >
              <Text>{user?.email}</Text>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "black",
                  borderRadius: "50%",
                }}
              />
              <Text>{user?.phoneNumber}</Text>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "black",
                  borderRadius: "50%",
                }}
              />
              <Text> {user?.address}</Text>{" "}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "black",
                  borderRadius: "50%",
                }}
              />
              <Text>{user?.location}</Text>
            </div>
          </div>
        </div>

        <Divider />

        {user?.summary && (
          <>
            <Title level={2} style={{ textTransform: "uppercase" }}>
              Professional Summary
            </Title>
            <Paragraph style={{ marginTop: "-4px" }}>{user?.summary}</Paragraph>
          </>
        )}

        {educationArray.length > 0 && (
          <>
            <Divider />
            <Title
              level={2}
              style={{ textTransform: "uppercase", marginBottom: "-4px" }}
            >
              Education
            </Title>
            <List
              dataSource={educationArray}
              renderItem={(education) => (
                <List.Item key={education.id}>
                  <List.Item.Meta
                    title={`${education.degree} in ${education.fieldOfStudy}`}
                    description={`${education.school} (${education.graduationYear})`}
                  />
                </List.Item>
              )}
            />
          </>
        )}

        {experienceArray.length > 0 && (
          <>
            <Divider />
            <Title
              level={2}
              style={{ textTransform: "uppercase", marginBottom: "-4px" }}
            >
              Experience
            </Title>
            <List
              dataSource={experienceArray}
              renderItem={(exp) => (
                <List.Item key={exp.id}>
                  <List.Item.Meta
                    title={exp.position}
                    description={`${exp.company} - from ${new Date(
                      exp.startDate
                    ).toLocaleDateString()} to ${new Date(
                      exp.endDate
                    ).toLocaleDateString()}`}
                  />
                </List.Item>
              )}
            />
          </>
        )}

        {user?.technicalSkills.length > 0 && (
          <>
            <Divider />
            <Title
              level={2}
              style={{ textTransform: "uppercase", marginBottom: "8px" }}
            >
              Technical Skills
            </Title>
            <Paragraph>{user?.technicalSkills.join(" | ")}</Paragraph>
          </>
        )}

        {user?.softSkills.length > 0 && (
          <>
            <Divider />
            <Title
              level={2}
              style={{ textTransform: "uppercase", marginBottom: "8px" }}
            >
              Soft Skills
            </Title>
            <Paragraph>{user?.softSkills.join(" | ")}</Paragraph>
          </>
        )}

        {user?.certifications.length > 0 && (
          <>
            <Divider />
            <Title
              level={2}
              style={{ textTransform: "uppercase", marginBottom: "-4px" }}
            >
              Certifications
            </Title>
            <List
              dataSource={user?.certifications}
              renderItem={(cert) => (
                <List.Item key={cert._id}>
                  <List.Item.Meta
                    title={cert.title}
                    description={`${cert.issuingOrg} - ${new Date(
                      cert.dateObtained
                    ).toLocaleDateString()}`}
                  />
                </List.Item>
              )}
            />
          </>
        )}

        {user?.projects.length > 0 && (
          <>
            <Divider />
            <Title
              level={2}
              style={{ textTransform: "uppercase", marginBottom: "-0px" }}
            >
              Projects
            </Title>
            <List
              dataSource={user.projects}
              renderItem={(project) => (
                <List.Item key={project._id}>
                  <List.Item.Meta
                    title={project.title}
                    description={project.description}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Resume;
