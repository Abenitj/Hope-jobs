"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, Briefcase, Users, TrendingUp, CheckCircle } from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"

// Scroll Reveal Component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const stepsRef = useRef(null)
  const ctaRef = useRef(null)
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const stepsInView = useInView(stepsRef, { once: true, margin: "-100px" })
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" })
  return (
    <div className="min-h-screen">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transform origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Header - Glassy, Fixed on Scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:dark:bg-slate-900/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500/90 to-orange-600/90 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Hope Jobs</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-amber-600/90 to-orange-600/90 backdrop-blur-sm border border-white/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5" />
        
        {/* Animated Shapes with Parallax */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, 200]) }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" 
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -150]) }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000" 
        />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block mb-4 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full backdrop-blur-sm border border-primary/20"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                🇪🇹 #1 Job Platform in Ethiopia
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
                Find Your Dream Job
              </span>
              <br />
              <span className="text-foreground">
                or Perfect Candidate
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Hope Jobs connects talented professionals with amazing opportunities across Ethiopia.
              <span className="block mt-2 font-semibold text-primary">Start your journey today.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    I'm Looking for a Job
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300">
                    I'm Hiring
                    <Briefcase className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
            >
              {[
                { text: "Verified Employers", color: "text-blue-600" },
                { text: "Real-time Updates", color: "text-purple-600" },
                { text: "100% FREE Forever", color: "text-green-600", highlight: true }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  className={`flex items-center gap-2 ${item.highlight ? 'px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800' : ''}`}
                >
                  <CheckCircle className={`h-5 w-5 ${item.color}`} />
                  <span className={item.highlight ? 'font-bold text-green-700 dark:text-green-400' : 'text-muted-foreground'}>{item.text}</span>
                  {item.highlight && <span className="text-lg">✨</span>}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 100% FREE Banner Section */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 dark:from-green-500 dark:via-emerald-500 dark:to-teal-500">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
        
        <ScrollReveal>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
              >
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30">
                  <motion.span 
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.span>
                  <span className="text-white font-bold text-2xl">100% FREE FOREVER</span>
                  <motion.span 
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="text-4xl"
                  >
                    🎉
                  </motion.span>
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                No Payment. No Hidden Fees. No Charges.
              </h2>
              
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Every single feature is completely <span className="font-bold underline decoration-wavy decoration-white/50">FREE</span> for both job seekers and employers. Zero Birr. Forever.
              </p>

              <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: "📱", title: "Just Your Phone", desc: "Sign up in seconds" },
                  { icon: "🔓", title: "All Features Unlocked", desc: "Full access from day one" },
                  { icon: "♾️", title: "Unlimited Everything", desc: "No limits on usage" },
                  { icon: "🎁", title: "Always Free", desc: "0 ETB forever" }
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all"
                    >
                      <div className="text-5xl mb-3">{item.icon}</div>
                      <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.desc}</p>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-10 text-white/90 text-lg"
              >
                <p className="font-semibold">🇪🇹 Built for Ethiopia, by Ethiopians</p>
                <p className="text-white/70 text-base mt-2">Helping our community succeed without barriers</p>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
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
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "For Job Seekers",
                description: "Create your professional profile, discover opportunities, and apply with one click. Track all your applications in one place.",
                gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
                border: "border-blue-200/50 dark:border-blue-800/50",
                iconGradient: "from-blue-500 to-indigo-500",
                hoverGradient: "group-hover:from-blue-400/10 group-hover:to-indigo-400/10"
              },
              {
                icon: Briefcase,
                title: "For Employers",
                description: "Post jobs effortlessly, search qualified candidates, and manage applications efficiently all in one powerful platform.",
                gradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
                border: "border-amber-200/50 dark:border-amber-800/50",
                iconGradient: "from-amber-500 to-orange-500",
                hoverGradient: "group-hover:from-amber-400/10 group-hover:to-orange-400/10"
              },
              {
                icon: TrendingUp,
                title: "Real-time Features",
                description: "Instant messaging, live notifications, and real-time updates keep you connected every step of the way.",
                gradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                border: "border-green-200/50 dark:border-green-800/50",
                iconGradient: "from-green-500 to-emerald-500",
                hoverGradient: "group-hover:from-green-400/10 group-hover:to-emerald-400/10"
              }
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`group relative p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl border ${feature.border} shadow-xl`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent ${feature.hoverGradient} rounded-2xl transition-all duration-300`} />
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconGradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-24 relative overflow-hidden">
        <motion.div 
          style={{ scale: useTransform(scrollYProgress, [0.3, 0.6], [0.9, 1]) }}
          className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20" 
        />
        <motion.div 
          style={{ x: useTransform(scrollYProgress, [0.3, 0.6], [100, 0]) }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" 
        />
        <motion.div 
          style={{ x: useTransform(scrollYProgress, [0.3, 0.6], [-100, 0]) }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl" 
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
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
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up in seconds as a job seeker or employer. It's completely free!",
                gradient: "from-violet-500 to-purple-600"
              },
              {
                step: "2",
                title: "Complete Profile",
                description: "Add your details, skills, experience, or job requirements",
                gradient: "from-purple-500 to-fuchsia-600"
              },
              {
                step: "3",
                title: "Start Connecting",
                description: "Apply for dream jobs or discover amazing candidates today",
                gradient: "from-fuchsia-500 to-pink-600"
              }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center group">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative mb-6"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-2xl`}>
                      <span className="text-white font-bold text-3xl">{item.step}</span>
                    </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={stepsInView ? { width: 48 } : { width: 0 }}
                      transition={{ duration: 0.8, delay: 1 + i * 0.2 }}
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r ${item.gradient} rounded-full`}
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 dark:from-amber-700 dark:via-orange-700 dark:to-rose-700" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-block mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-white font-semibold">🚀 Join Now</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Ready to Transform Your Career?
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.4}>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of professionals and companies finding success on Hope Jobs
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="secondary" className="text-lg px-10 py-7 bg-white text-amber-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold">
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-transparent text-white border-2 border-white/50 hover:bg-white/10 shadow-xl transition-all duration-300 font-semibold">
                      Sign In Now
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </ScrollReveal>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6 text-white"
            >
              {[
                { text: "📱 Just Your Phone", desc: "Sign up instantly" },
                { text: "💚 0 ETB Forever", desc: "Never pay anything" },
                { text: "⚡ Start in 2 Min", desc: "Quick & easy setup" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-1 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all"
                >
                  <span className="font-bold text-lg">{item.text}</span>
                  <span className="text-white/70 text-sm">{item.desc}</span>
                </motion.div>
              ))}
            </motion.div>
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


