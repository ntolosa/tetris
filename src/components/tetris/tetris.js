import { useEffect, useState } from 'react';
import './tetris.scss';

const ficha = [
    [1, 0, 0],
    [1, 1, 1]
];

const createArray = (count, item) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(structuredClone(item));
    }
    return arr;
}

const row = createArray(10, 0);
const tetrisMatrix = createArray(15, row);

const fichaMatrix = [
    ...tetrisMatrix
];

const initialFichaMetadata = {
    x: 0,
    y: 5,
    matrix: fichaMatrix,
    ficha,
};

const moveFicha = (matrix, ficha, x, y) => {
    const tempMatrix = structuredClone(matrix);
    for (let i = 0; i < ficha.length; i++) {
        for (let j = 0; j < ficha[i].length; j++) {
            tempMatrix[i + x][j + y] = ficha[i][j];
        }
    }
    return tempMatrix;
}

const Tetris = () => {
    const [fichaMetadata, setFichaMetadata] = useState(initialFichaMetadata);

    const changePosition = (prev) => {
        let tempX = prev.x;
        let tempY = prev.y;
        if (tempX + ficha.length < prev.matrix.length) {
            tempX = tempX + 1;
            const tempMatrix = moveFicha(fichaMatrix, ficha, tempX, tempY);

            return {
                x: tempX,
                y: tempY,
                matrix: tempMatrix,
                ficha,
            };
        }
        return prev;
    }
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFichaMetadata(prev => changePosition(prev))
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);
    
    const renderItem = (col) => {
        if (col === 1) {
            return <div className='item' />
        }
    }
    const renderMatrix = () => {
        return fichaMetadata.matrix.map((row, i) => {
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
        <div className='matrix'>
            { renderMatrix() }
        </div>
    )
}

export default Tetris;