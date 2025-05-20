import styles from './Calories.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationMessage from '../../Components/NotificationMessage/NotificationMessage';
import { useLocation } from 'react-router-dom';


export default function CaloriesSection() {
    const [profile, setProfile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [goalWeight, setGoalWeight] = useState('');
    const [savedGoal, setSavedGoal] = useState(null);
    const [notification, setNotification] = useState({ text: '', type: '', fading: false });

    const location = useLocation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, progressRes, goalRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/profile', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/progress', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/calorie-goals', { withCredentials: true })
                ]);
                setProfile(profileRes.data);
                setProgress(progressRes.data);
                setSavedGoal(goalRes.data.goal_weight_kg);
            } catch (err) {
                showMessage('Error loading data', 'error');
                console.error(err);
            }
        };

        fetchData();
    }, [location.pathname]);

    function showMessage(text, type = 'error') {
        setNotification({ text, type, fading: false });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, fading: true }));
        }, 4500);

        setTimeout(() => {
            setNotification({ text: '', type: '', fading: false });
        }, 5000);
    }

    const latestWeight = progress && progress.length > 0 ? progress[progress.length - 1].weight_kg : null;
    const initialWeight = progress && progress.length > 0 ? progress[0].weight_kg : null;


    let progressPercent = 0;
    if (savedGoal && latestWeight && initialWeight) {
        const totalDiff = Math.abs(initialWeight - savedGoal);
        const currentDiff = Math.abs(latestWeight - savedGoal);
        progressPercent = 100 - (currentDiff / totalDiff) * 100;
        if (progressPercent < 0) progressPercent = 0;
        if (progressPercent > 100) progressPercent = 100;
    }

    const handleSaveGoal = async (e) => {
        e.preventDefault();
        if (!goalWeight) return;

        try {
            const res = await axios.post(
                'http://localhost:5000/api/calorie-goals',
                { goal_weight_kg: goalWeight },
                { withCredentials: true }
            );
            setSavedGoal(goalWeight);
            setGoalWeight('');
            showMessage(res.data.message, 'success');
        } catch (err) {
            const msg = err.response?.data?.message || 'Error saving goal';
            showMessage(msg, 'error');
        }
    };

    return (
        <section className={styles.caloriesSection}>
            {notification.text && (
                <div className="notificationWrapper">
                    <NotificationMessage
                        message={notification.text}
                        type={notification.type}
                        fading={notification.fading}
                    />
                </div>
            )}

            <h1>My Calories</h1>

            {/* 1. Info / BMR skaičiavimas */}
            <div className={styles.block}>
                <h2>Daily Calorie Needs</h2>
                <p>Based on your profile data, we estimate your maintenance calories to be:</p>
                <p className={styles.mainValue}>
                    {profile ? `${calculateCalories(profile)} kcal/day` : 'Loading...'}
                </p>
            </div>

            {/* 2. Tikslas */}
            <div className={styles.block}>
                <h2>Your Goal</h2>
                <p>Set your target weight and track your progress.</p>

                <form onSubmit={handleSaveGoal} className={styles.goalForm}>
                    <input
                        type="number"
                        placeholder="Enter target weight (kg)"
                        value={goalWeight}
                        onChange={(e) => setGoalWeight(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">Save Goal</button>
                </form>

                {savedGoal && latestWeight && (
                    <div className={styles.progressBox}>
                        <p>Current weight: <strong>{latestWeight} kg</strong></p>
                        <p>Goal weight: <strong>{savedGoal} kg</strong></p>
                        <div className={styles.progressBarWrapper}>
                            <div
                                className={styles.progressBar}
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <p>{progressPercent.toFixed(1)}% towards your goal</p>
                    </div>
                )}
            </div>

            {/* 3. Progreso sekimas */}
            <div className={styles.block}>
                <h2>Progress Tracker</h2>
                <p>Weight change compared to your initial profile.</p>
            </div>
        </section>
    );
}

function calculateCalories(profile) {
    const { gender, weight_kg, height_cm, age } = profile;
    if (!gender || !weight_kg || !height_cm || !age) return '...';

    if (gender === 'male') {
        return Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5);
    } else {
        return Math.round(10 * weight_kg + 6.25 * height_cm - 5 * age - 161);
    }
}
