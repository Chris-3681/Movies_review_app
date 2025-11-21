// src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-gray-700 bg-black/90 text-gray-300">
      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-4 text-sm">
        {/* Brand / About */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-white">Movies Review App</h3>
          <p className="mt-2 text-gray-400">
            A simple movie review and watchlist app.
            Browse movies, see details, and add your own.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-white mb-2">Links</h4>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:text-red-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/add" className="hover:text-red-400 transition">
                Add Movie
              </a>
            </li>
            <li>
              <a href="/watchlist" className="hover:text-red-400 transition">
                Watchlist
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="font-semibold text-white mb-2">Contact</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="mailto:githogoringash91@gmail.com"
                className="hover:text-red-400 transition"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Chris-3681"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-400 transition"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://in/chrispus-ng-ang-a-933a71260"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-400 transition"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {year} Movies Review App. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">
            Built with <span className="text-red-400">React</span> &{" "}
            <span className="text-red-400">Flask</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
