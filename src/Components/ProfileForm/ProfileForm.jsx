import { useState } from 'react';
import styles from './ProfileForm.module.scss';
import axios from 'axios';

export default function ProfileForm({ profileData, onProfileSaved, showMessage }) {

  const [age, setAge] = useState(profileData?.age || '');
  const [gender, setGender] = useState(profileData?.gender || '');
  const [height, setHeight] = useState(profileData?.height || '');
  const [weight, setWeight] = useState(profileData?.weight || '');
  const [activity_level, setActivityLevel] = useState(profileData?.activity_level || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validGenders = ['male', 'female', 'other'];
    const validActivityLevels = ['sedentary', 'light', 'moderate', 'active', 'very active'];

    if (!gender || !age || !height || !weight || !activity_level) {
      if (showMessage) showMessage('Please fill in all fields.', 'error');
      return;
    }

    if (!validGenders.includes(gender)) {
      if (showMessage) showMessage('Please select a valid gender.', 'error');
      return;
    }

    if (!validActivityLevels.includes(activity_level)) {
      if (showMessage) showMessage('Please select a valid activity level.', 'error');
      return;
    }

    const payLoad = {
      gender,
      age,
      height,
      weight,
      activity_level
    };

    try {
      if (profileData) {
        await axios.put('http://localhost:5000/api/profile', payLoad, {
          withCredentials: true
        });
        if (showMessage) showMessage('Profile updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:5000/api/profile', payLoad, {
          withCredentials: true
        });
        if (showMessage) showMessage('Profile created successfully!', 'success');
      }

      setGender('');
      setAge('');
      setWeight('');
      setHeight('');
      setActivityLevel('');

      if (onProfileSaved) onProfileSaved();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong.';
      if (showMessage) showMessage(errorMsg, 'error');
    }
  };

  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
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
          value={activity_level}
          onChange={(e) => setActivityLevel(e.target.value)}
          required
        >
          <option value="" disabled>Select your activity level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very active">Very active</option>
        </select>
      </div>

      <button type='submit' className='btn-primary'>Save Profile</button>
    </form>
  );
}
