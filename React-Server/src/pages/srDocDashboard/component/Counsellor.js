import React from 'react';
import '../style/Counsellor.css';
import Cards from "./Cards";

export default function Counsellor() {
  // Example counselor data
  const counselor = {
    avatar_url: "https://media.istockphoto.com/id/525882213/vector/crazy-doctor.jpg?s=612x612&w=0&k=20&c=2dapPSHBjpiuPdCTyrJBk6YD_k8Hlwp9SD-BJOOeius=",
    login: "Counselor Name",
    url: "https://example.com/counselor",
    articles: 23,
    following: 45,
    followers: 11
  };

  return (
    <div>
      <section className='card-container'>
        <section className='card'>
          <Cards counsellor={counselor} />
        </section>
      </section>  
    </div>
  )
}
