import { A } from '@solidjs/router'
import RankBadge from '../components/RankBadge'

function Home() {
  console.log('Home component rendering')
  return (
    <div class="home-page">
      <h1>Welcome to Aetheria</h1>
      <div class="intro-text">
        <p>
          This is the definitive guide, to the world of Aetheria designed to provide clear, actionable instructions for generating character and group behavior in the Aetheria setting.
        </p>
        <p>
          The intention is to create a comprehensive world resource that can be utilized to generate narratives, quests, and character interactions within the Aetheria setting. This work is not focused on mechanics or rules for gameplay, but rather on providing a detailed backdrop against which stories can unfold. The primary intent is to allow AI agents reference this material when generating content for fantasy narratives.
        </p>
        <p>
          This work draws inspiration from classic fantasy settings, blending traditional elements with unique twists to create a rich and immersive environment. Particular influences include Tabletop RPGs, Isekai anime, and popular literature.
        </p>
        <p>Planned features include:</p>
        <ul>
          <li>A full world setting with geography, history, cultures, and factions.</li>
          <li>A comprehensive bestiary of creatures</li>
          <li>Detailed character classes and professions</li>
          <li>An extensive equipment catalog</li>
          <li>A robust magic system</li>
          <li>A complex political landscape</li>
          <li>An MCP server to allow AI agents to utilize these resources in real-time storytelling.</li>
        </ul>
      </div>

      <h2>Ranking System</h2>
      <p>
        In lieu of hard numbers, the game uses a more anime-like approach to character stats and abilities. Beings and their abilities are ranked on a scale from F to SSS, with E being the lowest and SSS being the highest. This ranking system allows for a more narrative-driven approach to character development, focusing on growth and progression rather than strict numerical values. In general terms two powers of equal rank have a 50/50 chance of overcoming each other in direct conflict. Success against an opponent of one rank lower is likely around 80% of the time, while success against an opponent two ranks lower is almost certain at around 95%. Conversely, attempting to overcome an opponent one rank higher has only about a 20% chance of success, and facing an opponent two ranks higher is nearly impossible, with only about a 5% chance of success. Other factors can influences these odds, such as terrain, preparation, and special abilities.
      </p>
      <dl>
        <dt>
          <RankBadge rank="F" label="Rank" /> Nuisance
        </dt>
        <dd>Typically reserved for seriously weak beings. But includes things like common animals, most slimes, or individual goblins.<br />Combat: more of a nuisance than a threat<br />Skill: could potentially pose a threat to themselves or others though ineptitude. (Some characters in anime are famous for F ranked cooking skills.)</dd>
        <dt>
          <RankBadge rank="E" label="Rank" /> The lowest rank for most beings
        </dt>
        <dd>Typically assigned to novices or those with minimal skill or power.<br />Combat: non-threat<br />Skill: completely untrained.</dd>
        <dt>
          <RankBadge rank="D" label="Rank" /> Below average
        </dt>
        <dd>Often assigned to those with some experience but still lacking in significant power or skill.<br />Combat: can be a minor threat if they have the advantage of surprise<br />Skill: has had some training but is still not proficient.</dd>
        <dt>
          <RankBadge rank="C" label="Rank" /> Average rank
        </dt>
        <dd>Representing competent individuals who can handle standard challenges but may struggle with more difficult tasks.<br />Combat: can hold their own against standard opponents<br />Skill: reasonably trained but lacks specialization.</dd>
        <dt>
          <RankBadge rank="B" label="Rank" /> Above average
        </dt>
        <dd>Indicating a higher level of skill or power. These individuals can take on tougher challenges and are often respected in their fields.<br />Combat: can take on multiple standard opponents<br />Skill: has specialized training and is quite proficient.</dd>
        <dt>
          <RankBadge rank="A" label="Rank" /> High rank
        </dt>
        <dd>Reserved for those with exceptional abilities or skills. A-rank individuals are often leaders or experts in their areas.<br />Combat: can face off against elite opponents<br />Skill: highly specialized and extremely proficient.</dd>
        <dt>
          <RankBadge rank="S" label="Rank" /> Superior rank
        </dt>
        <dd>Representing elite individuals with extraordinary power or skill. S-rank characters are rare and often play pivotal roles in major events. This is the highest rank achievable by most individuals.<br />Combat: can take on multiple A-rank opponents<br />Skill: master of their craft.</dd>
        <dt>
          <RankBadge rank="SS" label="Rank" /> Legendary rank
        </dt>
        <dd>Assigned to those with near-mythical abilities. SS-rank individuals are often the stuff of legends and are few and far between.<br />Combat: can take on multiple S-rank opponents<br />Skill: paragon of their field. These are the individuals who can change the course of history for better or worse. Capable of leveling entire cities with their power.</dd>
        <dt>
          <RankBadge rank="SSS" label="Rank" /> Godlike
        </dt>
        <dd>Reserved for the most powerful beings in existence. SSS-rank characters are god-like and can shape the course of history.<br />Combat: can take on entire armies, causing act-of-god level devastation.<br />Skill: unparalleled and can achieve the impossible.</dd>
      </dl>
    </div>
  )
}

export default Home
