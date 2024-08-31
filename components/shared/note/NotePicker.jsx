"use client";

import React, { useState } from "react";
import Tiptap from "./Tiptap";

const Todo = ({ handleContentChange, content }) => {
  return (
    <div className="mt-3">
      <Tiptap
        content={content}
        onChange={(newContent) => handleContentChange(newContent)}
      />
    </div>
  );
};

export default Todo;
