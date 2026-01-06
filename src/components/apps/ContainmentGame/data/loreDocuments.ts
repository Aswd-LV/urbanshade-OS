import { LoreDocument } from '../types';

export const LORE_DOCUMENTS: LoreDocument[] = [
  // Night 1 unlocks
  {
    id: 'welcome-memo',
    title: 'Welcome to Night Shift',
    category: 'communication',
    content: `URBANSHADE FACILITY - INTERNAL MEMO

TO: New Night Shift Operator
FROM: Dr. Morrison, Facility Director

Welcome to the containment monitoring team. Your role is critical to maintaining facility security during off-hours when automated systems require human oversight.

You have access to:
- Facility-wide camera surveillance with periodic ping sweeps
- Audio lure system to redirect specimens
- Containment shock system for temporary immobilization
- Emergency door locks (Front, Left, Right)

Remember: You are the last line of defense. If a specimen reaches the Control Room, all containment protocols will have failed.

Power is limited. Use your tools wisely.

Stay alert. Stay alive.`,
    unlockedAfterNight: 1
  },
  {
    id: 'z01-dossier',
    title: 'Subject Dossier: Z-01',
    category: 'dossier',
    content: `CLASSIFICATION: Z-01 "The Watcher"
THREAT LEVEL: MODERATE
FIRST DOCUMENTED: 2019-03-14

PHYSICAL DESCRIPTION:
Humanoid silhouette with elongated limbs. No distinguishable facial features. Presence causes camera interference.

BEHAVIORAL ANALYSIS:
Z-01 exhibits high intelligence and methodical approach to movement. It appears to understand surveillance systems and will systematically disable cameras before advancing.

CONTAINMENT NOTES:
- Camera disruption is Z-01's primary ability
- Watch for sequential camera failures
- Audio lures moderately effective
- Containment shocks provide 4 second window

WARNING: Z-01 learns operator patterns. Vary your responses.`,
    unlockedAfterNight: 1
  },
  {
    id: 'z04-dossier',
    title: 'Subject Dossier: Z-04',
    category: 'dossier',
    content: `CLASSIFICATION: Z-04 "The Lurker"
THREAT LEVEL: MODERATE
FIRST DOCUMENTED: 2019-07-22

PHYSICAL DESCRIPTION:
Amorphous, shadow-like entity. Capable of flattening itself to near-invisibility. Prefers dark spaces.

BEHAVIORAL ANALYSIS:
Z-04 moves through ventilation systems and blind spots. It has developed a form of "phase shifting" that makes it invisible to every other ping sweep.

CONTAINMENT NOTES:
- Only appears on alternating scans
- Slow but persistent movement pattern
- Audio lures have minimal effect
- Track its position mentally between invisible sweeps

WARNING: If you haven't seen Z-04 in two sweeps, assume the worst.`,
    unlockedAfterNight: 1
  },

  // Night 2 unlocks
  {
    id: 'incident-2019-08',
    title: 'Incident Report: August Breach',
    category: 'incident',
    content: `INCIDENT REPORT #2019-08-15
STATUS: RESOLVED
CASUALTIES: 2 (Operators Chen and Rodriguez)

SUMMARY:
At 03:42, Operator Chen reported unusual readings in Storage A. Against protocol, he left the Control Room to investigate personally. Contact was lost at 03:47.

Operator Rodriguez assumed command but was overwhelmed when multiple specimens breached simultaneously at 04:15.

Facility was secured at 06:00 by morning shift.

LESSONS LEARNED:
1. NEVER leave the Control Room during active containment
2. Multiple specimen coordination is possible
3. Power management is critical - both operators ran out

DIRECTOR'S NOTE: The specimens are learning to work together.`,
    unlockedAfterNight: 2
  },
  {
    id: 'z07-dossier',
    title: 'Subject Dossier: Z-07',
    category: 'dossier',
    content: `CLASSIFICATION: Z-07 "The Swarm"
THREAT LEVEL: HIGH
FIRST DOCUMENTED: 2020-01-03

PHYSICAL DESCRIPTION:
Collective entity composed of hundreds of smaller organisms. Moves as a unified mass. Produces chittering sounds.

BEHAVIORAL ANALYSIS:
Z-07 is fast but easily distracted. It responds strongly to audio stimuli and will investigate lure activations immediately. However, its aggression makes it dangerous if not properly redirected.

CONTAINMENT NOTES:
- Fastest moving specimen
- HIGHLY responsive to audio lures (90% effectiveness)
- Brief shock recovery (1 second)
- Use lures proactively, not reactively

WARNING: Z-07's speed means you have minimal reaction time. Predict, don't react.`,
    unlockedAfterNight: 2
  },

  // Night 3 unlocks
  {
    id: 'power-protocol',
    title: 'Emergency Power Protocol',
    category: 'protocol',
    content: `URBANSHADE FACILITY - PROTOCOL 7B
EMERGENCY POWER MANAGEMENT

When facility power drops below critical levels:

STAGE 1 (50% Power):
- Reduce ping sweep frequency
- Minimize shock usage
- Prioritize door defense

STAGE 2 (25% Power):
- Cameras enter low-power mode
- Audio lures disabled
- Conserve for door locks ONLY

STAGE 3 (0% Power):
- Complete darkness
- All electronic systems offline
- Door locks drain emergency reserves
- Survival unlikely

IMPORTANT: Z-15 "The Drain" accelerates power consumption. If Z-15 is active, power management is your primary concern.

Remember: Doors are your last resort. Save power for them.`,
    unlockedAfterNight: 3
  },
  {
    id: 'z15-dossier',
    title: 'Subject Dossier: Z-15',
    category: 'dossier',
    content: `CLASSIFICATION: Z-15 "The Drain"
THREAT LEVEL: HIGH
FIRST DOCUMENTED: 2020-06-17

PHYSICAL DESCRIPTION:
Translucent, jellyfish-like entity that glows faintly with absorbed electrical energy. Tendrils extend up to 3 meters.

BEHAVIORAL ANALYSIS:
Z-15 feeds on electrical systems. Its proximity to any powered equipment causes rapid energy drain. It moves slowly but its effect radius is substantial.

CONTAINMENT NOTES:
- Slow movement but devastating effect
- Keep it in the far rooms AT ALL COSTS
- Lures and shocks work but cost more power near Z-15
- Prioritize keeping Z-15 distant over other specimens

WARNING: If Z-15 reaches the South Hallway, you will run out of power before 6AM.`,
    unlockedAfterNight: 3
  },

  // Night 4 unlocks
  {
    id: 'the-truth',
    title: 'Encrypted Message (DECRYPTED)',
    category: 'communication',
    content: `[RECOVERED FROM DELETED ARCHIVES]

Dr. Morrison,

The board is concerned about the "night shift casualties." We need to discuss alternative containment methods.

The specimens aren't just escaping - they're COMMUNICATING. Cross-chamber audio analysis shows coordinated movement patterns. They're learning our protocols faster than we can update them.

I've attached the correlation data. Notice how Z-01 always moves first to disable cameras, then Z-07 rushes while we're blind? This isn't coincidence.

We created something we don't understand.

- Dr. Helena Vance
  Chief Researcher (DECEASED)

[ATTACHMENT CORRUPTED]`,
    unlockedAfterNight: 4
  },
  {
    id: 'z19-dossier',
    title: 'Subject Dossier: Z-19',
    category: 'dossier',
    content: `CLASSIFICATION: Z-19 "The Glitch"
THREAT LEVEL: CRITICAL
FIRST DOCUMENTED: 2021-02-28

PHYSICAL DESCRIPTION:
Humanoid figure that appears to "tear" through reality. Visual appearance is constantly shifting, like a corrupted video feed.

BEHAVIORAL ANALYSIS:
Z-19 can teleport through solid walls within a limited range. After teleportation, it requires approximately 8 seconds to stabilize before teleporting again.

CONTAINMENT NOTES:
- Standard doors DO work during stabilization
- Cannot teleport directly into Control Room (unknown reason)
- Must track its cooldown mentally
- Fast movement between teleports

WARNING: Z-19's existence may indicate a breakdown in local spacetime. Prolonged exposure causes severe headaches and visual hallucinations.`,
    unlockedAfterNight: 4
  },

  // Night 5 unlocks
  {
    id: 'final-warning',
    title: 'Morrison\'s Last Recording',
    category: 'communication',
    content: `[AUDIO TRANSCRIPT - RECOVERED]

*static*

This is... this is Dr. Morrison. If you're hearing this, I'm probably already dead.

They know. They know everything. Z-01 has been watching us for months - not trying to escape, just... observing. Learning.

*distant sounds*

The night shifts aren't containment. They're tests. WE'RE the specimens now. Every operator, every protocol, every response - they're cataloging it all.

Z-31... Z-31 is different. It doesn't just break containment. It breaks... everything. Reality bends around it. Our instruments, our cameras, our shocks - none of it works right.

*breathing heavily*

If you survive Night 5... get out. Don't come back. This facility isn't containing them anymore.

They're containing US.

*recording ends*`,
    unlockedAfterNight: 5
  },
  {
    id: 'z31-dossier',
    title: 'Subject Dossier: Z-31',
    category: 'dossier',
    content: `CLASSIFICATION: Z-31 "The Null"
THREAT LEVEL: EXTREME
FIRST DOCUMENTED: [REDACTED]

PHYSICAL DESCRIPTION:
Vaguely humanoid void. Light does not reflect from its surface. Looking directly at Z-31 causes immediate disorientation.

BEHAVIORAL ANALYSIS:
Z-31 appears to absorb memetic energy, making it nearly immune to audio lures and highly resistant to containment shocks. It moves deliberately and cannot be deterred by standard methods.

CONTAINMENT NOTES:
- Audio lures: 10% effectiveness (nearly useless)
- Containment shock: 6 second recovery (but wastes power)
- DOORS ARE YOUR ONLY RELIABLE DEFENSE
- Do not waste resources on Z-31 - block and pray

WARNING: Z-31 represents a fundamental shift in specimen capability. Current containment protocols are INADEQUATE. Recommended action: FACILITY ABANDONMENT.

[This recommendation was overruled by the Board of Directors]`,
    unlockedAfterNight: 5
  }
];

export const getUnlockedDocuments = (completedNights: number[]): LoreDocument[] => {
  const maxNight = Math.max(0, ...completedNights);
  return LORE_DOCUMENTS.filter(doc => doc.unlockedAfterNight <= maxNight);
};

export const getDocumentById = (id: string): LoreDocument | undefined => {
  return LORE_DOCUMENTS.find(doc => doc.id === id);
};
