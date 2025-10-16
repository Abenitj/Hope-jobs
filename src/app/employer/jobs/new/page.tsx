import { JobForm } from "../job-form"
import { Plus } from "lucide-react"

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Post a New Job</h1>
              <p className="text-amber-100 text-sm mt-0.5">
                Create a job posting to attract qualified candidates
              </p>
            </div>
          </div>
        </div>
      </div>

      <JobForm />
    </div>
  )
}


