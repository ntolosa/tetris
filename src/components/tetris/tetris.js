import { useEffect, useState } from 'react';
import './tetris.scss';

const ficha = [[1]];

const tetrisMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const fichaMatrix = [
    ...tetrisMatrix
];

const initialFichaMetadata = {
    x: 0,
    y: 5,
    matrix: fichaMatrix,
    ficha,
};

const Tetris = () => {
    const [fichaMetadata, setFichaMetadata] = useState(initialFichaMetadata);

    const changePosition = (prev) => {
        let tempX = prev.x;
        let tempY = prev.y;
        if (tempX < prev.matrix.length - 1) {
            let tempMatrix = prev.matrix;
            tempMatrix[tempX][tempY] = 0;
            tempX = tempX + 1;
            tempMatrix[tempX][tempY] = 1;

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