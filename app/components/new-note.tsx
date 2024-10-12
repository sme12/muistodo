import { useFetcher } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function NewNote() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // Initialize state for the textarea
  const [body, setBody] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setBody("");
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <fetcher.Form action="api/new" method="post">
      <div className="grid w-full gap-2">
        <Textarea
          name="body"
          rows={8}
          value={body} // Bind to state
          onChange={(e) => setBody(e.target.value)} // Handle changes
          className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
        />
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </fetcher.Form>
  );
}
