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
    { title: "Analyze", description: "View insights in Google Forms" },
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
      },3000);
    }, 3000); 
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="relative overflow-hidden flex flex-col min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900">
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

      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 flex-grow py-24 md:py-0 px-4">
        <div className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="inline-block p-2 px-4 rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-medium mb-2">
            Supercharge your Google Forms
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
              Build Smarter
            </span>
            <br />
            <span className="text-white">Google Forms</span>
          </h1>
          
          <p className="text-lg text-cyan-50/90 max-w-xl leading-relaxed">
            Create professional-grade forms in minutes, distribute them effortlessly, 
            and analyze results directly in Google Forms. Perfect for educators and researchers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full blur-sm"></div>
                  <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full relative z-10 border-2 border-white/30" />
                </div>
                <div>
                  <p className="font-medium text-lg">Welcome, {user.given_name || user.name}</p>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-cyan-200 hover:text-white mt-1 transition-colors hover:cursor-pointer hover:underline"
                  >
                    Not you? Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-[2px] bg-gradient-to-r from-cyan-900 to-emerald-900 rounded-lg"></div>
                
                {/* Google icon */}
                <div className="relative z-10 bg-white rounded-full p-1.5 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="relative z-10 font-medium text-white hover:cursor-pointer">Continue with Google</span>
              </button>
            )}
          </div>
        </div>

        <div className={`relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {/* Card with glass morphism effect */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-3xl"></div>
            
            {/* Logo and brand */}
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg className="w-5 h-5 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">FormNest</span>
            </div>

            <div className="space-y-8 relative">
              {/* Steps indicator */}
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={index} className={`flex flex-col items-center transition-all duration-200 ${activeStep === index ? "scale-110 opacity-100" : "opacity-50 scale-90"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                      activeStep === index 
                        ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-emerald-900 shadow-lg shadow-cyan-500/20" 
                        : "bg-white/10 text-white/50 border border-white/20"
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-xs font-semibold ${activeStep === index ? "text-white" : "text-white/50"}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Content display area */}
              <div className="h-[240px] bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 relative overflow-hidden border border-white/10 backdrop-blur-sm">
                {/* Step content */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 flex items-center justify-center">
                      {activeStep === 0 && (
                        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      )}
                      {activeStep === 1 && (
                        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      )}
                      {activeStep === 2 && (
                        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {activeStep === 3 && (
                        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-white/80 text-lg">{steps[activeStep].description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 rounded-full blur-2xl"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-cyan-400/30 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}