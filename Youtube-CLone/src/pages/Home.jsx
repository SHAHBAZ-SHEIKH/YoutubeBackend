import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between; /* To ensure equal spacing between cards */
`;

const CardWrapper = styled.div`
  flex-basis: calc(33.33% - 10px); /* 3 cards per row, adjusting for the gap */
  margin-bottom: 10px;
  @media (max-width: 768px) {
    flex-basis: calc(50% - 10px); /* 2 cards per row on smaller screens */
  }
  @media (max-width: 480px) {
    flex-basis: 100%; /* 1 card per row on mobile screens */
  }
`;


const Home = ({type}) => {

  const [videos,setVideos]=useState([]);

  useEffect(()=>{
    const fetchVideos=async()=>{
      try {
        const res = await axios.get(`http://localhost:8800/api/videos/${type}`);
        console.log("res.data",res.data)
      setVideos(res.data)
      
      } catch (error) {
        console.log(error)
        
      }
      
      
    }
    fetchVideos()

  },[type])


    return (
      <Container>
        {
          videos.map((video)=>{
            
            
            return <CardWrapper key={video._id}><Card type={type} key={video._id} video={video}  /></CardWrapper>
          })
        }
        
      </Container>
    );
  };
  
  export default Home;
  
