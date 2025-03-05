export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LocationScout</h3>
            <p className="text-gray-300">
              Find and share the perfect locations for your next project.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">Home</a>
              </li>
              <li>
                <a href="/locations" className="text-gray-300 hover:text-white">Locations</a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white">About</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">
              Have questions or suggestions? Reach out to us.
            </p>
            <a 
              href="mailto:info@locationscout.example.com" 
              className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block"
            >
              info@locationscout.example.com
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {currentYear} LocationScout. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 