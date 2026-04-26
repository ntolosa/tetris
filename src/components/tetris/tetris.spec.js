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

    test('game renders in idle state on load with start button visible', () => {
        // Arrange
        render(<Tetris />);

        // Act
        const startButton = screen.getByTestId('start-button');

        // Assert
        expect(startButton).toBeInTheDocument();
        expect(startButton).toHaveTextContent('Iniciar');
    });

    test('game controls are not visible before start', () => {
        // Arrange
        render(<Tetris />);

        // Assert
        expect(screen.queryByTestId('pause-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('down-button')).not.toBeInTheDocument();
    });

    test('clicking start button begins the game and hides start button', () => {
        // Arrange
        render(<Tetris />);
        const startButton = screen.getByTestId('start-button');

        // Act
        fireEvent.click(startButton);

        // Assert
        expect(screen.queryByTestId('start-button')).not.toBeInTheDocument();
        expect(screen.getByTestId('pause-button')).toBeInTheDocument();
        expect(screen.getByTestId('down-button')).toBeInTheDocument();
    });

    test('pause button renders with "Pausa" label after game starts', () => {
        // Arrange
        render(<Tetris />);
        const startButton = screen.getByTestId('start-button');

        // Act
        fireEvent.click(startButton);
        const pauseButton = screen.getByTestId('pause-button');

        // Assert
        expect(pauseButton).toBeInTheDocument();
        expect(pauseButton).toHaveTextContent('Pausa');
    });

    test('clicking pause button shows overlay and changes label to "Reanudar"', () => {
        // Arrange
        render(<Tetris />);
        fireEvent.click(screen.getByTestId('start-button'));
        const pauseButton = screen.getByTestId('pause-button');

        // Act
        fireEvent.click(pauseButton);

        // Assert
        const overlay = screen.getByTestId('pause-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveTextContent('Pausado');
        expect(pauseButton).toHaveTextContent('Reanudar');
    });
});
