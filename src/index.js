// import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './components/board';
const root = ReactDOM.createRoot(document.getElementById('root')); // Define root element in which we wish to add the element
root.render(
    <div height="100%">
        <h2>Kakhwal Tree</h2>
        <Board />
    </div>
) // Where in the DOM we want to add the element