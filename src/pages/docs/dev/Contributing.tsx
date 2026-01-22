import { GitBranch, BookOpen, Code, GitPullRequest, Users, Heart, CheckCircle, AlertCircle } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

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
    <DocLayout
      title="Contributing"
      description="How to contribute to UrbanShade OS - code style, PR guidelines, and ways to help."
      keywords={["contributing", "github", "pull request", "open source"]}
      accentColor="teal"
      breadcrumbs={[{ label: "Developer", path: "/docs/dev" }]}
      prevPage={{ title: "UUR Packages", path: "/docs/dev/uur" }}
      nextPage={{ title: "Developer Docs", path: "/docs/dev" }}
    >
      <DocHero
        icon={GitBranch}
        title="Contributing to UrbanShade OS"
        subtitle="Thank you for your interest in contributing! We welcome contributions of all kinds."
        accentColor="teal"
      />

      <DocAlert variant="tip" title="Every Contribution Counts">
        <Heart className="w-4 h-4 inline mr-2 text-pink-400" />
        Every contribution, no matter how small, helps make UrbanShade OS better for everyone!
      </DocAlert>

      <DocSection title="Getting Started" icon={BookOpen} accentColor="teal">
        <div className="space-y-3">
          {[
            { step: "1", title: "Fork the repository", desc: "Create your own copy on GitHub" },
            { step: "2", title: "Clone locally", desc: "git clone your-fork-url" },
            { step: "3", title: "Create a branch", desc: "git checkout -b feature/your-feature-name" },
            { step: "4", title: "Make changes", desc: "Write your code and test it" },
            { step: "5", title: "Commit changes", desc: "Use descriptive commit messages" },
            { step: "6", title: "Push & create PR", desc: "Submit your pull request for review" }
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
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
      </DocSection>

      <DocSection title="Guidelines" icon={Code} accentColor="teal">
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
      </DocSection>

      <DocSection title="Pull Request Checklist" icon={GitPullRequest} accentColor="teal">
        <p className="text-slate-400 text-sm mb-4">Before submitting your PR, please ensure:</p>
        <div className="grid gap-2 md:grid-cols-2">
          {prChecklist.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700">
              <div className="w-5 h-5 rounded border border-teal-500/50 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <span className="text-sm text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Ways to Contribute" icon={Users} accentColor="teal">
        <div className="grid gap-4 md:grid-cols-2">
          <DocCard title="Bug Fixes" description="Found a bug? Fix it and submit a PR!" icon={AlertCircle} accentColor="red" />
          <DocCard title="New Features" description="Have an idea? Discuss it first, then implement." icon={Code} accentColor="teal" />
          <DocCard title="Documentation" description="Help improve our docs and guides." icon={BookOpen} accentColor="blue" />
          <DocCard title="Testing" description="Help test new features and report issues." icon={CheckCircle} accentColor="green" />
        </div>
      </DocSection>

      <div className="p-6 rounded-xl bg-gradient-to-br from-teal-500/10 via-slate-800/50 to-cyan-500/10 border border-teal-500/20 text-center space-y-4">
        <h3 className="text-lg font-bold text-teal-100">Join Our Community</h3>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Have questions or want to discuss your contribution ideas? 
          Connect with other contributors and the core team!
        </p>
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
    </DocLayout>
  );
};

export default ContributingDocs;
