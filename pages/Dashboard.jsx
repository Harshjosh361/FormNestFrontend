import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import formData from "../src/data/formData.json"

export default function Dashboard() {
  const [semester, setSemester] = useState("")
  const [subject, setSubject] = useState("")
  const [formLink, setFormLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [userImage, setUserImage] = useState("")



  const {semesters, subjects} = formData;
  const filteredSubjects = semester
    ? subjects.filter((sub) => sub.semesters.includes(semester))
    : subjects

  useEffect(() => {
    setSubject("")
  }, [semester])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.picture) {
      setUserImage(user.picture)
    }
  }, [])

  const getAuthToken = () => {
    const tokenFromLocalStorage = localStorage.getItem("token")
    const tokenFromSessionStorage = sessionStorage.getItem("token")
    const tokenFromCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1]

    return tokenFromLocalStorage || tokenFromSessionStorage || tokenFromCookie
  }

  const generateFormLink = async () => {
    if (!semester || !subject) return
    
    const token = getAuthToken()
    if (!token) {
      setAuthError(true)
      return
    }

    setIsGenerating(true)
    setFormLink("")
    setAuthError(false)

    try {
      const response = await fetch("http://localhost:5000/generate-form", {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          sem: semester,
          subject, 
          token: token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error generating form link")
      }

      const data = await response.json()
      
      if (data.formUrl) {
        setFormLink(typeof data.formUrl === 'object' ? 
          (data.formUrl.responderUri || data.formUrl.editUri) : 
          data.formUrl)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error generating form link:", error)
      alert(`Failed to generate form: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const copyToClipboard = () => {
    if (!formLink) return

    navigator.clipboard.writeText(formLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full opacity-20">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,255,200,0.3),transparent_50%)] animate-[pulse_2s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(120,0,255,0.3),transparent_50%)] animate-[pulse_2.5s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_40%)] animate-[pulse_1.8s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <header className="relative z-10 bg-gradient-to-r from-emerald-900/80 to-cyan-900/80 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">FormNest</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full blur-sm"></div>
  {userImage ? (
    <img
      src={userImage}
      alt="User Profile"
      className="w-10 h-10 rounded-full border-2 border-white/30 relative z-10 object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/80 to-emerald-400/80 flex items-center justify-center text-emerald-900 font-medium relative z-10 border-2 border-white/30">
      U
    </div>
  )}
</div>

          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-3xl"></div>
            
            <div className="relative">
              <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">Generate Form Link</h1>

              {authError && (
                <div className="mb-6 p-4 bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-200">Authentication required. Please login again.</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-cyan-100 mb-2">
                    Select Semester
                  </label>
                  <div className="relative">
                    <select
                      id="semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-white appearance-none"
                    >
                      <option value="" className="bg-emerald-900 text-white">Select a semester</option>
                      {semesters.map((sem) => (
                        <option key={sem.id} value={sem.id} className="bg-emerald-900 text-white">
                          {sem.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-cyan-100 mb-2">
                    Select Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!semester}
                    >
                      <option value="" className="bg-emerald-900 text-white">Select a subject</option>
                      {filteredSubjects.map((sub) => (
                        <option key={sub.id} value={sub.id} className="bg-emerald-900 text-white">
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateFormLink}
                  disabled={!semester || !subject || isGenerating}
                  className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {/* Button background with gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity disabled:opacity-50"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-r from-cyan-900 to-emerald-900 rounded-lg"></div>
                  
                  {/* Button content */}
                  <div className="relative z-10 text-white flex items-center justify-center gap-2">
                    {isGenerating ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Generate Form Link
                      </>
                    )}
                  </div>
                </button>

                {formLink && (
                  <div className="mt-8 space-y-2">
                    <label className="block text-sm font-medium text-cyan-100">
                      Your Google Form Link
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={formLink}
                        readOnly
                        className="flex-1 bg-white/10 border border-white/20 rounded-l-xl px-4 py-3 focus:outline-none text-white"
                      />
                      <button
                        onClick={copyToClipboard}
                        className={`px-4 py-3 rounded-r-xl flex items-center justify-center transition-all ${
                          copied 
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" 
                            : "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-400 hover:to-emerald-400"
                        }`}
                      >
                        {copied ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-cyan-100/80 mt-2">
                      This link will direct students to your custom Google Form. All responses will be automatically saved
                      to your Google Drive.
                    </p>
                  </div>
                )}
              </div>

              {formLink && (
                <div className="mt-8 p-5 bg-gradient-to-br from-cyan-900/30 to-emerald-900/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-cyan-300"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-cyan-200">What happens next?</h3>
                      <div className="mt-2 text-sm text-cyan-100/80">
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 flex items-center justify-center mr-2 text-xs text-cyan-300">1</div>
                            Share this link with your students
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 flex items-center justify-center mr-2 text-xs text-cyan-300">2</div>
                            Responses will be automatically collected in your Google Forms
                          </li>
                          <li className="flex items-center">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 flex items-center justify-center mr-2 text-xs text-cyan-300">3</div>
                            Access response data anytime from your dashboard
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-cyan-200 hover:bg-white/20 transition-all">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
      
      {/* Add custom animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(8px); }
          50% { transform: translateY(-8px) translateX(15px); }
          75% { transform: translateY(8px) translateX(-8px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </div>
  )
}