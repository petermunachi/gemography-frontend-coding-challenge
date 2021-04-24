import React, { useState, useEffect, useRef  } from 'react';

import './App.css';
import RepoList from './components/RepoList'

function App() {

  // tracking on which page we currently are
  const [page, setPage] = useState(1);
  //repo pages
  const [repos, setRepos] = useState([]);

  // add loader reference 
  const loader = useRef(null);

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current)
    }

  }, []);

  
  useEffect(() => {
    async function fetchRepos() {
      try {

        let today = new Date()
        let priorDate = new Date().setDate(today.getDate()-30)
        priorDate = new Date(priorDate);
        let lastThirtyDays = priorDate.toISOString().substr(0,10);
        
        const response = await fetch(`https://api.github.com/search/repositories?q=created:%3E${lastThirtyDays}&sort=stars&order=desc&page=${page}`);
      
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recentRepos = await response.json();
       
        // here we simulate adding new repo to List
        const newList = repos.concat(recentRepos.items);
        setRepos(newList);
        
        

      } catch(e) {
        console.log(e);
      }
    }
    fetchRepos();

  },[page]);


   // here we handle what happens when user scrolls to Load More repo
   // in this case we just update page variable
    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {   
            setPage((page) => page + 1)
        }
    }

  console.log(repos);

  let repoItems = repos.map((repo, index) =>(
    <RepoList 
      key={repo.index} 
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
      <div className="loading text-center" ref={loader}>
        Loading
      </div>
    </div>
  );


}

export default App;
