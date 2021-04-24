import React, { useState, useEffect, useRef  } from 'react';

import './App.css';
import RepoList from './components/RepoList'

function App() {

  // tracking on which page we currently are
  const [page, setPage] = useState(1);
  //repo pages
  const [repos, setRepos] = useState([]);
  //track when the post finishes
  const [finished, setFinished] = useState(true);

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
          setFinished(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recentRepos = await response.json();
        console.log(recentRepos);
       
        // here we simulate adding new repo to List
        const newList = repos.concat(recentRepos.items);
        setRepos(newList);

      } catch(e) {
        alert("Error trying to fetch repos, please check your internet connection and reload the page")
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

  //calculate number of days when a repo is created
  const calculateNoOfDays = (rawDate) => {
    // To set two dates to two variables
    let date1 = new Date(rawDate);
    let date2 = new Date();
      
    // To calculate the time difference of two dates
    let difference_In_Time = date2.getTime() - date1.getTime();
      
    // To calculate the no. of days between two dates
    let difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    return Math.floor(difference_In_Days);
  }

  //Format number greather than 1000 to approximately 1k
  function numFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }

  let repoItems = repos.map((repo, index) =>(
    <RepoList 
      key={repo.index} 
      name={repo.name} 
      issues={numFormatter(repo.open_issues_count)} 
      avatar={repo.owner.avatar_url} 
      description={repo.description} 
      stars={numFormatter(repo.stargazers_count)}
      interval={calculateNoOfDays(repo.created_at)}
    />
  ))



  return (
    <div className="App">
      {repoItems}
      
      {
        finished ?(
          <div className="loading text-center" ref={loader}>
            Loading
          </div> 
        ):null
      }
    </div>
  );


}

export default App;
