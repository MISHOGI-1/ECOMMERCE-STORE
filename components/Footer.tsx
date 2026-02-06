import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GLOBAL CITY</h3>
            <p className="text-primary-200 text-sm">
              Your premier destination for men&apos;s fashion. Quality clothing and accessories for the modern man.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <FiTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <FiInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <FiYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-primary-200">
          <p>&copy; {new Date().getFullYear()} GLOBAL CITY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

