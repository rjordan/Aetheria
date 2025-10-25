import ResponsiveTable, { TableColumn } from '../components/ResponsiveTable'

function Religion() {
  // Static deity data
  const goodDeities = [
    { deity: 'Soldari', domain: 'Sun, Light, Justice', alignment: 'Order/Good/Direct/Fire', description: 'The radiant god of the sun and justice, often depicted as a warrior with a flaming sword. Associated with the metal gold.' },
    { deity: 'Aetherion', domain: 'Aether, Magic, Knowledge, Wisdom', alignment: 'Order/Good/Personal/Aether', description: 'The wise god of magic and knowledge, often depicted as an elderly sage with a long beard and robes adorned with arcane symbols. Aetherion is the patron of scholars and mages, embodying the pursuit of wisdom and understanding. A child of Gaia; The great Spirit Dragon' },
    { deity: 'Kaldrum', domain: 'Earth, Minerals, Gems, Forge, Underground Life', alignment: 'Order/Good/Personal/Earth', description: 'Little is known about this deity worshiped primarily by subterranean dwellers, such as dwarves and gnomes. Kaldrum is believed to be the guardian of precious gems and metals. He shares domain over the forge with Ignis, and is said to have forged the life that thrives in the dark depths of the earth. A child of Gaia; The great Earth Dragon.' },
    { deity: 'Nimira', domain: 'Love, Beauty, Arts', alignment: 'Volition/Good/Subtle/Air', description: 'The enchanting goddess of love and beauty, often portrayed as a radiant figure surrounded by flowers and art. Nimira is worshipped by artists, lovers, and those who seek inspiration and passion in their lives.' }
  ]

  const neutralDeities = [
    { deity: 'Nox', domain: 'Darkness, Death, Secrets', alignment: 'Order/Impartial/Subtle/Aether', description: 'The mysterious goddess of darkness and death, often portrayed as a shadowy figure in a dark cloak. They are associated with the unknown and the afterlife, guiding souls to their final resting place. Nox frequently appears as a beautiful woman with pale skin and long dark hair wearing dark purple or black robe that disappears into the distances and cold silver eyes that burrow into your soul. Nox is both feared and revered, embodying the duality of life and death. She knows all things secret and hidden, but rarely if ever reveals them, silent as the grave. Nox rarely speaks, but when she does her voice is haunting and beautiful evoking the bittersweet soul-ache of a death-wake in those who hear it. Perhaps strangely Nox is the deity most against the creation of the undead as it interrupts the proper cycle.' },
    { deity: 'Gaia', domain: 'Nature, Fertility, Harest', alignment: 'Balance/Autonomous/Broad/Varies(Earth/Fire)', description: 'The nurturing goddess of the earth and nature, often portrayed as a maternal figure surrounded by flora and fauna. Gaia tends to favor four forms: A young child with blonde hair wearing a thin white tunic and bare feet, a young very pregnant woman with long green hair generally naked, a matronly figure with flame-red hair, and an ancient crone with blind eyes, bark-like skin, snow-white hair. Gaia is the mother of the five elemental dragons. While generally considered a "good" goddess, each of her forms represents different aspects of nature, the spring child can be capricious, the summer lady can be nurturing and harsh in equal measure, the autumn matron embodying bountiful harvest and happy homes, and the winter crone can be cruel representing the harsh realities of life.' },
    { deity: 'Sylvano', domain: 'Forest, Animals, Hunt, Fae', alignment: 'Chaos/Autonomous/Direct/Earth', description: 'The wild god of the forest and animals, often depicted as a wild-elf hunter with antlers and a cloak made of leaves. Sylvano is revered by surface elves, rangers and hunters, embodying the primal connection between nature and its inhabitants.' },
    { deity: 'Luna', domain: 'Moon, Night, Change, Shapeshifters', alignment: 'Volition/Autonomous/Subtle/Water', description: 'The serene goddess of the moon and night, associated with dreams and the subconscious. Often depicted as a beautiful human cloaked in silver light. Her form is ever changing, male and female and various stages of pregnancy like a living embodiment of the moon\'s phases. She is associated with the metal silver.' },
    { deity: 'Zephyrus', domain: 'Wind, Freedom, Travel', alignment: 'Volition/Autonomous/Personal/Air', description: 'The free-spirited god of the wind and travel, often shown as a young teen boy wearing only a shoulder toga with flowing hair. He rarely takes anything seriously and is extremely narcissistic. A child of Gaia; The great Wind Dragon.' },
    { deity: 'Ignis', domain: 'Fire, Passion, War, The Forge', alignment: 'Chaos/Autonomous/Direct/Fire', description: 'The fierce god of fire and war, depicted as a muscular warrior engulfed in flames. Wielding a massive hammer, he embodies the destructive and purifying aspects of fire. A child of Gaia; The great Fire Dragon.' },
    { deity: 'Leviathan', domain: 'Water, Ocean, Storms', alignment: 'Chaos/Autonomous/Broad/Water', description: 'The enigmatic goddess of the sea and storms, often depicted as a sea serpent of massive scale, or beautiful mermaid with hair like seaweed and a shimmering tail. She can be capricious, embodying the unpredictable nature of the ocean, aiding sailors or sending them to the depths at her whim. A child of Gaia; The great Water Dragon.' },
    { deity: 'Cygnus', domain: 'Balance, Law', alignment: 'Balance/Impartial/Broad/Aether', description: 'The stoic god of balance and law, often shown as an old hermit with a long beard and a staff, and a lantern or scales. Cygnus is revered by judges and lawmakers, embodying the ideals of fairness and impartiality. Cygnus is above the concept of morality striving to maintain equilibrium in all things. Alone between to gods of order, chaos, good, and evil Cygnus maintains harmony. Cygnus is rarely worshiped by humans, standing as judge over the other gods.' },
    { deity: 'Cogitus', domain: 'Invention, Craftsmanship, Technology', alignment: 'Order/Impartial/Personal/Aether', description: 'The inventive god of craftsmanship and technology, often depicted as a golem made of clockworks. He is revered by artisans, inventors, and those who seek to push the boundaries of creation and innovation.' },
    { deity: 'The Scribe', domain: 'Fate, Destiny, Time, Writing', alignment: 'Order/Impartial/Broad/Aether', description: 'An enigmatic figure, The Scribe is said to record the destinies of all beings. Often depicted as a cloaked figure with a quill and scroll, they are revered by scholars and those who seek to understand the threads of fate. He shares a domain with Nox who knows all secrets, a great library containing all knowledge and the volumes of every being\'s life past, present, and future.' },
    { deity: 'Meridian', domain: 'Commerce, Wealth, Trade', alignment: 'Volition/Autonomous/Broad/Earth', description: 'The shrewd god of commerce and wealth, often depicted as an overweight merchant with a bag of coins and a ledger. Meridian is revered by traders, merchants, and those who seek prosperity and success in their endeavors.' }
  ]

  const evilDeities = [
    { deity: 'Umbra', domain: 'Decay, Rot, Subterranean Predators', alignment: 'Chaos/Evil/Subtle/Earth', description: 'The dark counterpoint to Gaia, embodying decay, rot, and subterranean predators. This deity is shrouded in mystery and often feared by those who dwell underground. It is said to represent the darker aspects of the earth, including the dangers that lurk beneath the surface. She is often worshipped by dark elves, deep dwarves, and other denizens of the deep dark.' },
    { deity: 'Zath-Ra', domain: 'God-King of the Desert, Undeath, Necromancy', alignment: 'Order/Evil/Broad/Aether', description: 'An ancient and powerful pharaoh who ascended to godhood. He rules over the Desert of Bone. Zath-Ra is often depicted as a mummy or lich, embodying the harsh realities of desert life and the inevitability of death. He is worshipped by nomadic tribes and those who seek to harness the power of undeath and necromancy. One of the few gods who actively interacts with their followers, Zath-Ra is known to grant dark blessings and powers to those who prove themselves worthy.' },
    { deity: 'Lilandra', domain: 'The demon queen, seduction, chaos, forbidden knowledge', alignment: 'Chaos/Evil/Subtle/Fire', description: 'A powerful and enigmatic entity she is not a god in the pure sense but a demon near on par in power. She is associated with demons and dark magic. Lilandra is often depicted as a seductive and alluring figure, embodying the darker aspects of desire and temptation. She is worshipped by those who seek forbidden knowledge and power, often at great personal cost. Lilandra is known to manipulate mortals and immortals alike, weaving intricate webs of intrigue and chaos. Often associates with Zath-Ra. She has long black hair and chestnut skin, often wearing revealing black clothing that accentuates her curves. Note: Lilandra is the only one on this list that while unaging is not immoral. Someone powerful could dethrone her and claim the title of Demon Lord. Lilandra is aware of this and disposes of potential threats with ruthless efficiency.' },
    { deity: 'Echidna', domain: 'Mother of Monsters, Chaos, Mutation', alignment: 'Chaos/Evil/Broad/Fire', description: 'A primordial goddess associated with monsters, chaos, and mutation. Echidna is often depicted as a monstrous figure, embodying the wild and untamed aspects of nature. She is worshipped by those who embrace chaos and seek to harness the power of transformation and mutation.' }
  ]

  // Column configuration for deity tables
  const deityColumns: TableColumn[] = [
    { key: 'deity', label: 'Deity', priority: 'high' },
    { key: 'domain', label: 'Domain', priority: 'high' },
    { key: 'alignment', label: 'Alignment', priority: 'medium' },
    { key: 'description', label: 'Description', priority: 'high' }
  ]
  return (
    <div class="religion-page">
      <h1>Religions & Deities</h1>
      <p>Aetheria is home to a pantheon of gods and goddesses, each representing different aspects of life and nature. Worship of these deities is widespread, with temples and shrines dedicated to them found throughout the land. Gods and goddesses have domains and portfolios they oversee, and their followers often seek their favor through prayer, offerings, and rituals. Few are truely good or evil, simply powerful beings embodying different aspects of existence. Note that while powerful and near omnipotent in their domains, gods in Aetheria are not all-powerful no infallible. They suffer from human-like flaws and limitations, and their actions can have unintended consequences, the tend to rely on their immorality to save them from their follies.</p>

      <h2>Good Deities</h2>
      <ResponsiveTable
        columns={deityColumns}
        data={goodDeities}
        className="good-deities-table"
      />

      <h2>Neutral Deities</h2>
      <ResponsiveTable
        columns={deityColumns}
        data={neutralDeities}
        className="neutral-deities-table"
      />

      <h2>Evil Deities</h2>
      <ResponsiveTable
        columns={deityColumns}
        data={evilDeities}
        className="evil-deities-table"
      />
    </div>
  )
}

export default Religion
