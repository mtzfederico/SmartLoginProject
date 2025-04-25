// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Global styles
import App from './App.tsx'; // Import the App component which contains the routes

// Mount the React app to the root element in your HTML
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />  {/* Render the App component */}
    </StrictMode>,
);



/*
// @ts-ignore

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Page from "./page.tsx" // your landing page
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import SwipePage from "./swipePageDir/swipePage.tsx"
import SelectionPage from "./selectionPageDir/selectionPage.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Page />} />}
                <Route path="/swipe" element={<SwipePage/>} />
                <Route path="/select" element={<SelectionPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)

 */