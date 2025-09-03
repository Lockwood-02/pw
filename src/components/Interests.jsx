import React from "react";
import interestsMd from "../content/interests.md?raw";
import MarkdownPage from "./MarkdownPage.jsx";

export default function Interests(props) {
  return (
    <MarkdownPage {...props} filename="interests.md" content={interestsMd} />
  );
}
