import styles from './Calories.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CaloriesSection() {
    const [profile, setProfile] = useState(null);
    const [progress, setProgress] = useState([]);
    const [caloriesTarget, setCaloriesTarget] = useState(0);
    const [goalWeight, setGoalWeight] = useState('');
    const [savedGoal, setSavedGoal] = useState(localStorage.getItem('goalWeight') || '');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/profile', { withCredentials: true });
                setProfile(res.data);
            } catch (err) {
                console.error('Error loading profile:', err);
            }
        };

        const fetchProgress = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/progress', { withCredentials: true });
                setProgress(res.data);
            } catch (err) {
                console.error('Error loading progress:', err);
            }
        };

        fetchProfile();
        fetchProgress();
    }, []);

    const latestWeight = progress.length > 0
        ? progress[0].weight_kg
        : null;

    const initialWeight = profile?.weight_kg || null;

    let progressPercent = 0;
    if (savedGoal && latestWeight && initialWeight) {
        const totalDiff = Math.abs(initialWeight - savedGoal);
        const currentDiff = Math.abs(latestWeight - savedGoal);
        progressPercent = 100 - (currentDiff / totalDiff) * 100;
        if (progressPercent < 0) progressPercent = 0;
        if (progressPercent > 100) progressPercent = 100;
    }

    return (
        <section className={styles.caloriesSection}>
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

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!goalWeight) return;
                        localStorage.setItem('goalWeight', goalWeight);
                        setSavedGoal(goalWeight);
                    }}
                    className={styles.goalForm}
                >
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
