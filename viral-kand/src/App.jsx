import React, { useState } from "react";

const App = () => {
  const [next, setNext] = useState(1);
  const [search, setSearch] = useState("");

  const videoURL = encodeURIComponent(
    `https://vk25cdn.viralkand.com/8000/897${next}.mp4`
  );

  const [video, setVideo] = useState('');

  const handleclick = ()=>{
    setVideo(search);



  }
 console.log("VIDEO URL:", videoURL);
 

 return (
    <div className="min-h-screen bg-blue-50 py-4 px-4 flex flex-col items-center">

      {/* TOP SEARCH BAR */}
      <div className="w-full max-w-2xl flex gap-3 mb-2">
        <input
          type="text"
          placeholder="enter video URL here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          
          className="flex-1 bg-white border border-blue-300 rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />

        <button
          onClick={handleclick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md active:scale-95 transition"
        >
          Search
        </button>
      </div>

        {video && (
          <div className="w-full h-115  max-w-3xl bg-white shadow-lg rounded-xl p-4">
             <video className="w-full h-110  rounded-lg"
          src={`http://localhost:3000/proxy?url=${encodeURIComponent(video)}`}
          controls
             
        />
       
      </div>
       
      )}


      {/* VIDEO PLAYER */}
      <div className="w-full h-115  max-w-3xl bg-white shadow-lg rounded-xl p-4 mt-4">
        <video
          key={next}
          src={`https://the-artist.onrender.com/proxy?url=${videoURL}`}
          controls
          className="w-full h-110  rounded-lg"
        />
      </div>
      <div className="flex gap-10 mt-5">
        <button onClick={()=>{if(next > 1) setNext(prev => prev - 1);}}
        
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md active:scale-95 transition"
      
      >Prev</button>
      <button onClick={()=>{setNext(prev => prev + 1);}}
      
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md active:scale-95 transition">Next</button>
      </div>
    </div>
  );
};

export default App;