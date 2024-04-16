import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import axios from 'axios';
import { base_url } from './AppConfig';
import { Accordion, Table } from 'react-bootstrap';

const AdminDashboard = () => {
    const [usersData, setUsersData] = useState({});

    useEffect(() => {
        fetchAdminReport();
    }, []);

    const fetchAdminReport = async () => {
        try {
            const response = await axios.get(`${base_url}/getCoursesWithQuestions`);
            setUsersData(response.data);
        } catch (error) {
            console.error('Error fetching admin report:', error);
        }
    };

    return (
        <>
        
        <Header />
        <div className="container">
            <h2>Admin Dashboard</h2>
            {Object.keys(usersData).length > 0 && (
                <div className="user-info" style={{ marginTop: "10px" }}>
                    <Accordion defaultActiveKey="0">
                        {Object.keys(usersData).map(courseId => (
                            <Accordion.Item key={courseId} eventKey={courseId}>
                                <Accordion.Header>{usersData[courseId].courseName}</Accordion.Header>
                                <Accordion.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                {usersData[courseId].users[0].questions.map(question => (
                                                    <th key={question._id}>{question.text}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersData[courseId].users.map(user => (
                                                <tr key={user.email}>
                                                    <td>{user.email}</td>
                                                    {user.questions.map(question => (
                                                        <td key={question._id}>{question.selectedAnswer}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
        </>
    )
}

export default AdminDashboard;
