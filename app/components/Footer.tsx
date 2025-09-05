import Link from 'next/link'
import {
  emailAddress,
  buildWhatsappLink,
  buildMessengerLink,
  buildInstagramDmLink,
  buildTelegramLink,
  linkedinProfileUrl,
  buildXLink,
  locationText,
} from '@/app/config/social'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-black text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Diaspora Bridge</h3>
            <p className="text-sm text-gray-400">
              Connecting Rwandan youth with diaspora mentors for guidance, growth, and opportunity.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#mission" className="hover:text-primary-500">Our Mission</Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-primary-500">How It Works</Link>
              </li>
              <li>
                <Link href="#for-mentors" className="hover:text-primary-500">For Mentors</Link>
              </li>
              <li>
                <Link href="#for-mentees" className="hover:text-primary-500">For Mentees</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              {emailAddress && (
                <li><a href={`mailto:${emailAddress}`} className="hover:text-primary-500">{emailAddress}</a></li>
              )}
              {buildWhatsappLink() && (
                <li><a href={buildWhatsappLink()} target="_blank" className="hover:text-primary-500">WhatsApp Chat</a></li>
              )}
              <li>{locationText}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Follow</h4>
            <div className="flex gap-3">
              {buildXLink() && (
                <a href={buildXLink()} target="_blank" aria-label="X" className="p-2 rounded-md bg-dark-800 hover:bg-dark-900">
                  <span className="text-accent-500">x</span>
                </a>
              )}
              {buildMessengerLink() && (
                <a href={buildMessengerLink()} target="_blank" aria-label="Messenger" className="p-2 rounded-md bg-dark-800 hover:bg-dark-900">
                  <span className="text-accent-500">fb</span>
                </a>
              )}
              {linkedinProfileUrl && (
                <a href={linkedinProfileUrl} target="_blank" aria-label="LinkedIn" className="p-2 rounded-md bg-dark-800 hover:bg-dark-900">
                  <span className="text-accent-500">in</span>
                </a>
              )}
              {buildInstagramDmLink() && (
                <a href={buildInstagramDmLink()} target="_blank" aria-label="Instagram" className="p-2 rounded-md bg-dark-800 hover:bg-dark-900">
                  <span className="text-accent-500">ig</span>
                </a>
              )}
              {buildTelegramLink() && (
                <a href={buildTelegramLink()} target="_blank" aria-label="Telegram" className="p-2 rounded-md bg-dark-800 hover:bg-dark-900">
                  <span className="text-accent-500">tg</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {year} Diaspora Bridge. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <Link href="#" className="hover:text-primary-500">Privacy</Link>
            <Link href="#" className="hover:text-primary-500">Terms</Link>
            <Link href="#" className="hover:text-primary-500">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

