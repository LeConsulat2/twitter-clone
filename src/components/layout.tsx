import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import "../styles/layout.css";
import { useEffect, useState } from "react";

export default function Layout() {
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };
    // Check if the screen is mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // setting initial size
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">    
                    <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} isMobile={isMobile}/>
                </div>
            </header>
            
            <main className="main-content"> 
                <div className="container">
                    <Outlet />
                </div>
            </main> 

            <footer className="footer">
                <div className="container">
                    <p> {new Date().getFullYear()} Twitter Clone. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}