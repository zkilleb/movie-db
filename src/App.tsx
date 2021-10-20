import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NotFound, AddMovie, Home, Search } from "./routes";
import { Header } from "./components";

function App() {
  return (
    <div className={"App"}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/add" component={AddMovie} exact />
          <Route path="/search" component={Search} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
