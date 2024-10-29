import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [tabContent, setTabContent] = useState({});

  // Static tab data with title and ID (without content since it will be fetched)
  const tabs = [
    { id: 1, tabTitle: "Tab 1", title: "Title 1" },
    { id: 2, tabTitle: "Tab 2", title: "Title 2" },
    { id: 3, tabTitle: "Tab 3", title: "Title 3" },
    { id: 4, tabTitle: "Tab 4", title: "Title 4" },
  ];
  // Function to fetch content based on tab ID
  const fetchTabContent = async (tabId) => {
    try {
      //   if (!tabContent[tabId]) {
      // Only fetch if not already cached
      const response = await fetch(
        "https://thingproxy.freeboard.io/fetch/https://loripsum.net/api/paragraphs/1"
      );
      let content = await response.text(); // API returns plain text
      content = content.replace(/<p>|<\/p>/g, ""); // Replace <p> and </p> with empty string
      // setTabContent((prevContent) => ({
      //   ...prevContent,
      //   [tabId]: content,
      // }));
      return content;
      //   }
    } catch (error) {
      console.log("see error:", error);
    }
  };

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tabContent", activeTab], // Unique query key based on tab ID
    queryFn: () => fetchTabContent(activeTab), // Fetch content for the specific activeTab
    staleTime: 1000 * 60 * 5, // Content stays fresh for 5 minutes
  });

  console.log(`see useQuery content>>>>>>>>>> ${activeTab}`, content);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // fetchTabContent(tabId); // Fetch content if not already cached
  };

  useEffect(() => {
    fetchTabContent(activeTab);
  }, []); // Empty dependency array ensures this only runs once

  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      {/* Tab navigation */}
      <div style={{ display: "flex", backgroundColor: "rgb(26,26,26)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              flex: 1,
              padding: "35px 10px",
              backgroundColor:
                activeTab === tab.id ? "rgb(7,89,122)" : "rgb(26,26,26)",
              border: "none",
              color: activeTab === tab.id ? "white" : "#B0B0B0",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "rgb(38,38,38)"; // Darker color on hover for inactive tab
                e.target.style.color = "white"; // Set text color to white on hover
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "rgb(26,26,26)"; // Reset color on mouse leave
                e.target.style.color = "#B0B0B0"; // Reset text color
              }
            }}
          >
            {tab.tabTitle}
          </button>
        ))}
      </div>

      {/* Display title and content */}
      {/* <div style={{ padding: "16px", backgroundColor: "#fff" }}>
        <h2>{tabs.find((tab) => tab.id === activeTab).title}</h2>
        <p style={{lineHeight : "40px"}}>{tabContent[activeTab] || "Loading content..."}</p>
      </div> */}
      <div style={{ padding: "16px", backgroundColor: "#fff" }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          {tabs.find((tab) => tab.id === activeTab)?.title}
        </h2>
        {isLoading ? (
          <p>Loading content...</p>
        ) : error ? (
          <p>Error loading content</p>
        ) : (
          <p style={{ lineHeight: "40px" }}>{content}</p>
        )}
      </div>
    </div>
  );
};

export default Tabs;
