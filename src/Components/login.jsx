import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/cube.jpg';
import profilepic from '../assets/profilepic.svg';
import '../assets/login.css';


const Login = () => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedRollNo, setSelectedRollNo] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [labOptions, setLabOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://miniprojectprintmanagement.pythonanywhere.com/api/student?roll_no=${selectedRollNo}&batch=${selectedBatch}`, {
      method: 'GET',
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Please sign up. Selected Roll No or Batch have not been registered');
        }
      })
      .then(data => {
        const userData = {
          selectedBatch,
          selectedRollNo,
          selectedLab
        };
        navigate('/student/dashboard', { state: { userData } });
      })
      .catch(error => alert(error.message));
  };

  useEffect(() => {
    if (selectedBatch) {
      fetch(`https://miniprojectprintmanagement.pythonanywhere.com/api/lab?batch=${selectedBatch}`, {
        method: 'GET',
      })
        .then(res => res.json())
        .then(data => {
          const labOptions = Object.entries(data).map(([labId, labName]) => ({
            id: labId,
            name: labName
          }));
          setLabOptions(labOptions);
        })
        .catch(error => console.log(error));
    }
  }, [selectedBatch]);

  useEffect(() => {
    fetch('https://miniprojectprintmanagement.pythonanywhere.com/api/batches')
      .then(response => response.json())
      .then(data => setBatchOptions(data))
      .catch(error => console.error('Error fetching batch options:', error));
  }, []);

  return (
    <div className="container">
      <div className='formDetails'>
        <form onSubmit={handleSubmit}>
          <img src={profilepic} alt="" className='profile' />
          <h1>LOGIN</h1>
          <div className="form-group">
            <label htmlFor="batch">Class:</label>
            <select
              value={selectedBatch}
              name="batch"
              required
              onChange={e => setSelectedBatch(e.target.value)}
            >
              <option value="">Select Batch</option>
              {batchOptions.map(batch => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="roll_no">Roll No:</label>
            <input 
              type="number"
              required 
              value={selectedRollNo}
              onChange={e => setSelectedRollNo(e.target.value)}
              name="roll_no"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lab">Lab:</label>
            <select
              value={selectedLab}
              name="lab"
              required
              onChange={e => setSelectedLab(e.target.value)}
            >
              <option value="">Select Lab</option>
              {labOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className='login'>Login</button>
          <br />
          <Link to="/student/signup" className='Signup'>Not Registered? <span>Signup</span></Link>
        </form>
        <img src={loginImage} alt="loginimage" className="login-image" />
      </div>
    </div>
  );
};

export default Login;
