import React, { useState, useEffect, useRef  } from 'react';

import './App.css';
import RepoList from './components/RepoList'

function App() {

  // tracking on which page we currently are
  const [page, setPage] = useState(1);
  const [repos, setRepos] = useState([]);

  // add loader refrence 
  const loader = useRef(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        
        const response = await fetch(`https://api.github.com/search/repositories?q=created:%3E2017-10-22&sort=stars&order=desc&page=${page}`);
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recentRepos = await response.json();
        setRepos(recentRepos.items)

      } catch(e) {
        console.log(e);
      }
    }
    fetchRepos();

  },[]);


  console.log(repos);
  let repoItems = <div className="loader">Loading</div>

  repoItems = repos.map(repo =>(
    <RepoList 
      key={repo.id} 
      name={repo.name} 
      issues={repo.open_issues_count} 
      avatar={repo.owner.avatar_url} 
      description={repo.description} 
      stars={repo.stargazers_count}
    />
  ))



  return (
    <div className="App">
      {repoItems}
    </div>
  );


}

export default App;
