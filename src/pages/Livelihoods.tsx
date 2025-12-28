
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matchOpportunities } from "@/lib/matching";
import { OPPORTUNITIES, Opportunity } from "@/data/opportunities";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, MapPin, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const allSkills = Array.from(new Set(OPPORTUNITIES.flatMap((o) => o.skills)));

const chipClasses = (selected: boolean) =>
  `px-3 py-2 rounded-full border text-sm transition ${
    selected
      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-rose-200 shadow"
      : "bg-white text-gray-800 border-pink-100 hover:border-rose-300"
  }`;

const card = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function Livelihoods() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [results, setResults] = useState<Opportunity[]>([]);
  const navigate = useNavigate();

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  const onSearch = () => {
    const matches = matchOpportunities(selectedSkills, location, 20);
    setResults(matches);
  };

  const clear = () => {
    setSelectedSkills([]);
    setLocation("");
    setResults([]);
  };

  const example = useMemo(
    () => selectedSkills.slice(0, 3).join(", ") || "e.g., tailoring, driving, cooking",
    [selectedSkills]
  );

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <motion.header
        className="px-6 pt-8 pb-6 flex items-center gap-3 bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-pink-100 rounded-lg transition"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-pink-500 font-semibold">New</p>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Livelihood Match
          </h1>
          <p className="text-sm text-gray-600">Find nearby income opportunities that fit your skills.</p>
        </div>
        <div className="hidden sm:block px-3 py-1 rounded-full bg-white text-pink-600 text-sm font-semibold border border-rose-100">
          <Sparkles className="inline w-4 h-4 mr-1" /> Smart matching
        </div>
      </motion.header>

      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <motion.div
            {...card}
            className="bg-white/90 rounded-3xl p-6 shadow-lg border border-pink-100"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Your skills</label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={chipClasses(selectedSkills.includes(skill))}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Selected: {selectedSkills.join(", ") || "none"}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Location (district / village)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-rose-100 shadow-sm">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter district or village"
                      className="flex-1 outline-none text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow"
                      onClick={onSearch}
                    >
                      <Search className="inline w-4 h-4 mr-2" /> Find Opportunities
                    </button>
                    <button
                      className="px-4 py-3 rounded-xl bg-white border border-pink-100 text-gray-700 font-semibold"
                      onClick={clear}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Try: {example}</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...card} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Matches</h2>
              <span className="text-sm text-gray-500">{results.length} shown</span>
            </div>

            {results.length === 0 ? (
              <div className="bg-white/80 border border-dashed border-rose-200 rounded-2xl p-6 text-gray-600 shadow-sm">
                No matches yet. Pick a few skills or enter a location to begin.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((r, idx) => (
                  <motion.div
                    key={r.id}
                    {...card}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white rounded-2xl p-5 shadow-lg border border-pink-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{r.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {r.location} • {r.pay || "pay info not shared"}
                        </p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-rose-50 text-pink-600 border border-rose-100">
                        Skill fit
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">{r.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Skills: {r.skills.join(", ")}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {r.source && (
                        <a
                          href={r.source}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-pink-600 underline"
                        >
                          More info
                        </a>
                      )}
                      {r.contact && <span className="text-sm text-gray-600">Contact: {r.contact}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
