import React from "react";
import aboutMd from "../content/about.md?raw";
import MarkdownPage from "./MarkdownPage.jsx";

export default function About(props) {
  return <MarkdownPage {...props} filename="about.md" content={aboutMd} />;
}
