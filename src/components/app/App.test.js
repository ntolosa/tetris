// create test for the App.js file using the arrange, act and assert pattern
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('../tetris/tetris', () => {
    return function MockTetris() {
        return <div data-testid="tetris-component" />;
    };
});

describe('App Component', () => {
    test('renders App component', () => {
        // Arrange
        render(<App />);

        // Act
        const appComponent = screen.getByTestId('app');

        // Assert
        expect(appComponent).toBeInTheDocument();
    });

    test('renders Tetris component inside App', () => {
        // Arrange
        render(<App />);

        // Act
        const tetrisComponent = screen.getByTestId('tetris-component');

        // Assert
        expect(tetrisComponent).toBeInTheDocument();
    });
}
);
