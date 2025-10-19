import { A } from '@solidjs/router'

function Home() {
  return (
    <div class="home-page">
      <h1>Welcome to Aetheria</h1>
      <div class="intro-text">
        <p>
          This is the definitive Resource Guide, to the world of Aetheria designed to provide clear, actionable instructions for generating character and group behavior in the Aetheria setting.
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

      <section class="explore-section">
        <h2>Explore the World</h2>
        <ul class="world-links">
          <li><A href="/magic">Magic System</A></li>
          <li><A href="/politics">Political Landscape</A></li>
          <li><A href="/classes">Character Classes</A></li>
          <li><A href="/equipment">Equipment & Items</A></li>
          <li><A href="/alignment">Alignment System</A></li>
          <li><A href="/religion">Religions & Deities</A></li>
          <li><A href="/relationships">Relationships</A></li>
        </ul>
      </section>
    </div>
  )
}

export default Home
