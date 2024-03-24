import React from "react";
import "../style/Cards.css";

export default function Cards({ counsellor }) {
  return (
    <div className="container">
      <div className="card_item">
        <div className="card_inner">
          <img src={counsellor.avatar_url} alt="avatar" />
          <div className="userName">{counsellor.login}</div>
          <div className="userUrl">{counsellor.url}</div>
          <div className="detail-box">
            <div className="gitDetail">
              <span>Articles</span>
              23
            </div>
            <div className="gitDetail">
              <span>Following</span>
              45
            </div>
            <div className="gitDetail">
              <span>Followers</span>
              11
            </div>
          </div>
          <button className="seeMore">See More</button>
        </div>
      </div>
    </div>
  );
}
