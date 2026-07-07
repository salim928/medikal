# medicom — build-in-public post series

A ready-to-use content calendar for X/Twitter, LinkedIn and Instagram/TikTok captions.
Voice: builder talking *with* the community, not a company talking *at* it. Every post
ends with a question or an invitation so people build with you.

Suggested cadence: 3 posts/week (Mon thread, Wed progress clip, Fri question/poll).
Swap in real screenshots/screen-recordings from the app — `docs/demo/` has a full
walkthrough video you can cut clips from.

---

## Phase 1 — The why (week 1)

### Post 1 · X thread — the origin story
> Last year I watched someone I love spend an entire day travelling to a clinic,
> queueing for 4 hours… for a 7-minute conversation and a prescription.
>
> That day I started building medicom. 🧵
>
> 1/ Ghana has brilliant doctors. The problem isn't care — it's *access*.
> If you live outside Accra or Kumasi, seeing a specialist can mean a day's travel.
>
> 2/ So I'm building a telehealth platform where you see a licensed Ghanaian doctor
> over video in minutes. Prescriptions go straight to a pharmacy near you.
>
> 3/ It won't fix everything. But if it saves one person that wasted day, it's worth
> building. And I'm building it in public — wins, bugs, dead-ends, all of it.
>
> What would YOU want from a doctor-in-your-pocket? Reply and shape the roadmap. 👇

**LinkedIn version:** same story in 3 short paragraphs, ending: *"I'll be sharing the
entire build here — the architecture decisions, the mistakes, the metrics. Follow along
if healthtech in Africa interests you."*

### Post 2 · X — the promise
> Building medicom in public. The rules I'm setting for myself:
>
> ✅ Ship something visible every week
> ✅ Share real numbers (users, costs, failures)
> ✅ Every feature request gets an answer
> ❌ No "we're revolutionizing healthcare" fluff
>
> Day 1 starts now. Hold me to it.

### Post 3 · Poll
> If you could see a doctor from your phone in 10 minutes, what would you use it for first?
>
> 🤒 Everyday illness (cold, fever, malaria test)
> 🧠 Mental health / therapy
> 👶 My kids
> 💊 Repeat prescriptions

---

## Phase 2 — Showing the build (weeks 2–4)

### Post 4 · X thread — the design system
> Spent this week making medicom *feel* like a serious product. Before/after 🧵
>
> [attach: before/after screenshots]
>
> 1/ Went with warm brown + white. Everyone in healthtech uses blue. Your health app
> shouldn't feel like a bank.
>
> 2/ One rule that changed everything: no text lighter than slate-600 on white.
> Accessibility isn't a feature, it's a floor.
>
> 3/ Dark espresso sidebar = the app "frame". White cards = your data. Your eyes always
> know what matters.
>
> Which do you prefer — warm or clinical? Genuinely deciding with you here.

### Post 5 · X — the demo video
> medicom, end to end, in 60 seconds:
>
> → land → sign in → book a video visit → doctor triages → prescription out
>
> [attach: docs/demo video]
>
> Everything you see is real code, running today. What's missing? Tell me and I'll
> build the top reply this week.

### Post 6 · X — technical credibility (dev audience)
> The medicom stack, for the curious:
>
> • Next.js 16 + React 19
> • One typed data layer — swap demo→production by changing 2 files
> • 59 end-to-end tests on every route
> • 0 lint errors, 0 warnings (yes, actually zero)
>
> Boring tech, shipped fast. Ask me anything about the architecture 👇

### Post 7 · X — the AI angle, done honestly
> medicom has AI triage. Here's the part that matters:
>
> **A licensed doctor signs off on every single AI recommendation.**
>
> The AI sorts the queue — high-risk cases first. The doctor decides. That's the only
> way I'll ever ship AI in healthcare.
>
> [attach: triage queue screenshot]
>
> Agree or disagree with clinician-in-the-loop as a hard rule?

### Post 8 · X — the drug verification feature
> Counterfeit medicine is a silent killer across West Africa.
>
> So medicom lets you verify any drug against the FDA registry — type the batch number,
> get an instant ✅ Authentic or 🚨 Counterfeit.
>
> [attach: verify-drug screenshot]
>
> This feature exists because someone on here suggested it. Keep them coming.

---

## Phase 3 — Community & momentum (ongoing)

### Post 9 · X — the ask
> medicom needs 20 beta testers in Ghana 🇬🇭
>
> You get: free visits during beta, direct line to me, your name in the credits.
> I get: brutal honesty.
>
> Reply "in" or tag someone who complains about clinic queues.

### Post 10 · X — share a failure (trust builder)
> Build-in-public means sharing the ugly weeks too.
>
> This week: my auth flow flashed a loading spinner on EVERY page click. Felt like a
> 2005 website. Root cause: re-resolving the session on every navigation.
>
> Fix: resolve once, share the snapshot. Navigation is now instant.
>
> Lesson: performance bugs are trust bugs — in healthcare especially.

### Post 11 · LinkedIn — partnerships
> medicom now routes e-prescriptions to partner pharmacies, lab orders to partner labs,
> and referrals to partner clinics.
>
> If you run a pharmacy, lab or clinic in Ghana and want patients routed to you —
> the network is open. Link in comments.

### Post 12 · X — milestone template (reuse for every milestone)
> 🎉 medicom milestone: [X]
>
> [one-line what it means for patients]
>
> Built with input from this community — especially @[name] who suggested it.
> Next up: [next thing]. What should come after?

### Post 13 · Instagram/TikTok caption — 30s screen recording
> POV: you feel awful, it's 9pm, the clinic is closed 🤒
>
> Open medicom → describe symptoms → doctor on video in minutes → prescription at the
> pharmacy around the corner.
>
> Healthcare that's there for you. Anywhere. 🇬🇭
> #BuildInPublic #HealthTech #Ghana #Telehealth

### Post 14 · X — the recurring open question (every Friday)
> Friday roadmap thread 🗳️
>
> One thing shipped this week: [thing + clip]
> Three things I could build next:
> 1. [option]
> 2. [option]
> 3. [option]
>
> Most-liked reply wins. Your app, your call.

---

## Reusable hooks

- "I'm not building this alone — the roadmap is a group chat."
- "Every feature in medicom started as a reply to one of these posts."
- "Real numbers, real bugs, real patients. That's the deal."
- "Ghana has brilliant doctors. medicom just removes the distance."

## Assets checklist

- [ ] 60s full walkthrough video → `docs/demo/`
- [ ] Landing hero screenshot (light, warm)
- [ ] Doctor dashboard screenshot (triage queue visible)
- [ ] Verify-drug ✅/🚨 result screenshots
- [ ] Before/after design screenshots
- [ ] 15–30s vertical clips cut from the walkthrough for IG/TikTok
