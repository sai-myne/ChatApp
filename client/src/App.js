import "./App.scss";
import { Container } from 'react-bootstrap';
import Register from "./pages/Register";
import ApolloProvider from "./ApolloProvider";
import { BrowserRouter, Switch} from 'react-router-dom'
import Home from "./pages/Home";
import Login from "./pages/Login";

import { AuthProvider } from "./content/auth";
import DynamicRoute from "./util/DynamicRoute";

function App() {
  
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <DynamicRoute path="/register" component={Register} guest/>
              <DynamicRoute exact path="/" component={Home} authenticated/>
              <DynamicRoute path="/login" component={Login} guest/>
            </Switch>
            
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
    
  );
}

export default App;
