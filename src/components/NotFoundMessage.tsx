import Link from "next/link";
import StateMessage from "@/components/StateMessage";

export default function NotFoundMessage({
  what,
  backHref,
  backLabel,
}: {
  what: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <main className="px-6 py-14">
      <StateMessage
        pose="confused"
        title={`We cannot find that ${what}`}
        actions={
          <Link href={backHref} className="btn btn-primary">
            {backLabel}
          </Link>
        }
      >
        It may have been removed, or the link is not quite right.
      </StateMessage>
    </main>
  );
}
