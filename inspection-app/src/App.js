import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import InspectionPage from './pages/InspectionPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inspection" element={<InspectionPage />} />
          {/* Outras rotas de módulos podem ser adicionadas aqui */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;