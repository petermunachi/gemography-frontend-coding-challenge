import React from 'react';

import '../App.css';

function RepoList(props) {


  return (
    <div className="mt-3">

      <div className="repo-list-container card d-flex ">
  
        <div className="avatar-container">
          <img src={props.avatar} alt="" width="100" height="100" />
        </div>
        <div className="desc-container">
          <h1 className="header-primary">{props.name}</h1>
          <p className="description">{props.description}</p>
  
          <div className="d-flex ml-1 mt-3">
            <div className="box">
              Stars: <b>{props.stars}</b>
            </div>
            <div className="box pr-1">
              Issues: <b>{props.issues}</b>
            </div>
            <div className="interval-container pr-1">
              Submitted {props.interval} days ago by <b>{props.name}</b>
            </div>
          </div>
  
        </div>
        
      </div>
    
    </div>
  
  );


}

export default RepoList;
