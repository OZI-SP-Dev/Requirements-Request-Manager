import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { Administration } from './components/Administration/Administration';
import { AppHeader } from './components/AppHeader/AppHeader';
import { Home } from './components/Home/Home';
import { RequestRoutes } from './components/RequestRoutes/RequestRoutes';
import { useRouteParamRedirect } from './hooks/useRouteParamRedirect';
import { UserContext } from './providers/UserProvider';
import { RoleDefinitions } from './utils/RoleDefinitions';

function App() {

  initializeIcons(/* optional base url */);

  const userContext = useContext(UserContext);
  useRouteParamRedirect();

  return (
    <HashRouter>
      <Container fluid="lg" className="app-container shadow-lg p-0">
        <AppHeader />
        <Switch>
          <Route exact path="/(home)?">
            <Home />
          </Route>
          <Route path="/Requests">
            <RequestRoutes />
          </Route>
          {RoleDefinitions.userCanAccessAdminPage(userContext.roles) &&
            <Route path="/RoleManagement">
              <Administration />
            </Route>}
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Container>
    </HashRouter>
  );
}

function NoMatch() {
  return (
    <div><h1>Page not found.</h1></div>
  );
}

export default App;
