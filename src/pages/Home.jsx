/**
 * pages/Home.jsx
 * -----------------------------------------------------------------------
 * Landing page. Communicates the platform's purpose and gets citizens
 * to the Report page or authorities to the Dashboard as fast as
 * possible.
 */

import { Link } from 'react-router-dom'
import { ShieldAlert, Siren, Brain, Map, ImageIcon, Zap, ArrowRight, Flame, Waves, Mountain, Wind, TriangleAlert } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'NLP Disaster Classification',
    description: 'Trained TF-IDF + Naive Bayes pipeline reads citizen reports and identifies the disaster type in milliseconds.',
  },
  {
    icon: Zap,
    title: 'Autonomous Triage Engine',
    description: 'Severity and priority are computed instantly from incident metrics, so the most critical cases surface first.',
  },
  {
    icon: ImageIcon,
    title: 'Image-Based Detection',
    description: 'Upload a photo of the scene and computer vision flags fire, flood, earthquake damage, and more.',
  },
  {
    icon: ShieldAlert,
    title: 'Generative AI Guidance',
    description: 'Gemini-powered assistant generates safety instructions and rescue recommendations tailored to the disaster.',
  },
  {
    icon: Map,
    title: 'Live Incident Map',
    description: 'Every report plots on an OpenStreetMap view so responders can see the geographic shape of an unfolding event.',
  },
  {
    icon: Siren,
    title: 'Real-Time Dashboard',
    description: 'Authorities track total reports, critical cases, and active emergencies with live charts and statistics.',
  },
]

const DISASTER_TYPES = [
  { icon: Flame, label: 'Fire' },
  { icon: Waves, label: 'Flood' },
  { icon: TriangleAlert, label: 'Earthquake' },
  { icon: Wind, label: 'Cyclone' },
  { icon: Mountain, label: 'Landslide' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-600">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-signal animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-cobalt animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-800 border border-ink-600 text-xs font-medium text-mist-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
              AI models active · monitoring incoming reports
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-mist-100 leading-[1.05] tracking-tight mb-6">
              Every second counts.
              <br />
              <span className="text-signal">AI</span> decides what comes first.
            </h1>

            <p className="text-lg text-mist-300 leading-relaxed mb-9 max-w-2xl">
              DisasterAI turns a citizen's plain-language report into a classified,
              prioritized emergency case in under a second — combining NLP,
              computer vision, and generative AI to help responders triage
              faster than ever.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/report" className="btn-primary !px-6 !py-3 text-base">
                Report an Emergency <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard" className="btn-secondary !px-6 !py-3 text-base">
                View Live Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 flex-wrap">
              {DISASTER_TYPES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-mist-400">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline strip */}
      <section className="border-b border-ink-600 bg-ink-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            {[
              { step: '01', label: 'Citizen submits report' },
              { step: '02', label: 'AI classifies & scores severity' },
              { step: '03', label: 'Case routed by priority' },
              { step: '04', label: 'Authority dispatches response' },
            ].map((item) => (
              <div key={item.step}>
                <div className="font-mono text-signal text-sm mb-1">{item.step}</div>
                <div className="text-sm text-mist-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-xl mb-12">
          <h2 className="font-display font-bold text-3xl text-mist-100 mb-3">
            One platform, four AI systems
          </h2>
          <p className="text-mist-400">
            Every report runs through a coordinated pipeline of machine learning,
            computer vision, and generative AI models before it ever reaches a human.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="card p-6 hover:border-ink-500 transition-colors">
              <div className="w-11 h-11 rounded-lg bg-ink-700 border border-ink-600 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-signal" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-mist-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-mist-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-600 bg-ink-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-mist-100 mb-4">
            See something dangerous? Report it now.
          </h2>
          <p className="text-mist-400 mb-7 max-w-lg mx-auto">
            No account needed. Describe what's happening, add a photo if you can,
            and the AI takes care of the rest.
          </p>
          <Link to="/report" className="btn-primary !px-7 !py-3.5 text-base inline-flex">
            Report Emergency <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
