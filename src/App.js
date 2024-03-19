import React from 'react';
import { BrowserRouter as Switch, Route, Routes } from 'react-router-dom';
import NewsletterForm from './components/NewsletterForm';
import ConfirmationPage from './components/ConfirmationPage';

function App() {
  return (
    <Routes>
      <Route path="/" exact Component={NewsletterForm} />
      <Route path="/confirmation" Component={ConfirmationPage} />
    </Routes>
  );
}

export default App;