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

  const {semesters, subjects} = formData;
  const filteredSubjects = semester
    ? subjects.filter((sub) => sub.semesters.includes(semester))
    : subjects

  useEffect(() => {
    setSubject("")
  }, [semester])

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-8 h-8 rounded-md"></div>
            <span className="text-xl font-bold">FormNest</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-center">Generate Form Link</h1>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700">Authentication required. Please login again.</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Semester
                </label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a semester</option>
                  {semesters.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subject
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  disabled={!semester}
                >
                  <option value="">Select a subject</option>
                  {filteredSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateFormLink}
                disabled={!semester || !subject || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
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
                  "Generate Form Link"
                )}
              </button>

              {formLink && (
                <div className="mt-8 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Google Form Link
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={formLink}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 bg-gray-50 focus:outline-none text-gray-700"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-3 rounded-r-lg flex items-center justify-center transition-all ${
                        copied ? "bg-green-500 text-white" : "bg-purple-600 text-white hover:bg-purple-700"
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
                  <p className="text-sm text-gray-500 mt-2">
                    This link will direct students to your custom Google Form. All responses will be automatically saved
                    to your Google Drive.
                  </p>
                </div>
              )}
            </div>

            {formLink && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Share this link with your students</li>
                        <li>Responses will be automatically collected in your Google Sheets</li>
                        <li>Access response data anytime from your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}