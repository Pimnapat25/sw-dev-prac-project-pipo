import NotFoundMessage from "@/components/NotFoundMessage";

export default function NotFound() {
  return (
    <NotFoundMessage what="rental request" backHref="/rentals" backLabel="Back to requests" />
  );
}
