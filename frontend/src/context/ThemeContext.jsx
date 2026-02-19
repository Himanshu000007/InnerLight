import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const themes = [
        { id: 'light', name: 'Light', color: '#FAFAFA' },
        { id: 'dark', name: 'Dark', color: '#1A202C' },
        { id: 'zen', name: 'Zen', color: '#EBF8F2' },
        { id: 'sunshine', name: 'Sunshine', color: '#FFFBEB' },
        { id: 'midnight', name: 'Midnight', color: '#0F172A' },
        { id: 'forest', name: 'Forest', color: '#F0F4F0' },
    ];

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};
