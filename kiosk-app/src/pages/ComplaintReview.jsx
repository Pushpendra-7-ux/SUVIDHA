import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Edit2, Send, Loader2, MapPin, Smartphone, FileText, Image as ImageIcon } from 'lucide-react'

export default function ComplaintReview() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const locationParams = useLocation()
  
  // Use location state data, or fallback to a mock matching the exact structure for direct visits
  const fallbackData = {
    photos: [{ url: "", description: "Pothole front view" }],
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: "Sector 4, Main Road",
      landmark: "Near City Mall",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    problem: {
      category: sessionId?.split('-')[0] || "Pothole",
      description: "There is a severe water pipeline leak in Sector 4 turning the road into a puddle. This needs immediate fixing as water is being wasted.",
      severity: "High"
    },
    department: {
      name: "Municipal Corporation",
      subDepartment: "Road Maintenance"
    },
    complaintFiler: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh@example.com",
      address: "123, Sector 3, Delhi",
      userId: "USR-12345"
    }
  }

  const data = locationParams.state?.complaintData || fallbackData

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate final API submit
    await new Promise(r => setTimeout(r, 2000))
    const trackingId = `UE-${Date.now().toString(36).toUpperCase()}`
    navigate(`/success/${trackingId}`)
  }

  return (
    <section className="flex-1 flex flex-col items-center h-[calc(100vh-5.5rem)] bg-surface px-6 py-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[95%] max-w-7xl flex flex-col h-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white"
      >
        {/* Header */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-6 lg:p-8 flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              Data Synced Successfully
            </div>
            <h2 className="text-3xl font-display font-extrabold text-slate-800">
              Review Your Complaint
            </h2>
          </div>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Smartphone className="w-7 h-7 text-emerald-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 lg:p-8 gap-6 overflow-hidden">
          
          {/* Top Row: Evidence Photo (Left) + Issue Details (Right) */}
          <div className="flex flex-col lg:flex-row gap-6 lg:h-[45%] shrink-0">
            
            {/* Left: Evidence Photos (Top Left, Original Size) */}
            <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full shrink-0">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 shrink-0">
                <ImageIcon className="w-5 h-5 text-assam-blue" /> Evidence Photo
              </h3>
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden pb-1">
                {data.photos && data.photos.length > 0 && data.photos[0].url ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <img src={data.photos[0].url} alt="Evidence" className="max-w-full max-h-full object-contain rounded-xl border border-slate-200 shadow-sm" />
                    {data.photos[0].description && (
                      <span className="mt-2 text-xs font-medium text-slate-600 text-center px-2 truncate w-full">
                        {data.photos[0].description}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 text-slate-400 text-sm text-center p-4">
                    <ImageIcon className="w-10 h-10 mb-2" />
                    <span>Missing Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Issue Details */}
            <div className="w-full lg:w-2/3 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full overflow-hidden">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 shrink-0">
                <FileText className="w-5 h-5 text-assam-blue"/> Issue Details
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 shrink-0">
                <DetailRow label="Category" value={data.problem?.category} />
                <DetailRow label="Severity" value={data.problem?.severity} isHighlight />
                <DetailRow label="Department" value={data.department?.name} />
                <DetailRow label="Sub-Department" value={data.department?.subDepartment} />
              </div>
              <div className="mt-4 flex-1 flex flex-col min-h-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 shrink-0">Description</span>
                <p className="text-slate-700 font-medium bg-white p-4 rounded-xl border border-slate-200 text-sm leading-relaxed flex-1 overflow-y-auto custom-scrollbar">
                  {data.problem?.description || "No description provided."}
                </p>
              </div>
            </div>
            
          </div>

          {/* Bottom Row: Location (Left) + Filer Info (Right) */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            
            {/* Location Info */}
            <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full overflow-hidden">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 shrink-0">
                <MapPin className="w-5 h-5 text-emerald-600"/> Location Info
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 overflow-y-auto custom-scrollbar pr-2 content-start">
                <DetailRow label="GPS Coordinates" value={`${data.location?.latitude || 'N/A'}°, ${data.location?.longitude || 'N/A'}°`} />
                <DetailRow label="Pincode" value={data.location?.pincode} />
                <DetailRow label="Address" value={data.location?.address} className="col-span-2" />
                <DetailRow label="Landmark" value={data.location?.landmark} />
                <DetailRow label="City & State" value={`${data.location?.city || ''}, ${data.location?.state || ''}`.replace(/^, |, $/g, '')} />
              </div>
            </div>

            {/* Filer Info */}
            <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full overflow-hidden">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 shrink-0">
                <Smartphone className="w-5 h-5 text-purple-600"/> Filer Info
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 overflow-y-auto custom-scrollbar pr-2 content-start">
                <DetailRow label="Name" value={data.complaintFiler?.name} />
                <DetailRow label="Phone Number" value={data.complaintFiler?.phone} />
                <DetailRow label="Email Address" value={data.complaintFiler?.email} className="col-span-2" />
                <DetailRow label="Home Address" value={data.complaintFiler?.address} className="col-span-2" />
                <DetailRow label="User ID" value={data.complaintFiler?.userId} className="col-span-2" />
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-5 lg:px-8 border-t border-slate-100 flex items-center justify-end gap-6 shrink-0">
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-lg hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" /> Back
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 rounded-2xl bg-assam-blue text-white font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl hover:shadow-blue-900/20 flex items-center gap-3 disabled:opacity-75"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Check className="w-6 h-6" />
            )}
            Confirm & Finalize
          </button>
        </div>

      </motion.div>
    </section>
  )
}

function DetailRow({ label, value, isHighlight, className = "" }) {
  if (!value) return null;
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</span>
      <span className={`font-bold truncate ${isHighlight ? 'text-rose-600 text-lg' : 'text-slate-800 text-sm'}`}>
        {value}
      </span>
    </div>
  )
}
