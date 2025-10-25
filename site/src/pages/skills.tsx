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
      <p>A note about specialization: Any skill can be specialized, the character must specify a specific attribute and is then treated as one rank higher for the purposes of that skill in that context.</p>
      <p class="example">eg: a character with Melee: C (Spears) would be considered to have Melee: B when using a spear.</p>

      <h3>Untrained Skills</h3>
      <p>Untrained skills can be attempted by any character without prior instruction. Leveling them is simply a matter of practice and experience.</p>
      <p>Where an untrained skill is not listed in a character or creature profile, it is assumed to match the creatures overall base rank.</p>
      <p class="example">eg: a goblin rank F might have a (Melee: E, Stealth: E), all other untrained skills would be considered F rank the same as the goblins base ranking.</p>
      <ul>
        <li><strong>Athletics:</strong> Physical activities such as climbing, jumping, and swimming.</li>
        <li><strong>Stealth:</strong> The ability to move silently and avoid detection.</li>
        <li><strong>Persuasion:</strong> The art of convincing others through speech and negotiation.</li>
        <li><strong>Survival:</strong> Skills related to wilderness navigation, foraging, and tracking.</li>
        <li><strong>Melee:</strong> Proficiency in hand-to-hand combat and the use of melee weapons.</li>
        <li><strong>Ranged:</strong> Skill in using ranged weapons such as bows and thrown weapons.</li>
        <li><strong>Thievery:</strong> Skills related to lockpicking, pickpocketing, and other clandestine activities.</li>
        <li><strong>Stealth:</strong> The ability to move silently and avoid detection.</li>
        <li><strong>Tracking:</strong> The ability to follow tracks and find paths through the wilderness.</li>
        <li><strong>Farming:</strong> The skill of cultivating crops and raising animals for food.</li>
        <li><strong>Cooking:</strong> The ability to prepare food and create meals.</li>
        <li><strong>Fishing:</strong> The skill of catching fish and other aquatic creatures.</li>
        <li><strong>Navigation:</strong> The art of determining one's position and planning a route, especially at sea.</li>
        <li><strong>Animal Handling:</strong> The ability to train and care for animals.</li>
        <li><strong>Camping:</strong> The skill of setting up and maintaining a campsite, including shelter building and fire making.</li>
      </ul>

      <h3>Trained Skills</h3>
      <p>Trained skills require that a character have some form of instruction to learn and level up the skill. This could be a teacher/mentor or simply access to a library with proper materials.</p>
      <p>Where an trained skill is not listed in a character or creature profile, it is assumed to be unavailable.</p>
      <p class="example">eg: a goblin rank F (Alchemy: E) would have access only to the Alchemy skill.</p>
      <ul>
        <li><strong>Alchemy:</strong> The ability to create potions and elixirs from various ingredients.</li>
        <li><strong>Arcana:</strong> Knowledge of magical lore and spellcraft.</li>
        <li><strong>History:</strong> Understanding of historical events, cultures, and legends.</li>
        <li><strong>Herbalism:</strong> The study of plants and their properties, often for medicinal purposes.</li>
        <li><strong>Jewelcraft:</strong> The skill of creating and appraising jewelry and gemstones.</li>
        <li><strong>Smithing:</strong> The ability to forge and repair metal items, including weapons and armor.</li>
        <li><strong>Spellcraft:</strong> The knowledge and practice of casting and understanding spells.</li>
        <li><strong>Tailoring:</strong> The skill of making and repairing clothing and fabric items.</li>
        <li><strong>Sailing:</strong> The art of operating a sailing vessel.</li>
        <li><strong>Carpentry:</strong> The skill of working with wood to create structures and items.</li>
        <li><strong>Brewing:</strong> The art of making beers, wines, ales, and other beverages.</li>
      </ul>

      <p class="coming-soon"><em>Coming soon...</em></p>
    </div>
  )
}

export default Skills
