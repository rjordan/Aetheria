import { createEffect, createMemo, createResource, For } from 'solid-js'
import { fetchSkillsData, SkillData } from '@data/index'

function Skills() {
  const [skillsData] = createResource(fetchSkillsData)

  const skills = createMemo(() => {
    const data = skillsData()
    if (!data) return []

    return Object.entries(data.skills).map(([key, skill]: [string, SkillData]) => ({
      key,
      ...skill,
    })).sort((a, b) => a.name.localeCompare(b.name))
  })

  createEffect(() => {
    console.log('Skills data loaded:', skills() || 'No data')
  });

  return (
    <div class="skills-page">
      <h1>Skills and Abilities</h1>
      <p>Information about skills and abilities in Aetheria.</p>
      <p>Where an ability is not listed in a character or creature profile, it is assumed to match the creatures overall base rank.</p>
      <p class="example">eg: a goblin rank F might list (STR: E, AGI: E, DEX: E). In this case INT, WIL, and CHA would all be considered F rank the same as the goblins base ranking.</p>

      <h2>Abilities</h2>
      <ul>
        <li><strong>Strength (STR):</strong> Physical power and muscle mass, affecting melee damage and carrying capacity.</li>
        <li><strong>Agility (AGI):</strong> Manual dexterity, reflexes, and balance, influencing ranged attacks and evasion.</li>
        <li><strong>Constitution (CON):</strong> Endurance and health, impacting hit points and resistance to poison and disease.</li>
        <li><strong>Intelligence (INT):</strong> Mental acuity and reasoning, affecting spellcasting ability and knowledge-based skills.</li>
        <li><strong>Willpower (WIL):</strong> Perceptiveness, wisdom, and insight, influencing certain divine magic and resistance to mental effects.</li>
        <li><strong>Charisma (CHA):</strong> Force of personality and social influence, affecting persuasion and leadership skills.</li>
      </ul>

      <h2>Skills</h2>
      <p>A note about specialization: Any skill can be specialized, the character must specify a specific attribute and is then treated as one rank higher for the purposes of that skill in that context.</p>
      <p class="example">eg: a character with Melee: C (Spears) would be considered to have Melee: B when using a spear.</p>

      <p>Skills in Aetheria fall into two categories:</p>
      <ul>
        <li><strong>Untrained skills</strong> can be attempted by any character without prior instruction. Leveling them is simply a matter of practice and experience.</li>
        <li><strong>Trained skills</strong> require that a character have some form of instruction to learn and level up the skill. This could be a teacher/mentor or simply access to a library with proper materials.</li>
      </ul>
      <p>Where an untrained skill is not listed in a character or creature profile, it is assumed to match the creatures overall base rank.</p>
      <p class="example">eg: a goblin rank F might have a (Melee: E, Stealth: E), all other untrained skills would be considered F rank the same as the goblins base ranking.</p>
      <p>Where a trained skill is not listed in a character or creature profile, it is assumed to be unavailable.</p>
      <p class="example">eg: a goblin rank F (Alchemy: E) would have access only to the Alchemy skill.</p>

      <dl>
        <For each={skills()}>{(skill) => (
          <>
            <dt>
              {skill.name}
              {skill.trainingRequired ? (
                <span class="training-badge">Training Required</span>
              ) : (
                <span class="untrained-badge">Untrained</span>
              )}
            </dt>
            <dd>{skill.description}</dd>
          </>
        )}</For>
      </dl>
    </div>
  )
}

export default Skills
