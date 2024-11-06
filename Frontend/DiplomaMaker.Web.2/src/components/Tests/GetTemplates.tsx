import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Endpoints } from "../../api";
import { useState } from "react";

export default function GetTemplates() {
  const [enableQuery, setEnableQuery] = useState<boolean>(false);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["templates"],
    queryFn: Endpoints.Templates.getTemplates,
    enabled: enableQuery
  });

  if (query.status == "error") {
    console.log(query.error.message);
  }

  return (
    <>
      <button onClick={() => setEnableQuery(true)}>
        GetTemplates
      </button>
      <button onClick={() => client.invalidateQueries({ queryKey: ["templates"] })}>
        Invalidate Query
      </button>
      <p>Status: {query.status}</p>
    </>
  );
}
