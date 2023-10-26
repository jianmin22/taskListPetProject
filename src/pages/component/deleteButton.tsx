import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Trash2 } from "lucide-react";

const deletePost: React.FC<{ userId: string }> = ({ userId }) => {
  return (
    <div>
      <Trash2 />
    </div>
  );
};
export default deletePost;
