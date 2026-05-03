import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';

// Mocks
jest.mock('react-dom/client', () => ({
    createRoot: jest.fn(),
}));

jest.mock('./components/app/App', () => {
    return function MockApp() {
        return <div data-testid="mock-app">App</div>;
    };
});

jest.mock('./reportWebVitals', () => jest.fn());

describe('index.js', () => {
    let mockRender;

    beforeEach(() => {
        // Arrange
        mockRender = jest.fn();
        ReactDOM.createRoot.mockReturnValue({
            render: mockRender,
        });
        
        // Ensure that the document body has the root element
        const rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        jest.resetModules();
    });

    test('renders App inside React.StrictMode and calls reportWebVitals', () => {
        // Act
        // By requiring the file, the code inside it executes
        require('./index.js');

        // Assert
        const rootElement = document.getElementById('root');
        
        expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);
        expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

        expect(mockRender).toHaveBeenCalledTimes(1);
        // We can't strictly match the JSX node, but we know it's a StrictMode with App inside
        expect(mockRender).toHaveBeenCalledWith(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );

        expect(reportWebVitals).toHaveBeenCalledTimes(1);
    });
});
