import React from "react";

import ReactGiphySearchBox from "react-giphy-searchbox";

const App = () => (
  <ReactGiphySearchBox
    apiKey="6M3G6dvItxgbHdLZjnAUZf0q0X8sn2C4"
    onSelect={item => console.log(item)}
    masonryConfig={[
      { columns: 2, imageWidth: 110, gutter: 5 },
      { mq: "700px", columns: 3, imageWidth: 110, gutter: 5 }
    ]}
  />
);
export default ReactGiphySearchBox;
