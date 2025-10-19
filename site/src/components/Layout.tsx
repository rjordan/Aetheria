import { A, RouteSectionProps } from '@solidjs/router'
import OfflineIndicator from './OfflineIndicator'

function Layout(props: RouteSectionProps) {
  return (
    <>
      <OfflineIndicator />
      <header>
        <div class="container">
          <h1>🌍 Aetheria</h1>
          <p>A Rich Fantasy World</p>
        </div>
      </header>

      <nav>
        <div class="container">
          <ul>
            <li><A href="/" end>Home</A></li>
            <li><A href="/magic">Magic</A></li>
            <li><A href="/politics">Politics</A></li>
            <li><A href="/classes">Classes</A></li>
            <li><A href="/equipment">Equipment</A></li>
            <li><A href="/alignment">Alignment</A></li>
            <li><A href="/religion">Religion</A></li>
            <li><A href="/relationships">Relationships</A></li>
          </ul>
        </div>
      </nav>

      <main class="container">
        {props.children}
      </main>

      <footer>
        <div class="container">
          <p>Generated on {new Date().toLocaleDateString()} | <a href="https://github.com/rjordan/Aetheria">View on GitHub</a></p>
        </div>
      </footer>
    </>
  )
}

export default Layout
