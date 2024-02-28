import { useEffect, useState } from "react";
import axios from "axios";
import { base_url, base_adobe_url } from './AppConfig';
import { Label } from "reactstrap";

export const CreateCdnCourse = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        before_you_begin: '',
        fullname: '',
        email: '',
        ldtype: '',
        specification: '',
        title: '',
        date: '',
        totalhours: ''
    });
    const userId = localStorage.getItem("userId");;
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formData).some(value => value === '')) {
            setError('All fields are required');
            return;
        }
        const dataToSend = {
            ...formData,
            user_id: parseInt(userId)
        };

        try {
            // Send POST request to the API endpoint
            const response = await axios.post(`${base_url}/cpdData`, dataToSend);
            closeModal();
        } catch (error) {
            // Handle error
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${base_adobe_url}/users/${userId}`, config);
            const { name, email } = response.data.data.attributes;
            // Update formData state with the received data
            setFormData(prevFormData => ({
                ...prevFormData,
                before_you_begin: "In order to be added to your record, all information must be completed. Please complete a separate form for each activity undertaken. For queries relating to CPD please contact learningdevelopment@macfarlanes.com.",
                fullname: name,
                email: email,
            }));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal" style={{overflow:"auto"}}>
                <span className="close" onClick={closeModal}>&times;</span>
                <h4 className="modal-heading">CPD Learning Details</h4>
                <form style={{"fontSize":"14px" ,overflow:"auto", maxHeight:"80vh"}}onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <Label style={{textAlign:"center"}}>Before you begin</Label><br/>
                    <textarea
                        name="before_you_begin"
                        style={{ marginBottom: "30px", marginTop: "-10px",height:"60px", resize: "none", minHeight: "65px"}}
                        value={formData.before_you_begin}
                        className="disabledText"
                        disabled
                    />
                    <input
                        type="text"
                        name="fullname"
                        placeholder="Full Name"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="disabledText"
                        disabled
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email Id"
                        value={formData.email}
                        onChange={handleChange}
                        className="disabledText"
                        disabled
                    />
                    <input
                        type="text"
                        name="ldtype"
                        placeholder="L&D Type"
                        value={formData.ldtype}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="specification"
                        placeholder="Specification"
                        value={formData.specification}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Title or description"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="date"
                        placeholder="Completion Date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="totalhours"
                        placeholder="Hours spent"
                        value={formData.totalhours}
                        onChange={handleChange}
                    />
                    <button  className="buttonModel" type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};
