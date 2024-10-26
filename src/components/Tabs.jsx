import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';

// const tabs = [
//     {
//         id: 1,
//         tabTitle: 'Tab 1',
//         title: 'Title 1',
//         content: 'In sint do non adipisicing incididunt excepteur sit. Voluptate esse aliqua pariatur dolor ex occaecat sunt eu. Pariatur ullamco id dolore sint proident sint nostrud nisi sit id est. Duis et excepteur cupidatat sint nisi dolore qui irure qui in id excepteur irure laboris. Pariatur mollit duis cupidatat nisi Lorem non et in dolor aliquip ea sint aute. Dolore aute duis laboris exercitation occaecat sunt. Enim veniam Lorem do ipsum aliqua qui eu ipsum consectetur ex dolore ea ipsum.'
//     },
//     {
//         id: 2,
//         tabTitle: 'Tab 2',
//         title: 'Title 2',
//         content: 'Non aliquip fugiat velit ad officia Lorem tempor cillum incididunt elit proident mollit. Reprehenderit qui nisi ut occaecat minim velit deserunt occaecat quis magna mollit. Veniam proident consectetur sunt mollit est magna Lorem voluptate enim cupidatat consequat. Et pariatur aliquip commodo nisi deserunt exercitation enim officia voluptate in nisi. Eu ea esse qui est ea pariatur nostrud non elit irure. Ad exercitation Lorem exercitation ipsum eiusmod ea duis ad mollit veniam aliquip veniam. Lorem pariatur elit ea duis.'
//     },
//     {
//         id: 3,
//         tabTitle: 'Tab 3',
//         title: 'Title 3',
//         content: 'Deserunt et elit elit ad dolor magna. Nisi amet consectetur Lorem eiusmod dolore adipisicing do reprehenderit. Voluptate consequat magna nostrud in officia labore. Minim excepteur consectetur quis nostrud nisi magna duis sunt sint qui. Fugiat ea reprehenderit eiusmod proident officia. Consequat labore qui velit Lorem consectetur incididunt ut nisi.'
//     },
//     {
//         id: 4,
//         tabTitle: 'Tab 4',
//         title: 'Title 4',
//         content: 'Minim in dolor do fugiat laborum duis labore consectetur. Amet ut sint ipsum dolor ad nostrud commodo sunt veniam enim aliquip nulla sint ullamco. Do cupidatat et quis laborum esse est commodo. Commodo sunt consectetur do consequat minim occaecat id magna ullamco consequat irure.'
//     }
// ];
// State to manage active tab and cached content

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
        const response = await fetch("https://thingproxy.freeboard.io/fetch/https://loripsum.net/api/paragraphs/1");
        let content = await response.text(); // API returns plain text
        content =  content.replace(/<p>|<\/p>/g, ''); // Replace <p> and </p> with empty string
        // setTabContent((prevContent) => ({
        //   ...prevContent,
        //   [tabId]: content,
        // }));
        return content
    //   }
    } catch (error) {
      console.log("see error:", error);
    }
  };

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["tabContent", activeTab],  // Unique query key based on tab ID
    queryFn: () => fetchTabContent(activeTab),  // Fetch content for the specific activeTab
    staleTime: 1000 * 60 * 5, // Content stays fresh for 5 minutes
  });
  

console.log(`see useQuery content>>>>>>>>>> ${activeTab}`, content)


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
              padding: "35px 40px",
              backgroundColor:
                activeTab === tab.id ? "rgb(7,89,122)" : "rgb(26,26,26)",
              border: "none",
              color: "white",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "rgb(38,38,38)"; // Darker color on hover for inactive tab
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.backgroundColor = "rgb(26,26,26)"; // Reset color on mouse leave
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
        <h2>{tabs.find((tab) => tab.id === activeTab)?.title}</h2>
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
  //   <div className="container">{/* TODO Add tabs here */}</div>;
};

export default Tabs;
