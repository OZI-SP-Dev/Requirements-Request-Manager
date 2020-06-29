import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { AppHeader } from './components/AppHeader/AppHeader';
import { RequestRoutes } from './components/RequestRoutes/RequestRoutes';

function App() {
  return (
    <HashRouter>
      <Container className="app-container border shadow-lg p-0">
        <AppHeader />
        <Switch>
          <Route path="/Requests">
            <RequestRoutes />
          </Route>
        </Switch>
      </Container>
    </HashRouter>
  );
}

export default App;
