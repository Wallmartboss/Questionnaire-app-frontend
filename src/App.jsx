import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuestCatalog from './pages/QuestCatalog/QuestCatalog';
import QuestBuilder from './pages/QuestBuilder/QuestBuilder';
import QuestTaking from './pages/QuestTaking/QuestTaking';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import EditQuest from './components/EditQuest/EditQuest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/catalog" element={<QuestCatalog />} />
        <Route path="/create" element={<QuestBuilder />} />
        <Route path="/quests/:id" element={<QuestTaking />} />
        <Route path="/quests/edit/:id" element={<EditQuest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
