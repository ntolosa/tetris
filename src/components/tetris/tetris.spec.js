import { render, screen } from '@testing-library/react';
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
});
