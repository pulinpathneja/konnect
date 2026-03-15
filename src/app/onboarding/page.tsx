'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { expertApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import {
  Briefcase, Globe, FileText, CheckCircle2, ChevronRight, ChevronLeft,
  Loader2, Upload, X, User, Building2, Clock, IndianRupee, Languages, Sparkles,
  Phone, Linkedin, Link2
} from 'lucide-react';

const SPECIALTIES = [
  'Career Coaching', 'Interview Prep', 'Resume Review', 'Product Management',
  'Software Engineering', 'Data Science', 'UI/UX Design', 'Marketing',
  'Finance', 'Startup', 'Leadership', 'UPSC', 'CAT/MBA', 'Legal',
  'Life Coaching', 'Mental Health', 'Freelancing', 'Content Creation',
];

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

const STEPS = [
  { id: 1, title: 'Professional Info', icon: Briefcase },
  { id: 2, title: 'Social & Links', icon: Globe },
  { id: 3, title: 'Resume / CV', icon: FileText },
  { id: 4, title: 'Review & Submit', icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userProfile, refreshMentorStatus } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Professional Info
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [pricePerMin, setPricePerMin] = useState('15');

  // Step 2: Social & Links
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Step 3: Resume
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const toggleLanguage = (l: string) => {
    setSelectedLanguages(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    );
  };

  const handleResumeUpload = async (file: File) => {
    if (!user) return;
    setUploadingResume(true);
    try {
      const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setResumeUrl(url);
      setResumeFile(file);
    } catch {
      setError('Failed to upload resume. Please try again.');
    }
    setUploadingResume(false);
  };

  const canProceed = (s: number) => {
    if (s === 1) return title.trim() && bio.trim() && selectedSpecialties.length > 0;
    if (s === 2) return true; // Social links are optional
    if (s === 3) return true; // Resume is optional
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await expertApi.register({
        name: userProfile?.name || user?.displayName || 'Mentor',
        title,
        company,
        experience: parseInt(experience) || 0,
        bio,
        specialties: selectedSpecialties,
        languages: selectedLanguages,
        pricePerMin: parseInt(pricePerMin) || 15,
        phone,
        linkedinUrl,
        portfolioUrl,
      });

      // Upload resume URL if uploaded
      if (resumeUrl) {
        await expertApi.updateResumeUrl(resumeUrl);
      }

      await refreshMentorStatus();
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit application';
      setError(message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Mentor Profile</h1>
          <p className="text-muted-foreground mt-1">Fill in your details to apply as a mentor on Konnect</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  step === s.id
                    ? 'bg-primary text-primary-foreground'
                    : step > s.id
                    ? 'bg-success/10 text-success cursor-pointer'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.id}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">{error}</div>
        )}

        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          {/* Step 1: Professional Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Professional Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    <User className="w-4 h-4 inline mr-1" /> Title *
                  </label>
                  <input
                    type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    <Building2 className="w-4 h-4 inline mr-1" /> Company
                  </label>
                  <input
                    type="text" value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google, Independent"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    <Clock className="w-4 h-4 inline mr-1" /> Experience (years)
                  </label>
                  <input
                    type="number" value={experience} onChange={e => setExperience(e.target.value)}
                    placeholder="e.g. 5" min="0" max="50"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    <IndianRupee className="w-4 h-4 inline mr-1" /> Price per minute (₹)
                  </label>
                  <input
                    type="number" value={pricePerMin} onChange={e => setPricePerMin(e.target.value)}
                    placeholder="15" min="1" max="500"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Bio *</label>
                <textarea
                  value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="Tell mentees about yourself, your experience, and what you can help with..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Sparkles className="w-4 h-4 inline mr-1" /> Specialties * (select at least 1)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s} onClick={() => toggleSpecialty(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        selectedSpecialties.includes(s)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Languages className="w-4 h-4 inline mr-1" /> Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(l => (
                    <button
                      key={l} onClick={() => toggleLanguage(l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        selectedLanguages.includes(l)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Social & Links */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Social & Contact Links
              </h2>
              <p className="text-sm text-muted-foreground">These help us verify your identity and are shown to mentees.</p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <Phone className="w-4 h-4 inline mr-1" /> Phone Number
                </label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <Linkedin className="w-4 h-4 inline mr-1" /> LinkedIn URL
                </label>
                <input
                  type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <Link2 className="w-4 h-4 inline mr-1" /> Portfolio / Website
                </label>
                <input
                  type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-input focus:ring-2 focus:ring-ring outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 3: Resume Upload */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Resume / CV
              </h2>
              <p className="text-sm text-muted-foreground">Upload your resume to help us verify your background. PDF or DOC accepted.</p>

              {!resumeFile ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleResumeUpload(file);
                    }}
                  />
                  {uploadingResume ? (
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="font-medium text-foreground">Click to upload resume</p>
                      <p className="text-sm text-muted-foreground mt-1">PDF, DOC up to 10MB</p>
                    </>
                  )}
                </label>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20">
                  <FileText className="w-8 h-8 text-success" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{resumeFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB uploaded</p>
                  </div>
                  <button onClick={() => { setResumeFile(null); setResumeUrl(''); }} className="p-1 hover:bg-destructive/10 rounded-lg transition">
                    <X className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">This is optional — you can skip and add it later.</p>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Review Your Application
              </h2>

              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">PROFESSIONAL INFO</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Title:</span> <span className="text-foreground font-medium">{title || '—'}</span></div>
                    <div><span className="text-muted-foreground">Company:</span> <span className="text-foreground font-medium">{company || '—'}</span></div>
                    <div><span className="text-muted-foreground">Experience:</span> <span className="text-foreground font-medium">{experience || '0'} years</span></div>
                    <div><span className="text-muted-foreground">Rate:</span> <span className="text-foreground font-medium">₹{pricePerMin}/min</span></div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Bio:</span>
                    <p className="text-foreground mt-1">{bio || '—'}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSpecialties.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">CONTACT & LINKS</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground font-medium">{phone || '—'}</span></div>
                    <div><span className="text-muted-foreground">LinkedIn:</span> <span className="text-foreground font-medium">{linkedinUrl || '—'}</span></div>
                    <div><span className="text-muted-foreground">Portfolio:</span> <span className="text-foreground font-medium">{portfolioUrl || '—'}</span></div>
                    <div><span className="text-muted-foreground">Resume:</span> <span className="text-foreground font-medium">{resumeFile?.name || 'Not uploaded'}</span></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <p className="text-sm text-foreground">
                  By submitting, your application will be reviewed by our team. You&apos;ll be able to see your dashboard in read-only mode while we verify your profile.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed(step)}
                className="gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
