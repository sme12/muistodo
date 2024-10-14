import ReactMarkdown from "react-markdown";

interface NoteCardProps {
  body?: string;
}

export default function NoteCard({ body }: NoteCardProps) {
  return (
    <div className="border-b p-4 bg-accent rounded-md whitespace-pre w-full text-start">
      <ReactMarkdown>{body ?? ""}</ReactMarkdown>
    </div>
  );
}
