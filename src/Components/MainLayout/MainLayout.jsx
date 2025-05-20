import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './MainLayout.module.scss';
import Footer from "../Footer/Footer";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
