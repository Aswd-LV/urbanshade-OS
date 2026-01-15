import { ArrowLeft, GitBranch, GitPullRequest, Code, CheckCircle, AlertCircle, ChevronRight, BookOpen, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const ContributingDocs = () => {
  const guidelines = [
    {
      title: "Code Style",
      items: [
        "Use TypeScript for all new code",
        "Follow existing naming conventions",
        "Use semantic CSS tokens from the design system",
        "Write meaningful commit messages"
      ]
    },
    {
      title: "Component Guidelines",
      items: [
        "Keep components focused and single-purpose",
        "Use hooks for shared logic",
        "Prefer composition over inheritance",
        "Document props with JSDoc comments"
      ]
    },
    {
      title: "Testing",
      items: [
        "Test new features before submitting",
        "Check for regressions in related areas",
        "Verify responsive behavior",
        "Test in multiple browsers if possible"
      ]
    }
  ];

  const prChecklist = [
    "Code follows project style guidelines",
    "No TypeScript errors or warnings",
    "Feature works as expected",
    "No console errors in browser",
    "PR description explains the changes",
    "Screenshots included for UI changes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-teal-100">Contributing</h1>
              <p className="text-xs text-teal-500/70">Developer Documentation</p>
            </div>
          </div>
          <Link 
            to="/docs/dev" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Contributing to UrbanShade OS</h2>
          <p className="text-slate-400 leading-relaxed">
            Thank you for your interest in contributing! UrbanShade OS is an open project and we
            welcome contributions of all kinds - from bug fixes to new features to documentation improvements.
          </p>
          
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-teal-400" />
              <p className="text-teal-300 text-sm">
                Every contribution, no matter how small, helps make UrbanShade OS better for everyone!
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            Getting Started
          </h3>
          
          <div className="space-y-4">
            {[
              { step: "1", title: "Fork the repository", desc: "Create your own copy on GitHub" },
              { step: "2", title: "Clone locally", desc: "git clone your-fork-url" },
              { step: "3", title: "Create a branch", desc: "git checkout -b feature/your-feature-name" },
              { step: "4", title: "Make changes", desc: "Write your code and test it" },
              { step: "5", title: "Commit changes", desc: "Use descriptive commit messages" },
              { step: "6", title: "Push & create PR", desc: "Submit your pull request for review" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-400" />
            Guidelines
          </h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            {guidelines.map((section, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                <h4 className="font-semibold text-teal-100 mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PR Checklist */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-teal-400" />
            Pull Request Checklist
          </h3>
          
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-sm mb-4">
              Before submitting your PR, please ensure:
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {prChecklist.map((item, i) => (
                <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer">
                  <div className="w-5 h-5 rounded border border-slate-600 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 opacity-50" />
                  </div>
                  <span className="text-sm text-slate-300">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Types of Contributions */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            Ways to Contribute
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { 
                title: "Bug Fixes", 
                desc: "Found a bug? Fix it and submit a PR!", 
                icon: AlertCircle,
                color: "red"
              },
              { 
                title: "New Features", 
                desc: "Have an idea? Discuss it first, then implement.", 
                icon: Code,
                color: "teal"
              },
              { 
                title: "Documentation", 
                desc: "Help improve our docs and guides.", 
                icon: BookOpen,
                color: "blue"
              },
              { 
                title: "Testing", 
                desc: "Help test new features and report issues.", 
                icon: CheckCircle,
                color: "green"
              }
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                  <h4 className="font-medium text-white">{item.title}</h4>
                </div>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section className="p-6 rounded-xl bg-gradient-to-br from-teal-500/10 via-slate-800/50 to-cyan-500/10 border border-teal-500/20 text-center space-y-4">
          <h3 className="text-lg font-bold text-teal-100">Join Our Community</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Have questions or want to discuss your contribution ideas? 
            Connect with other contributors and the core team!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-teal-400 hover:border-teal-500/30 transition-all text-sm"
            >
              <GitBranch className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <Link to="/docs/dev/uur" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              UUR Packages
            </Link>
            <Link to="/docs/dev" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              Developer Docs Home
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ContributingDocs;
