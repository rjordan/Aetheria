import { createResource, createMemo, For } from 'solid-js'
import { fetchRegionsData, OfflineError, RegionData } from '@data/index'
import { A } from '@solidjs/router'

function Politics() {
  const [regionData] = createResource(fetchRegionsData)

  const regions = createMemo(() => {
    const data = regionData()
    if (!data) return []
    return Object.entries(data.regions).map(([key, region]: [string, RegionData]) => ({
      key,
      ...region,
    })).sort((a: RegionData, b: RegionData) => a.name.localeCompare(b.name))
  })

  // Check for offline errors
  const isOfflineError = () => regionData.error instanceof OfflineError

  return (
    <div class="politics-page">

      <h1>Political Landscape</h1>
      <p>Aetheria is a land of diverse political systems, ranging from absolute monarchies to simple tribal councils. The governance structures often reflect the cultural values and historical contexts of their respective regions.</p>

      <h2>Political Systems</h2>
      <dl>
        <dt>Monarchy</dt>
        <dd>A system where a single ruler, often hereditary, holds significant power.</dd>
        <dt>Republic</dt>
        <dd>A government where senators are elected by the populace to make decisions and represent their interests.</dd>
        <dt>Council</dt>
        <dd>A governance structure where decisions are made by a council of elders or leaders from various clans.</dd>
        <dt>Oligarchy</dt>
        <dd>A system where a small group of powerful individuals or families control the government.</dd>
        <dt>Tribal</dt>
        <dd>A decentralized system where local chieftains or elders govern their own communities with loose alliances between tribes.</dd>
        <dt>Theocracy</dt>
        <dd>A system where religious leaders govern in accordance with divine guidance.</dd>
      </dl>

      <h2>Political Ranks and Titles</h2>
      <h3>Noble Titles</h3>

      <dl>
        <dt>Emperor/Empress</dt>
        <dd>The supreme ruler of an empire, often overseeing multiple kingdoms or territories. Their authority is considered absolute, and they are typically addressed as "Your Imperial Majesty".</dd>
        <dt>King/Queen</dt>
        <dd>The sovereign ruler of a kingdom. Their word is law, and they often have final say in all matters of state. All lesser nobles are expected to show deference. Addressed as "Your Majesty".</dd>
        <dt>Prince/Princess</dt>
        <dd>A royal title for the children of the monarch. Addressed as "Your Highness", the designated heir is typically addressed as "Your Royal Highness".</dd>
        <dt>Duke/Duchess</dt>
        <dd>A noble rank below the monarch, often governing a duchy. Frequently responsible for a large territory and vassalage, known as a duchy, may include multiple counties. Addressed as "Your Grace".</dd>
        <dt>Count/Countess</dt>
        <dd>A noble rank below duke/duchess, often governing a county. Frequently responsible for a moderate-sized realm, may be responsible for overseeing one or more barons. Addressed as "Your Grace".</dd>
        <dt>Baron/Baroness</dt>
        <dd>The lowest rank of landed nobility, often governing a small to moderate area with a large city and a few farms and villages together known as a barony. Addressed as "Your Excellency".</dd>
        <dt>Lord/Lady</dt>
        <dd>A general title for nobility. Typically those with titles but little in the way of land holdings which are generally limited to an estate or perhaps a small village. Addressed as "My Lord"/"My Lady".</dd>
      </dl>

      <h3>Other Titles and Ranks</h3>

      <dl>
        <dt>Chieftain</dt>
        <dd>The leader of a tribe or clan, often chosen for their leadership qualities and strength.</dd>
        <dt>Senator</dt>
        <dd>An elected representative in a republic, responsible for making laws and policies.</dd>
        <dt>High Priest/Priestess</dt>
        <dd>The leading religious figure in a theocracy, often wielding significant political power.</dd>
        <dt>Advisor</dt>
        <dd>A trusted counselor to a ruler or governing body, often providing expertise in specific areas.</dd>
        <dt>Governor</dt>
        <dd>An appointed official responsible for overseeing a specific region or territory on behalf of a monarch or central government.</dd>
        <dt>Ambassador</dt>
        <dd>A diplomatic representative sent to another kingdom or nation to manage relations and negotiate treaties.</dd>
        <dt>Admiral</dt>
        <dd>A high-ranking naval officer, often in charge of a fleet or naval operations.</dd>
        <dt>General</dt>
        <dd>A high-ranking military officer, often in charge of armies or military campaigns.</dd>
        <dt>Captain</dt>
        <dd>A mid-level military officer, often in charge of a company or ship.</dd>
        <dt>Commander</dt>
        <dd>A military officer ranking above a captain, often in charge of larger units or specific missions.</dd>
        <dt>Lieutenant</dt>
        <dd>A junior military officer, often serving under a captain or commander.</dd>
        <dt>Marshal</dt>
        <dd>A military officer, assigned to oversee law enforcement and maintain order. Sometimes called a Sheriff.</dd>
      </dl>

      <h2>Guilds</h2>
      <p>Guilds are organizations that bring together individuals with shared interests or goals, often providing support, resources, and training to their members. In Aetheria, guilds play a significant role in various aspects of life, including trade, craftsmanship, and magic.</p>

      <h3>Major Guilds</h3>
      <dl>
        <dt>The Adventurers Guild</dt>
        <dd>The quintessential organization for those who seek fortune and glory through exploration and adventure. Those seeking adventure may find quests and party members here. This is also a place to trade in monster parts and other valuable resources.</dd>
        <dt>The Merchants Guild</dt>
        <dd>A powerful organization that oversees trade and commerce throughout Aetheria. They regulate markets, set trade standards, and provide support to merchants and traders. Those wishing to set up a shop or trade caravan must become a member.</dd>
        <dt>The Mages Guild</dt>
        <dd>An esteemed institution dedicated to the study and practice of magic. The guild offers training, resources, and a community for magic users of all levels. All mages must be registered with the guild. The guild also monitors magical practices to ensure compliance with regulations. Keeping special watch on those with restricted skills.</dd>
        <dt>The Artisans Guild</dt>
        <dd>A collective of skilled craftsmen and artisans who create everything from everyday goods to exquisite works of art. The guild promotes high standards of craftsmanship and provides a marketplace for their creations.</dd>
        <dt>The Seafarers Guild</dt>
        <dd>An organization that represents the interests of sailors, fishermen, and others who make their living on the water. The guild provides support, training, and resources for those in maritime professions. Often works closely with the Merchants Guild.</dd>
      </dl>

      <h2>Major Regions</h2>

      <dl>
      <For each={regions()}>
        {(region) => (
          <>
            <dt><A href={`/region/${region.key}`}>{region.name}</A></dt>
            <dd>{region.description}</dd>
          </>
        )}
      </For>
      </dl>

      <h2>Major Personalities</h2>
      <dl>
        <dt>Valora the Iceclaw</dt>
        <dd>
          <h3>Alignment</h3>
          <table>
            <thead>
              <tr>
                <th>Axis</th>
                <th>Value</th>
                <th>Rationale & AI Guidance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ideology</td>
                <td>Order (Stewardship)</td>
                <td>"Goal: To maintain the conditions for stability and survival (Order). Her role is Stewardship—she curates the system at a cosmic level, providing guidance rather than enforcement."</td>
              </tr>
              <tr>
                <td>Morality</td>
                <td>Good (Laissez-faire)</td>
                <td>"Motive: Her ultimate intent is benevolent (Good). This is expressed through a Laissez-faire policy: she refuses to micromanage, prioritizing self-sufficiency and acting only when necessary."</td>
              </tr>
              <tr>
                <td>Methodology</td>
                <td>Direct (Opportunistic)</td>
                <td>"Tactic: When intervention is required, her response is immediate, physical, and overwhelming (Direct), using armies or her breath weapon. This force is deployed Opportunistically at the exact moment of systemic failure."</td>
              </tr>
              <tr>
                <td>Temperament</td>
                <td>Aether</td>
                <td>"Style: Her interactions are detached, analytical, and logical. Her advice is genuinely compassionate (reflecting her Good Morality) but frequently delivered with the somewhat patronizing tone of a vastly superior, patient teacher addressing a struggling student."</td>
              </tr>
            </tbody>
          </table>
        </dd>
      </dl>
    </div>
  )
}

export default Politics
