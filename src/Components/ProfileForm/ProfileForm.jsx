import { useState } from 'react';
import styles from './ProfileForm.module.scss';
import axios from 'axios';

export default function ProfileForm({ onProfileSaved }) {

    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity_Level, setActivityLevel] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!gender || !age || !height || !weight || !activity_Level) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/profile', {
                gender,
                age,
                height,
                weight,
                activity_Level
            }, { withCredentials: true });

            setMessage('Profile saved successfully!');
            setGender('');
            setAge('');
            setHeight('');
            setActivityLevel('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    }

    return (
        <form className={styles.profileForm} onSubmit={handleSubmit}>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <div className={styles.formGroup}>
                <label>Gender</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Age:</label>
                <input
                    type='number'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="14"
                    max="120"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Height (cm):</label>
                <input
                    type='number'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="100"
                    max="250"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Weight (kg):</label>
                <input
                    type='number'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="30"
                    max="300"
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Activity Level:</label>
                <select
                    value={activity_Level}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    required>
                    <option value="">Select your activity level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very active">Very active</option>
                </select>
            </div>

            <button type='submit' className='btn'>Save Profile</button>
        </form>
    );
}
