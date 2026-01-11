# UrbanShade OS - Achievements Wiring Tracker

This document tracks achievement implementation status.

## Legend
- ✅ = Wired and working
- 🔄 = In progress
- ❌ = Not yet wired

---

## Existing Achievements

### Onboarding
| ID | Name | Status | Notes |
|----|------|--------|-------|
| `first_login` | First Boot | ✅ | Granted on successful login |
| `profile_complete` | Identity Established | ❌ | Needs to check bio completion |
| `first_message` | First Transmission | ❌ | Grant on first DM sent |
| `first_chat` | Hello World | ❌ | Grant on first global chat message |

### Social
| ID | Name | Status | Notes |
|----|------|--------|-------|
| `chat_10` | Chatterbox | ❌ | 10 global chat messages |
| `chat_50` | Communicator | ❌ | 50 global chat messages |
| `chat_100` | Social Butterfly | ❌ | 100 global chat messages |
| `chat_500` | Voice of the Deep | ❌ | 500 global chat messages |
| `friend_1` | Connection Made | ❌ | Add first friend |
| `friend_5` | Networked | ❌ | Add 5 friends |
| `friend_20` | Popular | ❌ | Add 20 friends |

### Contribution
| ID | Name | Status | Notes |
|----|------|--------|-------|
| `uur_submit` | Package Creator | ❌ | Submit UUR package |
| `uur_approved` | Verified Contributor | ❌ | UUR package approved (admin-granted) |
| `bug_report` | Bug Hunter | ❌ | Admin-granted |
| `helper` | Community Helper | ❌ | Admin-granted |

### Longevity
| ID | Name | Status | Notes |
|----|------|--------|-------|
| `week_active` | Weekly Operator | ❌ | 7 days active |
| `month_active` | Veteran | ❌ | 30 days active |
| `quarter_active` | Seasoned Operator | ❌ | 90 days active |
| `year_active` | Legacy | ❌ | 365 days active |

### Special (Admin-granted)
| ID | Name | Status | Notes |
|----|------|--------|-------|
| `beta_tester` | Beta Tester | ❌ | Admin-granted |
| `founding_member` | Founding Member | ❌ | Admin-granted |
| `vip` | VIP Access | ❌ | Admin-granted |
| `staff_member` | Staff Member | ❌ | Admin-granted, hidden |

---

## NEW Achievements (Added)

### Explorer Category
| ID | Name | Description | Rarity | Points | Status |
|----|------|-------------|--------|--------|--------|
| `app_opener_5` | Curious Mind | Open 5 different apps | common | 10 | ❌ |
| `app_opener_15` | Power User | Open 15 different apps | uncommon | 25 | ❌ |
| `app_opener_all` | Completionist | Open every app at least once | rare | 75 | ❌ |
| `night_owl` | Night Owl | Use the OS between 12 AM - 4 AM | uncommon | 20 | ✅ |
| `early_bird` | Early Bird | Use the OS between 5 AM - 7 AM | uncommon | 20 | ✅ |
| `window_multitask_5` | Multitasker | Have 5 windows open at once | common | 15 | ✅ |
| `window_multitask_10` | Window Manager | Have 10 windows open at once | rare | 40 | ✅ |
| `theme_changer` | Style Switcher | Change your theme | common | 10 | ❌ |
| `customizer` | Personalized | Customize profile icon and color | common | 15 | ❌ |

### Secret Category
| ID | Name | Description | Rarity | Points | Status |
|----|------|-------------|--------|--------|--------|
| `konami_code` | Classic Gamer | Enter the Konami code | rare | 50 | ❌ |
| `easter_egg_finder` | Egg Hunter | Find a hidden easter egg | uncommon | 30 | ❌ |
| `crash_survivor` | Crash Survivor | Experience and recover from a system crash | rare | 35 | ❌ |
| `terminal_hacker` | Terminal Ninja | Use 20 different terminal commands | rare | 45 | ❌ |

### Engagement
| ID | Name | Description | Rarity | Points | Status |
|----|------|-------------|--------|--------|--------|
| `session_1hr` | Marathon Session | Use the OS for 1 hour straight | uncommon | 25 | ❌ |
| `session_3hr` | Dedicated Operator | Use the OS for 3 hours straight | rare | 50 | ❌ |
| `daily_streak_3` | Getting Started | Log in 3 days in a row | common | 15 | ❌ |
| `daily_streak_7` | Week Warrior | Log in 7 days in a row | uncommon | 30 | ❌ |
| `daily_streak_30` | Monthly Master | Log in 30 days in a row | epic | 100 | ❌ |

---

## Implementation Progress

### Batch 1 - Time-based (COMPLETED)
- ✅ `night_owl` - Checks current hour on activity
- ✅ `early_bird` - Checks current hour on activity  
- ✅ `window_multitask_5` - Tracks open window count
- ✅ `window_multitask_10` - Tracks open window count

### Batch 2 - Login Flow (TODO)
- `first_login` - Already in hook, needs connection to login
- `daily_streak_3/7/30` - Need login date tracking

### Batch 3 - Chat Integration (TODO)
- `first_chat`, `chat_10/50/100/500` - Hook into GlobalChat

### Batch 4 - App Usage (TODO)
- `app_opener_5/15/all` - Track unique app opens

---

## Wiring Locations

| Achievement | Where to wire |
|-------------|---------------|
| Login achievements | `src/components/LoginScreen.tsx` |
| Chat achievements | `src/hooks/useGlobalChat.ts` |
| Friend achievements | `src/hooks/useFriends.ts` |
| App achievements | `src/components/Desktop.tsx` or `WindowManager.tsx` |
| Theme achievements | `src/components/apps/Settings.tsx` |
| Terminal achievements | `src/components/apps/Terminal.tsx` |
