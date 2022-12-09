// import React from 'react';
import ReactDOM from "react-dom/client";
import Board from "./components/board";
const root = ReactDOM.createRoot(document.getElementById("root"));
import Footer from "./components/footer";
root.render(
    <div className="grid-container main">
        <div className="grid-item header bg-dark">
            <div className="centered-text big-font centered-div">
                Family Tree
            </div>
        </div>
        <div className="grid-item grid-container board">
            <Board />
        </div>
        <div className="grid-item footer bg-dark">
            <Footer />
        </div>
        {/* <div className='grid-item-header'>
            <p className='title centered-text'>
                Family Tree
            </p>
        </div>
        <Board />
        <div className="grid-item-footer">
            
        </div> */}
    </div>
); // Where in the DOM we want to add the element
