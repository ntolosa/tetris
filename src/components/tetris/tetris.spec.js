import { render, screen, fireEvent } from '@testing-library/react';
import Tetris from './tetris';

describe('Tetris Component', () => {
    test('renders Tetris component', () => {
        // Arrange
        render(<Tetris />);

        // Act
        const tetrisComponent = screen.getByTestId('tetris-component');

        // Assert
        expect(tetrisComponent).toBeInTheDocument();
    });

    test('pause button renders with "Pausa" label', () => {
        // Arrange
        render(<Tetris />);

        // Act
        const pauseButton = screen.getByTestId('pause-button');

        // Assert
        expect(pauseButton).toBeInTheDocument();
        expect(pauseButton).toHaveTextContent('Pausa');
    });

    test('clicking pause button shows overlay and changes label to "Reanudar"', () => {
        // Arrange
        render(<Tetris />);
        const pauseButton = screen.getByTestId('pause-button');

        // Act
        fireEvent.click(pauseButton);

        // Assert
        const overlay = screen.getByTestId('pause-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveTextContent('Pausado');
        expect(pauseButton).toHaveTextContent('Reanudar');
    });
/*
    test('moves the ficha to the right', () => {
        // Arrange
        const matrix = [[0, 0, 0], [1, 1, 1], [0, 0, 0]];
        const ficha = 'I';
        const x = 0;
        const y = 0;
        const reset = false;

        // Act
        const updatedMatrix = moveFicha(matrix, ficha, x, y, reset);

        // Assert
        expect(updatedMatrix).toEqual([[0, 0, 0], [0, 1, 1], [0, 0, 0]]);
    });

    test('checks coalition between previous and next matrix', () => {
        // Arrange
        const previousMatrix = [[0, 0, 0], [1, 1, 1], [0, 0, 0]];
        const nextMatrix = [[0, 0, 0], [0, 1, 1], [0, 0, 0]];

        // Act
        const hasCoalition = checkCoalition(previousMatrix, nextMatrix);

        // Assert
        expect(hasCoalition).toBe(true);
    });

    test('flips the original ficha', () => {
        // Arrange
        const originalFicha = [[0, 0, 0], [1, 1, 1], [0, 0, 0]];

        // Act
        const flippedFicha = flip(originalFicha);

        // Assert
        expect(flippedFicha).toEqual([[0, 1, 0], [0, 1, 0], [0, 1, 0]]);
    });

    //add a test to move the ficha down using react events to click the down button
    test('moves the ficha down', () => {
        // Arrange
        render(<Tetris />);
        const downButton = screen.getByTestId('down-button');

        // Act
        downButton.click();

        // Assert
        const updatedMatrix = screen.getByTestId('tetris-component');
        expect(updatedMatrix).toEqual([[0, 0, 0], [0, 1, 1], [0, 0, 0]]);
    });*/
});
