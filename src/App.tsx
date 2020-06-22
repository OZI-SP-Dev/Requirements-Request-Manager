import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { AppHeader } from './AppHeader/AppHeader';
import { RequestForm } from './components/RequestForm/RequestForm';

function App() {
  return (
    <Container className="App">
      <AppHeader />
      <HashRouter>
        <Switch>
          <Route path="/Requests/new">
            <RequestForm />
          </Route>
        </Switch>
      </HashRouter>
    </Container>
  );
}

export default App;
