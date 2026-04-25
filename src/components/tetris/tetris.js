import { useCallback, useEffect, useState } from 'react';
import './tetris.scss';
import fichas from '../../constants/fichas';

const getRandomFicha = () => {
    const fichaId = Math.floor(Math.random() * fichas.length)
    return fichas[fichaId];
}
const ficha = getRandomFicha();

const createArray = (count, item) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(structuredClone(item));
    }
    return arr;
}

const row = createArray(10, 0);
const tetrisMatrix = createArray(20, row);

const fichaMatrix = [
    ...tetrisMatrix
];

const initialFichaMetadata = {
    x: 0,
    y: 5,
    matrix: fichaMatrix,
    ficha,
    nextFicha: getRandomFicha(),
};

const moveFicha = (matrix, ficha, x, y, reset) => {
    const tempMatrix = structuredClone(matrix);
    for (let i = 0; i < ficha.length; i++) {
        for (let j = 0; j < ficha[i].length; j++) {
            if (reset) {
                tempMatrix[i + x][j + y] = 0;
            } else {
                tempMatrix[i + x][j + y] = ficha[i][j] || tempMatrix[i + x][j + y];
            }
        }
    }
    return tempMatrix;
}

const checkCoalition = (previos, next) => {
    let sum = 0;
    for (let i = 0; i < previos.length; i++) {
        for (let j = 0; j < previos[i].length; j++) {
            const prevValue = previos[i][j] !== 0 ? 1 : 0;
            const nextValue = next[i][j] !== 0 ? 1 : 0;
            sum = prevValue + nextValue;
            if (sum > 1) {
                return true;
            }
        }
    }
    return false;
}

const flip = (originalFicha) => {
    const newRow = createArray(originalFicha.length, 0);
    const tempFicha = createArray(originalFicha[0].length, newRow);
    for (let i = 0; i < originalFicha.length; i++) {
        for (let j = 0; j < originalFicha[0].length; j++) {
            tempFicha[j][originalFicha.length - 1 - i] = originalFicha[i][j];
        }
    }
    return tempFicha;
}

const Tetris = () => {
    const [fichaMetadata, setFichaMetadata] = useState(initialFichaMetadata);
    const [isEndGame, setIsEndGame] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const togglePause = useCallback(() => {
        if (!isEndGame) {
            setIsPaused(prev => !prev);
        }
    }, [isEndGame]);

    const newFicha = (prev, matrix) => {
        const tempX = 0;
        const tempY = 5;
        const tempMatrix = moveFicha(matrix || prev.matrix, prev.nextFicha, tempX, tempY, false);

        return {
            x: tempX,
            y: tempY,
            matrix: tempMatrix,
            ficha: prev.nextFicha,
            nextFicha: getRandomFicha(),
        };
    }

    const completeLine = (prev) => {
        const matrixResult = prev.matrix.reduce((tempMatrix, row) => {
            if (!row.every(Boolean)) {
                tempMatrix.push([...row]);
            }
            return tempMatrix;
        }, []);
        while (matrixResult.length < initialFichaMetadata.matrix.length) {
            matrixResult.unshift(structuredClone(row));
        }
        return matrixResult;
    };

    const changePosition = useCallback((prev) => {
        let tempX = prev.x;
        let tempY = prev.y;
        if (tempX + prev.ficha.length < prev.matrix.length) {
            const tempMatrixNoFicha = moveFicha(prev.matrix, prev.ficha, tempX, tempY, true);
            tempX = tempX + 1;
            const tempMatrixWithFicha = moveFicha(fichaMatrix, prev.ficha, tempX, tempY, false);
            const tempMatrix = moveFicha(tempMatrixNoFicha, prev.ficha, tempX, tempY, false);

            const coalition = checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha);
            if (coalition) {
                const fichaToRender = moveFicha(fichaMatrix, prev.ficha, 0, 5);
                if (checkCoalition(tempMatrixWithFicha, fichaToRender)) {
                    setIsEndGame(true);
                }
                return newFicha(prev, completeLine(prev));
            }

            return {
                ...prev,
                x: tempX,
                y: tempY,
                matrix: tempMatrix,
            };
        } else {
            return newFicha(prev, completeLine(prev));
        }
    }, []);

    const manualMovement = useCallback((movement) => {
        setFichaMetadata(prev => {
            const tempY = prev.y + movement;
            if (tempY >= 0 && tempY + prev.ficha[0].length <= fichaMatrix[0].length) {
                const tempMatrixNoFicha = moveFicha(prev.matrix, prev.ficha, prev.x, prev.y, true)
                const tempMatrix = moveFicha(tempMatrixNoFicha, prev.ficha, prev.x, tempY, false);
                const tempMatrixWithFicha = moveFicha(fichaMatrix, prev.ficha, prev.x, tempY, false);
                if (!checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha)) {
                    return {
                        ...prev,
                        y: tempY,
                        matrix: tempMatrix,
                    };
                }
            }
            return prev;
        });
    }, []);

    const manualMovementVertical = useCallback((movement) => {
        setFichaMetadata(prev => {
            const tempX = prev.x + movement;
            if (tempX >= 0 && tempX + prev.ficha.length <= fichaMatrix.length) {
                const tempMatrixNoFicha = moveFicha(prev.matrix, prev.ficha, prev.x, prev.y, true)
                const tempMatrix = moveFicha(tempMatrixNoFicha, prev.ficha, tempX, prev.y, false);
                const tempMatrixWithFicha = moveFicha(fichaMatrix, prev.ficha, tempX, prev.y, false);
                if (!checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha)) {
                    return {
                        ...prev,
                        x: tempX,
                        matrix: tempMatrix,
                    };
                }
            }
            return prev;
        });
    }, []);

    const flipFicha = useCallback(() => {
        setFichaMetadata(prev => {
            if (prev.ficha.length + prev.y > prev.matrix[0].length) {
                return prev;
            }
            const tempFicha = flip(prev.ficha);
            const tempMatrixNoFicha = moveFicha(prev.matrix, prev.ficha, prev.x, prev.y, true);
            const tempMatrix = moveFicha(tempMatrixNoFicha, tempFicha, prev.x, prev.y);
            const tempMatrixWithFicha = moveFicha(fichaMatrix, prev.ficha, prev.x, prev.y, false);
            if (!checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha)) {
                return {
                    ...prev,
                    ficha: tempFicha,
                    matrix: tempMatrix,
                };
            }
            return prev;
        });
    }, []);

    useEffect(() => {
        if (isEndGame || isPaused) {
            return;
        }
        const intervalId = setInterval(() => {
            setFichaMetadata(prev => changePosition(prev))
        }, 500);
        return () => clearInterval(intervalId);
    }, [changePosition, isEndGame, isPaused]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
                togglePause();
                return;
            }
            if (isPaused) return;
            if (event.key === 'ArrowRight') {
                manualMovement(1);
            } else if (event.key === 'ArrowLeft') {
                manualMovement(-1);
            } else if (event.key === 'ArrowDown') {
                manualMovementVertical(1);
            } else if (event.key === ' ') { // Espacio
                flipFicha();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [manualMovement, manualMovementVertical, flipFicha, isPaused, togglePause]);

    const renderItem = (col) => {
        if (col !== 0) {
            return <div className='item' style={{ backgroundColor: col }} />
        }
    }
    const renderMatrix = (matrix) => {
        return matrix.map((row, i) => {
            return <div key={i} className="row">
                {
                    row.map((col, j) => (<div key={j} className="col">
                        {
                            renderItem(col)
                        }
                    </div>))
                }
            </div>
        });
    };
    return (
        <div className='game' data-testid="tetris-component">
            <div className='tetris'>
                <div className='matrix'>
                    {renderMatrix(isPaused ? fichaMatrix : fichaMetadata.matrix)}
                    {isPaused && (
                        <div className='pause-overlay' data-testid="pause-overlay">Pausado</div>
                    )}
                </div>
                <div className='controls'>
                    <div className='controls__pause'>
                        <button data-testid="pause-button" onClick={togglePause} disabled={isEndGame}>
                            {isPaused ? 'Reanudar' : 'Pausa'}
                        </button>
                    </div>
                    <div className='controls__movement'>
                        <div className='controls_row'>
                            <button onClick={() => !isPaused && manualMovement(-1)}>Left</button>
                            <button onClick={() => !isPaused && manualMovement(1)}>Right</button>
                        </div>
                        <div className='controls__row'>
                            <button data-testid="down-button" onClick={() => !isPaused && manualMovementVertical(1)}>Down</button>
                        </div>
                    </div>
                    <div className='controls__flip'>
                        <button onClick={() => !isPaused && flipFicha()}>Flip</button>
                    </div>
                </div>
            </div>
            <div className='next'>
                {!isPaused && renderMatrix(fichaMetadata.nextFicha)}
            </div>
        </div>
    )
}

export default Tetris;