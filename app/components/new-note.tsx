import { useActionData, useFetcher } from "@remix-run/react";

import { action } from "~/routes/api.new";

export default function NewNote() {
  const actionData = useActionData<typeof action>();
  console.log(actionData);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  console.log(isSubmitting);

  return (
    <fetcher.Form action="api/new" method="post">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span className="">New note?</span>
          <textarea
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          disabled={isSubmitting}
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          {isSubmitting ? "Loading..." : "Save"}
        </button>
      </div>
    </fetcher.Form>
  );
}
