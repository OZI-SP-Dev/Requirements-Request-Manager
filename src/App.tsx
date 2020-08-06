import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { AppHeader } from './components/AppHeader/AppHeader';
import { RequestRoutes } from './components/RequestRoutes/RequestRoutes';
import { UserProvider } from './providers/UserProvider';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { Administration } from './components/Administration/Administration';

function App() {
  initializeIcons(/* optional base url */);
  return (
    <HashRouter>
      <UserProvider>
        <Container fluid="md" className="app-container border shadow-lg p-0">
          <AppHeader />
          <Switch>
            <Route path="/Requests">
              <RequestRoutes />
            </Route>
            <Route path="/RoleManagement">
              <Administration />
            </Route>
          </Switch>
        </Container>
      </UserProvider>
    </HashRouter>
  );
}

export default App;
