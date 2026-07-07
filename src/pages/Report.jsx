/**
 * pages/Report.jsx
 * -----------------------------------------------------------------------
 * Report Emergency page. Hosts the ReportForm component plus quick
 * context about what happens after submission.
 */

import { ShieldAlert, Clock, Lock } from 'lucide-react'
import ReportForm from '../components/ReportForm'

export default function Report() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <ReportForm />
        </div>

        <div className="order-1 lg:order-2 space-y-5">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-mist-100 mb-2">
              Report an Emergency
            </h1>
            <p className="text-mist-400 text-sm leading-relaxed">
              Describe what's happening in your own words. Our AI will classify
              the disaster type, estimate severity, and generate safety guidance
              instantly.
            </p>
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 border border-signal/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 text-signal" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-mist-100 mb-0.5">Be specific</h3>
                <p className="text-xs text-mist-400">Mention what you see, how many people are affected, and any immediate danger.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                <Clock className="w-4.5 h-4.5 text-amber" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-mist-100 mb-0.5">Response is instant</h3>
                <p className="text-xs text-mist-400">AI classification and guidance appear immediately after you submit.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-sage/10 border border-sage/20 flex items-center justify-center shrink-0">
                <Lock className="w-4.5 h-4.5 text-sage" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-mist-100 mb-0.5">Your info stays protected</h3>
                <p className="text-xs text-mist-400">Contact details are optional and only visible to verified authorities.</p>
              </div>
            </div>
          </div>

          <div className="card p-5 bg-signal/5 border-signal/20">
            <p className="text-xs text-mist-300 leading-relaxed">
              <strong className="text-signal">In immediate life-threatening danger?</strong>{' '}
              Call your local emergency services number directly in addition to
              submitting this report.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
