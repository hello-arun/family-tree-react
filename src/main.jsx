// import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './components/board';
const root = ReactDOM.createRoot(document.getElementById('root')); // Define root element in which we wish to add the element
root.render(
    <div className='main grid-container'>
        <div className='grid-item-header'>
            <p className='title centered-text'>
                Family Tree
            </p>
        </div>
        <Board />
        <div className="grid-item-footer">
            <div className="contact-info">
                <div>
                    © Arun 2022
                    <br />
                    <a
                        href="https://github.com/hello-arun"
                        className="links"
                    >
                        GitHub
                    </a>{" "}
                    <a href="https://twitter.com/jangirarun786">
                        Twitter
                    </a>{" "}
                    <a href="https://www.linkedin.com/in/arun-jangir-ba0921220/">
                        LinkedIn
                    </a>{" "}
                    <a href="mailto:jangirarun786@gmail.com">E-mail</a>
                </div>
            </div>
        </div>
    </div>
) // Where in the DOM we want to add the element