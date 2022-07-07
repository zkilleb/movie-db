import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
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
      <Header callback={callback} />
      <Routes>
        <Route path="/" element={<Home recentSearches={recentSearches} />} />
        <Route path="/add" element={<AddMovie />} />
        <Route path="/edit" element={<EditMovie />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/all-movies" element={<AllMovies />} />
        <Route path="/all-releases" element={<AllReleases />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
