import { ArrowLeft, Github, GitCommit, Users, Star, Code, Heart, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

interface Contributor {
  name: string;
  role: string;
  contributions: string[];
  github?: string;
  githubUrl?: string;
  avatarUrl?: string;
  joinedAt?: string;
  contributionCount?: number;
}

// Core team members (hardcoded)
const coreTeam: Contributor[] = [
  {
    name: "Aswd_LV",
    role: "Founder & Lead Developer",
    contributions: ["Core architecture", "95% of codebase", "Vision & direction"],
    github: "aswdBatch",
    joinedAt: "January 2025"
  },
  {
    name: "plplll",
    role: "Developer & Tester",
    contributions: ["Cloud features", "Testing", "Ideas & feedback"],
    joinedAt: "Early 2025"
  },
  {
    name: "Kombainis_yehaw",
    role: "QA Tester",
    contributions: ["Bug hunting", "Quality assurance"],
    joinedAt: "2025"
  },
];

const TeamGit = () => {
  const [githubContributors, setGithubContributors] = useState<GitHubContributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/aswdbatch/Urbanshade-OS/contributors');
        if (!response.ok) throw new Error('Failed to fetch contributors');
        const data: GitHubContributor[] = await response.json();
        // Filter out bots and the owner (aswdbatch)
        const filtered = data.filter(c => 
          c.type === 'User' && 
          c.login.toLowerCase() !== 'aswdbatch'
        );
        setGithubContributors(filtered);
      } catch (err) {
        console.error('Failed to fetch GitHub contributors:', err);
        setError('Failed to load GitHub contributors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
  }, []);

  // Merge core team with GitHub contributors
  const allContributors: Contributor[] = [
    ...coreTeam,
    ...githubContributors.map(gc => ({
      name: gc.login,
      role: "Contributor",
      contributions: [`${gc.contributions} commit${gc.contributions > 1 ? 's' : ''}`],
      github: gc.login,
      githubUrl: gc.html_url,
      avatarUrl: gc.avatar_url,
      contributionCount: gc.contributions,
    }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <GitCommit className="w-5 h-5" />
            All Contributors
          </h1>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/aswdbatch/Urbanshade-OS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              Repository
            </a>
            <Link 
              to="/team" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <Users className="w-16 h-16 mx-auto text-primary" />
            <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full -z-10" />
          </div>
          
          <h2 className="text-4xl font-bold">
            Every Single <span className="text-primary">Contributor</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This is a hall of fame for everyone who has ever contributed to Urbanshade OS. 
            Big or small, every contribution matters. You helped make this happen.
          </p>

          <div className="flex justify-center gap-4 text-sm flex-wrap">
            <span className="px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-medium">
              <Star className="w-4 h-4 inline mr-2" />
              {allContributors.length} Contributors
            </span>
            {githubContributors.length > 0 && (
              <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 font-medium">
                <Github className="w-4 h-4 inline mr-2" />
                {githubContributors.length} from GitHub
              </span>
            )}
          </div>
        </section>

        {/* Core Team Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Core Team
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreTeam.map((contributor) => (
              <div 
                key={contributor.name}
                className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-yellow-400">
                      {contributor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{contributor.role}</p>
                  </div>
                  {contributor.github && (
                    <a 
                      href={`https://github.com/${contributor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Github className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {contributor.contributions.map((contrib, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400/90 border border-yellow-500/20"
                    >
                      {contrib}
                    </span>
                  ))}
                </div>
                
                {contributor.joinedAt && (
                  <p className="text-xs text-muted-foreground">
                    Since {contributor.joinedAt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Contributors Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Github className="w-5 h-5 text-purple-400" />
            GitHub Contributors
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{error}</p>
              <p className="text-sm mt-2">Check back later or view on GitHub directly</p>
            </div>
          ) : githubContributors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No additional contributors from GitHub yet</p>
              <p className="text-sm mt-2">Be the first to contribute!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {githubContributors.map((contributor) => (
                <div 
                  key={contributor.id}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <img 
                      src={contributor.avatar_url} 
                      alt={contributor.login}
                      className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">
                        {contributor.login}
                      </h3>
                      <p className="text-sm text-muted-foreground">Contributor</p>
                    </div>
                    <a 
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-400 border border-purple-500/20 font-medium">
                      {contributor.contributions} commit{contributor.contributions > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add Yourself Section */}
        <section className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 text-center">
          <Code className="w-10 h-10 mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-3">Want to See Your Name Here?</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Contribute to Urbanshade OS and get added to this list! Every bug report, 
            code contribution, idea, or feedback counts. Your GitHub avatar will appear here automatically.
          </p>
          <a 
            href="https://github.com/aswdbatch/Urbanshade-OS" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
          >
            <Github className="w-5 h-5" />
            Start Contributing
          </a>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> by the Urbanshade community
          </p>
          <Link to="/team" className="inline-block text-primary hover:underline text-sm font-semibold mt-4">
            ← Back to Main Team Page
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default TeamGit;
