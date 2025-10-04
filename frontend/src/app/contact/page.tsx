import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Холбоо барих
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Бидэнтэй холбогдож, Хятадад суралцах талаар зөвлөгөө аваарай.
            Манай мэргэжилтнүүд танд туслахад бэлэн байна.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
