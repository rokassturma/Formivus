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
    const [goalType, setGoalType] = useState('');
    const [recommendationText, setRecommendationText] = useState('');


    const latestWeight = progress && progress.length > 0 ? progress[progress.length - 1].weight_kg : null;
    const initialWeight = progress && progress.length > 0 ? progress[0].weight_kg : null;

    const location = useLocation();


    useEffect(() => {
        const saved = localStorage.getItem('goalType');
        if (saved) {
            setGoalType(saved);
            setRecommendationText(getRecommendationText(saved));
        }
    }, []);

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
        }, 10000);

        setTimeout(() => {
            setNotification({ text: '', type: '', fading: false });
        }, 10000);
    }

    const progressPercent = getProgressPercent(initialWeight, latestWeight, savedGoal, goalType);

    function getProgressPercent(initialWeight, latestWeight, savedGoal, goalType) {
        if (!initialWeight || !latestWeight || !savedGoal || !goalType) return 0;

        const start = Number(initialWeight);
        const current = Number(latestWeight);
        const goal = Number(savedGoal);

        if (goalType === 'maintain') return 100;

        const totalDiff = Math.abs(start - goal);
        const progressDiff = Math.abs(current - goal);

        if (totalDiff === 0) return 100;

        let progress = 100 - (progressDiff / totalDiff) * 100;
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;

        return progress;
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

    function getRecommendationText(goalType) {
        switch (goalType) {
            case 'lose_weight':
                return "Since you chose to lose weight, it's recommended to stay in a calorie deficit and be consistent with your nutrition. Light physical activity is beneficial but not essential.";
            case 'lose_fat':
                return "To lose fat while preserving muscle, aim for a slight calorie deficit and include regular strength training.";
            case 'maintain':
                return "To maintain your current body composition, aim to match your daily calorie needs. Stay active and monitor your progress.";
            case 'gain_weight':
                return "To gain weight effectively, eat in a slight surplus and monitor your energy levels and weight weekly.";
            case 'gain_muscle':
                return "To gain muscle mass, combine a moderate calorie surplus with strength training. Consistency in both training and nutrition is key.";
            default:
                return '';
        }
    }

    useEffect(() => {
        if (goalType) {
            localStorage.setItem('goalType', goalType);
            setRecommendationText(getRecommendationText(goalType));
        }
    }, [goalType]);


    function calculateCalories(profile, goalType) {
        const gender = profile.gender;
        const height = Number(profile.height);
        const age = Number(profile.age);
        const weight = Number(latestWeight);
        const activity_level = profile.activity_level;

        if (!gender || !weight || !height || !age || !activity_level) return '...';

        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            'very active': 1.9
        };

        const activityFactor = activityFactors[activity_level] || 1.2;
        const maintenanceCalories = bmr * activityFactor;

        const goalAdjustments = {
            'lose_weight': -0.25,
            'lose_fat': -0.15,
            'maintain': 0,
            'gain_weight': 0.15,
            'gain_muscle': 0.25
        };


        const adjustment = goalAdjustments[goalType] || 0;
        return Math.round(maintenanceCalories * (1 + adjustment));
    }

    useEffect(() => {
        if (goalType && savedGoal && latestWeight) {
            const goal = Number(savedGoal);
            const current = Number(latestWeight);

            if (
                (goalType === 'gain_weight' || goalType === 'gain_muscle') &&
                goal <= current
            ) {
                showMessage("Your target weight is lower than your current weight. Please adjust your goal to match your focus.", 'error');
            }

            if (
                (goalType === 'lose_weight' || goalType === 'lose_fat') &&
                goal >= current
            ) {
                showMessage("Your target weight is higher than your current weight. Please adjust your goal to match your focus.", 'error');
            }
        }
    }, [goalType, savedGoal, latestWeight]);


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

            <div className={styles.block}>
                <div className={styles.focus}>
                    <h2>Your Focus</h2>
                    <p>Select your specific goal to receive tailored recommendations.</p>

                    <select
                        value={goalType}
                        onChange={(e) => setGoalType(e.target.value)}
                        className={styles.goalTypeSelect}
                    >
                        <option value="" disabled>-- Select your goal --</option>
                        <option value="lose_weight">Lose weight</option>
                        <option value="lose_fat">Lose fat</option>
                        <option value="maintain">Maintain</option>
                        <option value="gain_weight">Gain weight</option>
                        <option value="gain_muscle">Gain muscle</option>
                    </select>

                    {recommendationText && (
                        <p className={styles.recommendation}>{recommendationText}</p>
                    )}
                </div>

                <h2>Daily Calorie Needs</h2>
                <p>Based on your profile and progress data, we estimate your maintenance calories to be:</p>
                <span className={styles.mainValue}>
                    {profile && latestWeight ? `${calculateCalories(profile, goalType)} kcal/day` : 'Loading...'}
                </span>
            </div>

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
        </section>
    );
}
