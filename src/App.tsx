import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { AppHeader } from './components/AppHeader/AppHeader';
import { RequestForm } from './components/RequestForm/RequestForm';

function App() {
  return (
    <HashRouter>
      <Container className="app-container border shadow-lg p-0">
        <AppHeader />
        <Switch>
          <Route path="/Requests/new">
            <RequestForm />
          </Route>
        </Switch>
      </Container>
    </HashRouter>
  );
}

export default App;
