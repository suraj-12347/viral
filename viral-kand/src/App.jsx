import React, { useState } from "react";

const App = () => {
  const [next, setNext] = useState(8974);
  const [search, setSearch] = useState("");
  const [videoURLL, setVideoURLL] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Extract video from page + Get direct MP4
  const extractVideo = async () => {
    if (!search) return;

    setLoading(true);
    setVideoURLL("");

    try {
      const res = await fetch(
        `https://the-artist.onrender.com/getvideo?url=${encodeURIComponent(search)}`
      );

      const data = await res.json();

      if (!data.video) {
        throw new Error("Video not found in page");
      }

      // Create proxy URL for streaming
      setVideoURLL(
        `https://the-artist.onrender.com/proxy?url=${encodeURIComponent(data.video)}`
      );
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  // Manual MP4 player (next/prev)
  const videoURL = encodeURIComponent(
    `https://vk25cdn.viralkand.com/8000/${next}.mp4`
  );

  return (
    <div className="min-h-screen bg-blue-50 py-4 px-4 flex flex-col items-center">

      {/* TOP SEARCH BAR */}
      <div className="w-full max-w-2xl flex gap-3 mb-2">
        <input
          type="text"
          placeholder="Enter page URL... (example: viralkand link)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-blue-300 rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />

        <button
          onClick={extractVideo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md active:scale-95 transition"
        >
          Search
        </button>
      </div>

      {/* LOADING UI */}
      {loading && (
        <p className="text-blue-600 font-semibold mt-2 animate-pulse">
          Fetching video... please wait
        </p>
      )}

      {/* EXTRACTED VIDEO PLAYER */}
      {!loading && videoURLL && (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-4 mt-4">
          <video
            className="w-full h-110 rounded-lg"
            src={videoURLL}
            controls
            autoPlay
          />
        </div>
      )}

      {/* MANUAL PLAYER (NEXT/PREV) */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-4 mt-6">
        <video
          key={next}
          src={`https://the-artist.onrender.com/proxy?url=${videoURL}`}
          controls
          className="w-full h-110 rounded-lg"
        />
      </div>

      <div className="flex gap-10 mt-5">
        <button
          onClick={() => next > 1 && setNext((prev) => prev - 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md active:scale-95 transition"
        >
          Prev
        </button>

        <button
          onClick={() => setNext((prev) => prev + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md active:scale-95 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
