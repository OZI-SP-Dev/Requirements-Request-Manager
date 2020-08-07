import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { Administration } from './components/Administration/Administration';
import { AppHeader } from './components/AppHeader/AppHeader';
import { RequestRoutes } from './components/RequestRoutes/RequestRoutes';
import { UserContext } from './providers/UserProvider';
import { RoleDefinitions } from './utils/RoleDefinitions';

function App() {

  initializeIcons(/* optional base url */);

  const userContext = useContext(UserContext);

  return (
    <HashRouter>
      <Container fluid="md" className="app-container border shadow-lg p-0">
        <AppHeader />
        <Switch>
          <Route path="/Requests">
            <RequestRoutes />
          </Route>
          {RoleDefinitions.userCanAccessAdminPage(userContext.roles) &&
            <Route path="/RoleManagement">
              <Administration />
            </Route>}
        </Switch>
      </Container>
    </HashRouter>
  );
}

export default App;
