export default function BusinessProfilePage({ params }: { params: { slug: string } }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Business Profile: {params.slug}</h1>
      <p>This page is ready to be built.</p>
    </div>
  );
}