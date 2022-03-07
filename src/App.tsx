import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  NotFound,
  AddMovie,
  EditMovie,
  Home,
  Search,
  Detail,
  AllMovies,
  AllReleases,
  Stats,
} from './routes';
import { Header } from './components';
import { Search as SearchClass } from './classes';

function App() {
  const [recentSearches, setRecentSearches] = React.useState<SearchClass[]>([]);

  function callback(path: string, params: string) {
    if (
      recentSearches.filter((e) => e.path === path && e.params === params)
        .length === 0
    ) {
      setRecentSearches([...recentSearches, { path, params }].slice(-5));
    }
  }

  return (
    <div className={'App'}>
      <BrowserRouter>
        <Header callback={callback} />
        <Switch>
          <Route path="/" exact>
            <Home recentSearches={recentSearches} />
          </Route>
          <Route path="/add" component={AddMovie} exact />
          <Route path="/edit" component={EditMovie} exact />
          <Route path="/search" component={Search} />
          <Route path="/detail" component={Detail} />
          <Route path="/all-movies" component={AllMovies} />
          <Route path="/all-releases" component={AllReleases} />
          <Route path="/stats" component={Stats} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
