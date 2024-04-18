import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import axios from 'axios';
import { base_url } from './AppConfig';
import { Accordion, Table, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

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

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        Object.keys(usersData).forEach(courseId => {
            const course = usersData[courseId];
            const wsData = [];
            const headerRow = ['Sr. No.', 'Name', 'Email'];
            
            course.users[0].questions.forEach(question => {
                headerRow.push(question.text);
            });
            wsData.push(headerRow);

            course.users.forEach((user, index) => {
                const rowData = [index + 1, user.name, user.email];
                user.questions.forEach(question => {
                    rowData.push(question.selectedAnswer);
                });
                wsData.push(rowData);
            });

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, course.courseName);
        });

        XLSX.writeFile(wb, 'admin_report.xlsx');
    };

    return (
        <>
            <Header />
            <div className="container" id='admin-dashboard'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{color: '#333', fontSize: '22px', marginTop: '0', fontWeight: "600"}}>Admin Dashboard</h2>
                    <Button variant="success" onClick={exportToExcel} style={{
                width: "auto",
                backgroundColor: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer"
            }}
            onMouseEnter={(e) => { e.target.style.color = 'rgb(23, 33, 66)'}}
            onMouseLeave={(e) => { e.target.style.color = 'inherit'; }}
        >
                        <FontAwesomeIcon style={{
                    width: "30px",
                    height: "30px",
                    transition: "color 0.3s"
                }} icon={faFileExport} />
                    </Button>
                </div>
                {Object.keys(usersData).length > 0 && (
                    <div className="user-info bg-white">
                        <Accordion defaultActiveKey="0">
                            {Object.keys(usersData).map(courseId => (
                                <Accordion.Item key={courseId} eventKey={courseId}>
                                    <Accordion.Header>{usersData[courseId].courseName}</Accordion.Header>
                                    <Accordion.Body>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Sr.no</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    {usersData[courseId].users[0].questions.map(question => (
                                                        <th key={question._id}>{question.text}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersData[courseId].users.map((user,index) => (
                                                    <tr key={user.email}>
                                                        <td>{index+1}</td>
                                                        <td>{user.name}</td>
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
    );
};

export default AdminDashboard;
