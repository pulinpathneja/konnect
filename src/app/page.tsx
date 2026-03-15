'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, IndianRupee, TrendingUp, Star, MessageSquare, Phone, ShieldCheck, Clock, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" /> Mentor Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Share Your Expertise,<br />Earn on Your Terms
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join Konnect as a mentor. Help people via chat, voice & video calls and get paid per minute directly to your wallet.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 shadow-lg">
                  Register as Mentor <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="gap-2 border-border">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground">Start earning in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Your Profile', description: 'Sign up, set your expertise, rate per minute, and availability.', icon: ShieldCheck, color: 'bg-primary/10 text-primary' },
              { step: '2', title: 'Go Online & Connect', description: 'Toggle online from your dashboard. Mentees find you and start chatting or calling.', icon: MessageSquare, color: 'bg-accent/10 text-accent-foreground' },
              { step: '3', title: 'Earn Per Minute', description: 'Get paid for every minute of chat, voice, or video call. Withdraw anytime.', icon: Wallet, color: 'bg-success/10 text-success' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="bg-card rounded-2xl p-8 border border-border text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-muted-foreground mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '200+', label: 'Active Mentors' },
              { icon: IndianRupee, value: '₹15/min', label: 'Avg Earning Rate' },
              { icon: Star, value: '4.9/5', label: 'Mentor Rating' },
              { icon: TrendingUp, value: '50,000+', label: 'Sessions Completed' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for Mentors */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Mentor on Konnect?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to monetise your expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: IndianRupee, title: 'Earn Per Minute', description: 'Set your own rate in ₹/min. Get paid for chat, voice, and video sessions.', color: 'bg-primary/10 text-primary' },
              { icon: MessageSquare, title: 'Chat with Mentees', description: 'WhatsApp-style real-time messaging. Auto billing every minute.', color: 'bg-accent/10 text-accent-foreground' },
              { icon: Phone, title: 'Voice & Video Calls', description: 'HD calls with WebRTC. Seamless transition from chat to call.', color: 'bg-success/10 text-success' },
              { icon: Clock, title: 'Flexible Schedule', description: 'Go online when you want. No commitments, no minimum hours.', color: 'bg-primary/10 text-primary' },
              { icon: Wallet, title: 'Instant Withdrawals', description: 'Earnings go to your wallet. Withdraw to your bank anytime.', color: 'bg-accent/10 text-accent-foreground' },
              { icon: TrendingUp, title: 'Dashboard & Analytics', description: 'Track earnings, sessions, ratings, and growth from your dashboard.', color: 'bg-success/10 text-success' },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Mentors Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from mentors who are already earning on Konnect
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Priya S.', role: 'Product Manager', company: 'Amazon', text: 'I do 2-3 sessions a day in my free time. The per-minute billing is fair and I\'ve already earned over ₹50,000 this month.', rating: 5 },
              { name: 'Rahul K.', role: 'Senior Engineer', company: 'Google', text: 'Love how easy it is to go online and connect with mentees. The chat + call combo works great. Dashboard tracks everything.', rating: 5 },
              { name: 'Neha M.', role: 'Career Coach', company: 'Independent', text: 'Konnect replaced my need for a separate booking system. Mentees find me, we chat, I get paid. Simple and effective.', rating: 5 },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }, (_, j) => (
                    <Star key={j} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-semibold text-secondary-foreground">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-success font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #E8530E 0%, #F07030 100%)' }}>
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Mentoring?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of experts already earning on Konnect. Set your rate, go online, and start getting paid.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-background hover:bg-background/90 text-foreground gap-2 shadow-lg">
                Register as Mentor <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-white/70 mt-6">
            No platform fees for first 3 months
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold text-primary">Konnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The mentor portal for experts to share knowledge and earn on their own terms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Mentors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Register as Mentor</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Mentor Dashboard</Link></li>
                <li><Link href="/wallet" className="hover:text-primary transition-colors">Earnings & Wallet</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Konnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
