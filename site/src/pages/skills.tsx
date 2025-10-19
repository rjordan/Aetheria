function Skills() {
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

      <h3>Untrained Skills</h3>
      <p>Untrained skills can be attempted by any character without prior instruction. Leveling them is simply a matter of practice and experience.</p>
      <p>Where an untrained skill is not listed in a character or creature profile, it is assumed to match the creatures overall base rank.</p>
      <p class="example">eg: a goblin rank F might have a (Melee: E, Stealth: E), all other untrained skills would be considered F rank the same as the goblins base ranking.</p>
      <ul>
        <li><strong>Athletics:</strong> Physical activities such as climbing, jumping, and swimming.</li>
        <li><strong>Stealth:</strong> The ability to move silently and avoid detection.</li>
        <li><strong>Persuasion:</strong> The art of convincing others through speech and negotiation.</li>
        <li><strong>Survival:</strong> Skills related to wilderness navigation, foraging, and tracking.</li>
      </ul>

      <h3>Trained Skills</h3>
      <p>Trained skills require that a character have some form of instruction to learn and level up the skill. This could be a teacher/mentor or simply access to a library with proper materials.</p>
      <p>Where an trained skill is not listed in a character or creature profile, it is assumed to be unavailable.</p>
      <p class="example">eg: a goblin rank F (Alchemy: E) would have access only to the Alchemy skill.</p>
      <ul>
        <li><strong>Alchemy:</strong> The ability to create potions and elixirs from various ingredients.</li>
        <li><strong>Arcana:</strong> Knowledge of magical lore and spellcraft.</li>
        <li><strong>History:</strong> Understanding of historical events, cultures, and legends.</li>
      </ul>

      <p class="coming-soon"><em>Coming soon...</em></p>
    </div>
  )
}

export default Skills
