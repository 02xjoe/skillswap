import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Swap what you can for what you need</h1>
        <p className="text-lg text-gray-600 mb-8">Post a skill, a service, or an item you can offer, find others to swap with. Build new connections and learn together.</p>
        <div className="flex justify-center gap-4">
          <Link to="/skills" className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg hover:bg-blue-700">Browse Skills</Link>
          <Link to="/register" className="px-6 py-3 rounded-lg border">Create account</Link>
        </div>
      </div>
    </section>
  )
}