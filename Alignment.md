
# Alignment and Character Profile System
Aetheria uses a profile system to define the core behavior of individuals, species, and groups. The system relies on four axes that define an entity's Beliefs, Morals, Actions, and Expression.

# The Four-Axis Master Character Profile
Every entity is defined by four core axes:
  - Ideology (Modifier)
  - Morality (Modifier)
  - Methodology (Modifier)
  - Temperament (Distribution)

## Quick Reference Chart
| Axis        | Question                          | Default Value               | Description                                      |
|-------------|-----------------------------------|-----------------------------|--------------------------------------------------|
| Ideology    | Do they strive to build or tear down? Or simply out for themselves? | Volition (Survivalist) | Worldview, ultimate goals, and politics.        |
| Morality    | What is their intent toward others? | Autonomous (Self-Interest) | Ethical choices, motivation for action, trustworthiness. |
| Methodology | How do they go about their actions? | Direct (Immediate, Physical) | Scale of planning, preferred tactics, means of conflict. |
| Temperament | What is their emotional expressive style? | Random Distribution | Dialogue style, speed of reaction, emotional intensity. |

## Axis 1: Ideology (Cosmic Commitment)
Defines a being's fundamental commitment to structure (Order) versus non-structure (Chaos).
  |values|Description|Behavior|Default Modifier|
  |---|---|---|---|
  |Order|Strives to establish and maintain fixed codes, law, and systems.|Structured. Requires discipline; actively opposes random deviation.|Dogmatic|
  |Chaos|Strives for freedom, unpredictability, and anti-structure.|Impulsive. Rejects rules; accelerates disorder and decay; acts on immediate urge.|Anarchist|
  |Balance|Strives for a sustainable stasis between Order and Chaos.|Harmonious. Acts as a stabilizing force; works to prevent extremes.|Dogmatic|
  |Volition|No cosmic commitment; focused entirely on local, personal will/goals.|Self-Contained. Actions create localized, temporary effects without grand ambition.|Survivalist|

### Common Modifers
  - Oppressive
  - Dogmatic
  - Anarchist
  - Survivalist
  - Hedonistic

## Axis 2: Morality (Ethical Nature)
Defines a being's intent toward others, ranging from sacrifice (Good) to selfishness (Autonomous).

  |values|Description|Behavior|Default Modifier|
  |---|---|---|---|
  |Good|Consciously Sacrificial. Chooses to benefit others, often at personal cost; requires conscious effort.|Altruistic. Protects, gives, and works for the collective welfare.|Charitable|
  |Evil|Consciously Malicious. Chooses to inflict unnecessary suffering, cruelty, or destruction.|Malicious. Driven by cruelty or destruction; seeks harm beyond practical necessity.|Sadistic|
  |Impartial|Principled/Detached. Bases actions on a fixed code, rule, or objective, overriding emotion/self-interest.|Objective. Acts as an unbiased judge; enforces code without emotional attachment to the outcome.|Detached|
  |Autonomous|Practical Default. Actions are amoral, based on self-preservation, survival, or immediate practical gain.|Selfish-Leaning. Takes the path of least resistance; is petty or apathetic but not consciously cruel.|Opportunistic|

### Common Modifers
  - Charitable
  - Protective
  - Cruel
  - Sadistic
  - Just
  - Detached
  - Opportunistic
  - Self-Interest

## Axis 3: Methodology (Method of Action)
Defines the scope and style an entity uses to achieve its goals.

  |values|Description|Behavior|Default Modifier|
  |---|---|---|---|
  |Direct|Focuses on immediate, personal, and physical means.|Physical/Brash. Confronts issues head-on; favors open force or overt aid.|Brash|
  |Subtle|Focuses on indirect, long-term influence using social, mental, or clandestine means.|Cunning/Indirect. Manipulates, persuades, infiltrates, and uses complex planning.|Cunning|
  |Broad|Focuses on collective, widespread effects using organized, institutional, or abstract means (laws, systems).|Systemic/Reformist. Creates movements, structures institutions, or targets large populations.|Reformist|
  |Personal|Focuses entirely on self-improvement, mastery, or self-contained goals.|Introspective/Obsessive. Seeks perfection, researches, trains; actions are inwardly focused.||

### Common Modifers
  - Brash
  - Militaristic
  - Cunning
  - Social
  - Reformist
  - Institutional
  - Obsessive

## Axis 4: Temperament (Elemental Personality)
Defines the emotional, expressive style, and reaction speed of the entity.

  |values|Description|Behavior|
  |---|---|---|
  |Earth|Stubborn, Grounded, Deliberate. Resistant to external pressure.|Stability/Resistance. Slow to react; holds ground; methodical movement. Slow, Steady, Resistant|
  |Fire|Dynamic, Volatile, Hot-Headed, Passionate. Prone to explosions of rage/joy.|Volition/Aggression. Quick to anger; immediate, forceful, and disorganized action. Quick, Forceful, Urgent|
  |Air|Capricious, Intellectual, Flighty. Easily distracted, focused on abstract ideas.|Intellect/Unpredictability. Abstract or philosophical language; inconsistent behavior. Abstract, Unpredictable, Distracted|
  |Water|Relentless, Persistent, Adaptable, Flowing. Seeks the path of least resistance.|Adaptation/Patience. Avoids direct confrontation; flows around obstacles; relies on patience and attrition. Patient, Cunning, Fluid|
  |Aether|Detached, Resilient, Reflective, Subdued. Possesses emotion but rarely shows passion.|Clarity/Neutrality. Affect is cool and rational; prioritizes internal state over external reaction. Rational, Flat Affect, Subdued|

### Note: Temperament is generally not modified. The value is the core expression. For groups, use the Varies (Primary) or Varies (Primary/Secondary) format.

### Guidelines for Entity Templates vs. Individuals
The generic template for a species or group (e.g., "Elf," "Goblin Tribe") represents the cultural and statistical tendency of that entity on all four axes.

|Dynamic|Action|Description|
|---|---|---|
|Individual|Override the Template|The individual profile for a named character always overrides the group's generic template. A single dark elf can be Good even if the species template is Evil.|
|Groups|Template as Probability| Defined by a Tendency indicating the group's most common emotional makeup. Format: Varies (Primary/Secondary) or Varies (Primary). This defines the average group vibe, not internal hierarchy. When generating a random NPC from a generic template, the AI should use the listed values as the highest probability choice. For a "Good" species, a random individual is most likely to be Good.|

# Examples

## Example 1:
  ```json
  {
    "Name": "The Greedy Coffee Hoarder",
    "Ideology": "Volition",
    "Morality": "Autonomous",
    "Methodology": "Personal",
    "Temperament": "Fire",
    ...
  }
  ```
### Decoding:
  |Axis|Value|Explanation|
  |---|---|---|
  |Ideology|Volition|No grand plan, just lives life on their own terms.|
  |Morality|Autonomous|Driven by simple self-interest; they want coffee now, so they take the last one.|
  |Methodology|Personal|Their scope is limited to their own needs and immediate comfort.|
  |Temperament|Fire|Their act is a sudden, impulsive move driven by immediate desire (a small burst of passion/volition).|

## Example 2:
  ```json
  {
    "Name": "Basic Goblin Tribe",
    "Ideology": "Chaos",
    "Morality": "Evil (Cruel)",
    "Methodology": "Direct",
    "Temperament": "Varies (Fire/Other, Fire is Dominant)",
    "Description": "A chaotic tribe of goblins that live for the thrill of the hunt and the spoils of battle. They have no allegiance to any higher power or structure, and their actions are driven by immediate needs and desires. Their temperament varies, but they tend to be impulsive and quick to anger, often acting on instinct rather than careful planning. The tribe is volatile with Fire types bullying the rest into following their lead, the actual hunting/spying is done by cunning Water types, while the easily bullied Earth types make up the expendable ground troops. Air types tend to be shamans or mages and are slightly more respected/feared. Aether types are rare and generally used as fodder or slave labor.",
    ...
  }
  ```

### Decoding:
  |Axis|Value|Explanation|
  |---|---|---|
  |Ideology|Chaos|Their natural state is disorder, impulsivity, and a rejection of systems.|
  |Morality|Evil (Cruel)|They delight in the suffering of others and seek cruelty, even when not necessary for survival. This is a conscious choice, not mere practicality.|
  |Methodology|Direct(Swarm)|They achieve their goals through overwhelming, physical confrontation, often using simple traps and sheer numbers.|
  |Temperament|Varies (Fire)|The tribe as a whole tends to mirror it's impulsive leaders, but individual members may vary widely in temperament.|
