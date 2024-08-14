import React, { useState, useEffect } from 'react';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import '../assets/dashboard.css';
import profilepic from '../assets/profilepic.svg';
import { FileUploader } from "./FileUploader.jsx";
import backgroundImage from '../assets/printer.jpg';

const Dashboard = () => {
    const location = useLocation();
    const { userData } = location.state || {};

    const [selectedFile, setSelectedFile] = useState('');
    const [selectedExp, setSelectedExp] = useState('');
    const [response, setResponse] = useState('');
    const [responseRecieved, setResponseRecieved] = useState(false);
    const [data, setData] = useState([]);
    const [selectedExpName, setSelectedExpName] = useState(''); // State to store selectedExpName 
    const [filebool, setFilebool] = useState(false);

    const selectedBatch = userData?.selectedBatch;
    const selectedRollNo = userData?.selectedRollNo;
    const selectedLab = userData?.selectedLab;
    const loadData = () => {
        if (selectedBatch && selectedRollNo && selectedLab) {
            fetch(`https://miniprojectprintmanagement.pythonanywhere.com/api/exp?batch=${selectedBatch}&roll_no=${selectedRollNo}&lab_id=${selectedLab}`, {
                method: 'GET',
            })
                .then(res => res.json())
                .then(data => {
                    const expOptions = Object.entries(data).map(([expId, expName]) => ({
                        id: expId,
                        name: expName
                    }));
                    setData(expOptions);
                })
                .then(() => setResponseRecieved(true))
                .catch(error => console.log(error));
        } else {
            console.log("No local data fetched");
        }
    }
    useEffect(loadData, [selectedBatch, selectedRollNo, selectedLab]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('batch', selectedBatch);
        formData.append('roll_no', selectedRollNo);
        formData.append('lab_id', selectedLab);
        formData.append('exp_id', selectedExp);
        formData.append('file', selectedFile);

        fetch('https://miniprojectprintmanagement.pythonanywhere.com/api/file', {
            method: 'POST',
            body: formData
        })
            .then(res => {
                if (res.ok) {
                    setResponse(res.statusText);
                } else {
                    return res.json().then(error => {
                        throw new Error(error.message);
                    });
                }
            })
            .then(() => setFilebool(false))
            .then(loadData)
            .catch(error => alert(error.message));
    };

    const DragDrop = ({ exp }) => {
        const [fileName, setFileName] = useState("");
        const handleFile = (file) => {
            setSelectedFile(file);
            setFileName(file.name);
            setSelectedExp(exp.id);
            setSelectedExpName(exp.name.exp_name);
            setFilebool(true);
        };
        return (
            <div className="file-uploader">
                <FileUploader handleFile={handleFile} />
            </div>
        );
    };

    return (
        <>
            {filebool && (
                <div className='confirm'>
                    <h2>Are you sure you want to upload this {selectedFile.name} as {selectedExpName}?</h2>
                    <button className='yes' onClick={handleSubmit}>Yes</button>
                    <button className='no' onClick={() => setFilebool(false)}>No</button>
                </div>
            )}
            <div className='dash-whole' style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="container-dashboard">
                    <div className="nav">
                        <h1 className='headertext'>Dash<span>board</span></h1>
                        <div className='logout'>
                            <Link to="/student/login">Logout</Link>
                        </div>
                    </div>
                    
                    <table>
                        <thead className='table_head'>
                            <tr>
                                <th className='head'>Experiment</th>
                                <th className='head'>Upload status</th>
                                <th className='head'>Print Status</th>
                            </tr>
                        </thead>
                        <tbody className='table_body'>
                            {data.map(exp => (
                                <tr key={exp.id}>
                                    <td>{exp.name.exp_name}</td>
                                    <td>
                                        {exp.name.uploaded ? (
                                            <a href={"#" + exp.name.url}>Uploaded</a>
                                        ) : (
                                            <div>
                                                <DragDrop exp={exp} />
                                            </div>
                                        )}
                                    </td>
                                    <td>{exp.name.printed ? 'Printed' : 'Not Printed'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
