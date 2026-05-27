import CitizenSubmitForm from "@/components/reader/CitizenSubmitForm";

export const metadata = {
  title: "Submit a Story",
  description:
    "Share your story with OrbitSphere's citizen journalism desk. Our editors review every submission.",
};

export default function SubmitPage() {
  return (
    <div className="container-main py-12 max-w-2xl">
      <h1 className="font-serif text-3xl font-black text-foreground mb-2">
        Citizen Journalism
      </h1>
      <p className="font-ui text-sm text-text-muted mb-8">
        Have a story from your community? Submit it for review by our editorial
        team. We welcome eyewitness reports, local investigations, and human
        interest pieces from across Nigeria and Africa.
      </p>
      <CitizenSubmitForm />
    </div>
  );
}
