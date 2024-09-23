import { useEffect, useState } from 'react';
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
            sum = previos[i][j] + next[i][j];
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
            tempFicha[j][originalFicha.length -1 - i] = originalFicha[i][j];
        }
    }
    return tempFicha;
}

const Tetris = () => {
    const [fichaMetadata, setFichaMetadata] = useState(initialFichaMetadata);

    const newFicha = (matrix) => {
        const tempX = 0;
        const tempY = 5;
        const tempMatrix = moveFicha(matrix || fichaMetadata.matrix, fichaMetadata.nextFicha, tempX, tempY, false);

        return {
            x: tempX,
            y: tempY,
            matrix: tempMatrix,
            ficha: fichaMetadata.nextFicha,
            nextFicha: getRandomFicha(),
        };
    }

    const changePosition = (prev) => {
        let tempX = prev.x;
        let tempY = prev.y;
        if (tempX + fichaMetadata.ficha.length < prev.matrix.length) {
            const tempMatrixNoFicha = moveFicha(fichaMetadata.matrix, fichaMetadata.ficha, tempX, tempY, true);
            tempX = tempX + 1;
            const tempMatrixWithFicha = moveFicha(fichaMatrix, fichaMetadata.ficha, tempX, tempY, false);
            const tempMatrix = moveFicha(tempMatrixNoFicha, fichaMetadata.ficha, tempX, tempY, false);

            const coalition = checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha);
            if (coalition) {
                return newFicha(completeLine());
            }

            return {
                ...fichaMetadata,
                x: tempX,
                y: tempY,
                matrix: tempMatrix,
            };
        } else {
            return newFicha(completeLine());
        }
    };

    const completeLine = () => {
        const matrixResult = fichaMetadata.matrix.reduce((tempMatrix, row) => {
            if (!row.every(Boolean)) {
                tempMatrix.push([...row]);
            }
            return tempMatrix;
        }, []);
        for (let i = 0; i < initialFichaMetadata.matrix.length - matrixResult.length; i++) {
            matrixResult.unshift(structuredClone(row));
        }
        return matrixResult;
    };

    const manualMovement = (movement) => {
        const tempY = fichaMetadata.y + movement;
        if (tempY >= 0 && tempY + fichaMetadata.ficha[0].length <= fichaMatrix[0].length) {
            const tempMatrixNoFicha = moveFicha(fichaMetadata.matrix, fichaMetadata.ficha, fichaMetadata.x, fichaMetadata.y, true)
            const tempMatrix = moveFicha(tempMatrixNoFicha, fichaMetadata.ficha, fichaMetadata.x, tempY, false);
            const tempMatrixWithFicha = moveFicha(fichaMatrix, fichaMetadata.ficha, fichaMetadata.x, tempY, false);
            if (!checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha)) {
                setFichaMetadata({
                    ...fichaMetadata,
                    y: tempY,
                    matrix: tempMatrix,
                });
            }
        }
    }

    const flipFicha = () => {
        const tempFicha = flip(fichaMetadata.ficha);
        const tempMatrixNoFicha = moveFicha(fichaMetadata.matrix, fichaMetadata.ficha, fichaMetadata.x, fichaMetadata.y, true);
        const tempMatrix = moveFicha(tempMatrixNoFicha, tempFicha, fichaMetadata.x, fichaMetadata.y);
        const tempMatrixWithFicha = moveFicha(fichaMatrix, fichaMetadata.ficha, fichaMetadata.x, fichaMetadata.y, false);
        if (!checkCoalition(tempMatrixNoFicha, tempMatrixWithFicha)){
            setFichaMetadata({
                ...fichaMetadata,
                ficha: tempFicha,
                matrix: tempMatrix,
            });
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFichaMetadata(prev => changePosition(prev))
        }, 500);
        return () => clearInterval(intervalId);
    }, [changePosition]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                manualMovement(1);
              } else if (event.key === 'ArrowLeft') {
                manualMovement(-1);
            } else if (event.key === ' ') { // Espacio
                flipFicha();
              }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [changePosition]);
    
    const renderItem = (col) => {
        if (col === 1) {
            return <div className='item' />
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
        <div className='game'>
            <div className='tetris'>
                <div className='matrix'>
                    { renderMatrix(fichaMetadata.matrix) }
                </div>
                <div className='controls'>
                    <button onClick={() => manualMovement(-1)}>Left</button>
                    <button onClick={() => manualMovement(1)}>Right</button>
                    <button onClick={() => flipFicha()}>Flip</button>
                </div>
            </div>
            <div className='next'>
                { renderMatrix(fichaMetadata.nextFicha) }
            </div>
        </div>
    )
}

export default Tetris;