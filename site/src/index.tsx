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
import Region from './pages/region'
import Classes from './pages/classes'
import Equipment from './pages/equipment'
import Alignment from './pages/alignment'
import Religion from './pages/religion'
import Relationships from './pages/relationships'
import Skills from './pages/skills'
import Characters from './pages/characters'
import CharacterDetail from './pages/characters/detail'
import CreatureDetail from './pages/creatures/detail'
import EntitiesDemo from './pages/creatures'
import Creatures from './pages/creatures'

const root = document.getElementById('root')

render(() => (
  <HashRouter root={Layout}>
    <Route path="/" component={Home} />
    <Route path="/magic" component={Magic} />
    <Route path="/magic/:school" component={MagicSchool} />
    <Route path="/skills" component={Skills} />
    <Route path="/politics" component={Politics} />
    <Route path="/region/*path" component={Region} />
    <Route path="/classes" component={Classes} />
    <Route path="/equipment" component={Equipment} />
    <Route path="/alignment" component={Alignment} />
    <Route path="/religion" component={Religion} />
    <Route path="/relationships" component={Relationships} />
    <Route path="/characters" component={Characters} />
    <Route path="/characters/:id" component={CharacterDetail} />
    <Route path="/creatures" component={Creatures} />
    <Route path="/creatures/:id" component={CreatureDetail} />
    <Route path="/entities-demo" component={EntitiesDemo} />
  </HashRouter>
), root!)
