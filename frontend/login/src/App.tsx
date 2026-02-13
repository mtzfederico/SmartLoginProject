import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page from './page.tsx';
import SwipePage from './swipePageDir/swipePage.tsx';
import SelectionPage from './selectionPageDir/selectionPage.tsx';
import CoursePage from './courseSelectionPageDir/courseSelectionPage.tsx';
import CourseHome from './courseSelectionPageDir/courseHome.tsx';
import CourseRecords from './courseSelectionPageDir/courseRecords.tsx';
import CourseRedirect from './courseSelectionPageDir/courseRedirect.tsx';
import Layout from './Layout.tsx'; 
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Routes without navbar */}
                <Route path="/" element={<Page />} />

                {/* Routes WITH navbar */}
                <Route element={<Layout />}>
                <Route path="/swipe" element={<SwipePage />} />
                <Route path="/selection" element={<SelectionPage />} />
                <Route path="/redirect" element={<CourseRedirect />} />
                <Route path="/course-selection" element={<CoursePage />} />
                <Route path="/course-home" element={<CourseHome />} />
                <Route path="/course-records" element={<CourseRecords />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

