import React, { Component } from "react";
import "./App.css";
import Tree from "../components/tree.tsx";
import { DEFAULT_NODES } from "./constants";

export default function Home() {
  return (
      <Tree data={DEFAULT_NODES}/>
  );
}
