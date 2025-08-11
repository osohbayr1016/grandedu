import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="contact" className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-blue-700">
              GrandEdu
            </Link>
            <p className="text-gray-600 mt-3 text-sm">
              Хятадын их сургуулиудад суралцах боломжийг таньд санал болгож
              байна.
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Холбоосууд</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-700">
                  Нүүр
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-gray-600 hover:text-blue-700"
                >
                  Хөтөлбөрүүд
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-600 hover:text-blue-700"
                >
                  Мэдээ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Холбоо барих</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Имэйл: info@grandedu.mn</li>
              <li>Утас: +976 0000-0000</li>
              <li>Улаанбаатар, Монгол</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Социал</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center">
          <p>© {currentYear} GrandEdu. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="mt-2 sm:mt-0 space-x-4">
            <a href="#" className="hover:text-blue-700">
              Нууцлал
            </a>
            <a href="#" className="hover:text-blue-700">
              Үйлчилгээний нөхцөл
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
