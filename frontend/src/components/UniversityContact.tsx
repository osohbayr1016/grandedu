export default function UniversityContact() {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Холбоо барих</h2>
        <p className="text-blue-50 mb-6">
          Энэ их сургуулийн талаар дэлгэрэнгүй мэдэхийг хүсвэл бидэнтэй
          холбогдоно уу.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Дэлгэрэнгүй мэдээлэл
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
            Холбоо барих
          </button>
        </div>
      </div>
    </section>
  );
}
