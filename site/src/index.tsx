/* @refresh reload */
import { render } from 'solid-js/web'
import { HashRouter, Route } from '@solidjs/router'
import './index.scss'
import './sw-manager' // Initialize service worker
import Layout from './components/Layout'
import Home from './pages/home'
import Magic from './pages/magic'
import MagicSchool from './pages/magic/school'
import Politics from './pages/politics'
import Classes from './pages/classes'
import Equipment from './pages/equipment'
import Alignment from './pages/alignment'
import Religion from './pages/religion'
import Relationships from './pages/relationships'
import Skills from './pages/skills'
import CharacterDetail from './pages/characters/detail'
import CreatureDetail from './pages/creatures/detail'
import EntitiesDemo from './pages/entities-demo'

const root = document.getElementById('root')

render(() => (
  <HashRouter root={Layout}>
    <Route path="/" component={Home} />
    <Route path="/magic" component={Magic} />
    <Route path="/magic/:school" component={MagicSchool} />
    <Route path="/skills" component={Skills} />
    <Route path="/politics" component={Politics} />
    <Route path="/classes" component={Classes} />
    <Route path="/equipment" component={Equipment} />
    <Route path="/alignment" component={Alignment} />
    <Route path="/religion" component={Religion} />
    <Route path="/relationships" component={Relationships} />
    <Route path="/characters/:id" component={CharacterDetail} />
    <Route path="/creatures/:id" component={CreatureDetail} />
    <Route path="/entities-demo" component={EntitiesDemo} />
  </HashRouter>
), root!)
