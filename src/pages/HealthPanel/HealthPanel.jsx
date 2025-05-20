import styles from './HealthPanel.module.scss';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ProductsSection from '../../Components/ProductsSection';
import NutritionPlanSection from '../../Components/NutritionPlanSection';
import MealsTrackerSection from '../../Components/MealsTrackerSection';
import MealsSection from '../../Components/MealsSection/MealsSection';
import ProgressSection from "../Progress/Progress";

export default function HealthPanel() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const defaultSection = searchParams.get('section') || 'progress';
    const [selectedSection, setSelectedSection] = useState(defaultSection);

    const renderSection = () => {
        switch (selectedSection) {
            case 'progress':
                return <ProgressSection />;
            case 'calories':
                return <CaloriesSection />;
            case 'plan':
                return <NutritionPlanSection />;
            case 'meals':
                return <MealsSection />;
            case 'meals-tracker':
                return <MealsTrackerSection />;
            default:
                return null;
        }
    };

    return (
        <main className={`main-wrapper ${styles.healthPanel}`}>
            <h1 className={styles.title}>Health Panel</h1>

            <div className={styles.selectWrapper}>
                <label htmlFor="section-select">Choose section:</label>
                <select
                    id="section-select"
                    value={selectedSection}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'home') {
                            navigate('/');
                        } else {
                            setSelectedSection(value);
                        }
                    }}
                >
                    <option value="progress">My Progress</option>
                    <option value="calories">My Calories</option>
                    <option value="products">Products</option>
                    <option value="plan">Your Nutrition Plan</option>
                    <option value="meals">Meals Tracker</option>
                    <option value="home">← Return to Home</option>
                </select>
            </div>

            <div className={styles.sectionWrapper}>
                {renderSection()}
            </div>
        </main>
    );
}
