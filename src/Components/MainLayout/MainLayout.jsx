import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './MainLayout.module.scss';

const MainLayout = () => {
    return (
        <>
            <Header />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;
