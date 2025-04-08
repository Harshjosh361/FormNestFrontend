import { useState, useEffect } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

export default function LandingHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { title: "Create", description: "Design your form with a few clicks" },
    { title: "Share", description: "Send your form to students instantly" },
    { title: "Collect", description: "Gather responses automatically" },
    { title: "Analyze", description: "View insights in Google Sheets" },
  ];

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      localStorage.setItem('token', accessToken); 

      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          navigate("/dashboard");
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: (err) => {
      console.error("Login Failed", err);
    },
    flow: "implicit",
    scope: 'email profile https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.resource',
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsVisible(true);
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="relative overflow-hidden py-24 md:py-40 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Build Smarter<br />
            <span className="text-gray-900">Google Forms</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Create professional-grade forms in minutes, distribute them effortlessly, 
            and analyze results directly in Google Sheets. Perfect for educators and researchers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">Welcome, {user.given_name || user.name}</p>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 mt-1"
                  >
                    Not you? Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-xl hover:shadow-lg transition-all shadow-md border border-gray-200 hover:border-gray-300 hover:bg-purple-100 hover:cursor-pointer hover:shadow-purple-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500">Trusted by 5,000+ educators worldwide</p>
        </div>

        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-9 h-9 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-800">FormNest</span>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={index} className={`flex flex-col items-center transition-all duration-300 ${activeStep === index ? "scale-110 opacity-100" : "opacity-50 scale-90"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${activeStep === index ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-purple-200" : "bg-gray-100 text-gray-400"}`}>
                      {index + 1}
                    </div>
                    <span className={`text-xs font-semibold ${activeStep === index ? "text-gray-800" : "text-gray-500"}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-[240px] bg-gray-50 rounded-xl p-6 relative overflow-hidden border border-gray-200">
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                  <p className="text-center text-gray-500">{steps[activeStep].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
