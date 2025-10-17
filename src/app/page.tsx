import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, Briefcase, Users, TrendingUp, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl">Hope Jobs</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
        
        {/* Animated Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full backdrop-blur-sm border border-primary/20">
              <span className="text-sm font-medium bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                🇪🇹 #1 Job Platform in Ethiopia
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                Find Your Dream Job
              </span>
              <br />
              <span className="text-foreground">
                or Perfect Candidate
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-delay leading-relaxed">
              Hope Jobs connects talented professionals with amazing opportunities across Ethiopia.
              <span className="block mt-2 font-semibold text-primary">Start your journey today.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  I'm Looking for a Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  I'm Hiring
                  <Briefcase className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in-delay-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Verified Employers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to connect talent with opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/10 group-hover:to-indigo-400/10 rounded-2xl transition-all duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Job Seekers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create your professional profile, discover opportunities, and apply with one click. Track all your applications in one place.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-delay">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-orange-400/0 group-hover:from-amber-400/10 group-hover:to-orange-400/10 rounded-2xl transition-all duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Employers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Post jobs effortlessly, search qualified candidates, and manage applications efficiently all in one powerful platform.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border border-green-200/50 dark:border-green-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-delay-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:to-emerald-400/10 rounded-2xl transition-all duration-300" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Real-time Features</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instant messaging, live notifications, and real-time updates keep you connected every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-200 dark:border-purple-800">
              <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Started in <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals finding their perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group animate-fade-in">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">1</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Create Account</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Sign up in seconds as a job seeker or employer. It's completely free!
              </p>
            </div>

            <div className="text-center group animate-fade-in-delay">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">2</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Complete Profile</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Add your details, skills, experience, or job requirements
              </p>
            </div>

            <div className="text-center group animate-fade-in-delay-2">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">3</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-full" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Start Connecting</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Apply for dream jobs or discover amazing candidates today
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 dark:from-amber-700 dark:via-orange-700 dark:to-rose-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <span className="text-white font-semibold">🚀 Join Now</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Ready to Transform Your Career?
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals and companies finding success on Hope Jobs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-amber-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-transparent text-white border-2 border-white/50 hover:bg-white/10 shadow-xl transition-all duration-300 hover:scale-105 font-semibold">
                  Sign In Now
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="font-medium">Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-white" />
                <span className="font-medium">Get Started in 2 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Hope Jobs</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Connecting Ethiopian talent with opportunities. Your dream career starts here.
              </p>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-lg">📱</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-lg">💼</span>
                </div>
                <div className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-lg">✉️</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">For Job Seekers</h3>
              <ul className="space-y-3">
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Browse Jobs
                </Link></li>
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Create Profile
                </Link></li>
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Career Resources
                </Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">For Employers</h3>
              <ul className="space-y-3">
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Post a Job
                </Link></li>
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Find Candidates
                </Link></li>
                <li><Link href="/register" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Pricing Plans
                </Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Company</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  About Us
                </Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Contact
                </Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all" />
                  Privacy Policy
                </Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 Hope Jobs. Made with ❤️ in Ethiopia. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>🇪🇹</span>
                <span>Empowering Ethiopian Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


