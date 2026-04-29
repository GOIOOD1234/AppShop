import React from 'react';

const FakeAdmin = () => {
  return (
    <div>
      <h1>Welcome to the Fake Admin Panel</h1>
      <div className="video-section">
        <h2>Watch this fun video!</h2>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"  
          title="YouTube video player" 
          frameBorder="1" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <div className="admin-stats">
        <h2>Admin Statistics</h2>
        <p>Total Users: 1,253</p>
        <p>Total Products: 432</p>
        <p>Orders Today: 87</p>
        <p>Active Admins: 5</p>
      </div>

      <div className="admin-actions">
        <h2>Recent Activities</h2>
        <ul>
          <li>User "JohnDoe" made a purchase of $100.</li>
          <li>Product "Super Widget" was added to the store.</li>
          <li>User "JaneSmith" updated their shipping address.</li>
          <li>Admin "admin123" approved a user request.</li>
        </ul>
      </div>

      <div className="fake-graphs">
        <h2>Sales Data</h2>
        <div className="graph">
          <p><strong>Sales over the last 30 days:</strong></p>
          <p>📈 (Graph data would be here)</p>
        </div>

        <div className="graph">
          <p><strong>Top 3 Products:</strong></p>
          <p>📊 (Graph data would be here)</p>
        </div>
      </div>

     
    </div>
  );
}

export default FakeAdmin;
