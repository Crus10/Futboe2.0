import { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [allFixtures, setAllFixtures] = useState([]);
  const LigasImportantes = [11, 2, 3, 5, 9, 10, 13, 39, 61, 71, 78, 88, 128, 129, 130, 135, 140, 253, 268, 270, 906];

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Obtener partidos programados para hoy
    fetch(`https://v3.football.api-sports.io/fixtures?date=${formattedDate}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "025e9571369ec40be008a594fd15b196"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllFixtures(data.response);
        console.log("Partidos del día:", data.response);
      })
      .catch((error) => console.error("Error fetching fixtures:", error));
  }, []);

  // Filtrar por ligas importantes
  const filteredFixtures = allFixtures.filter(fixture =>
    fixture.league && LigasImportantes.includes(fixture.league.id)
  );

  // Agrupar por liga
  const groupedByLeague = filteredFixtures.reduce((acc, fixture) => {
    const leagueId = fixture.league.id;
    if (!acc[leagueId]) {
      acc[leagueId] = {
        leagueName: fixture.league.name,
        matches: []
      };
    }
    acc[leagueId].matches.push(fixture);
    return acc;
  }, {});

  // Ordenar partidos por fecha y hora
  Object.values(groupedByLeague).forEach(league => {
    league.matches.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
  });

  return (
    <>
      <header>
        <h1>🗣️⚽ FIXTURE PARTIDOS DE HOY ⚽🗣️</h1>
      </header>
      
      <div className="container">
        {Object.entries(groupedByLeague).map(([leagueId, leagueData]) => (
          <div key={leagueId} className="league-section">
            <h2 className="league-name">{leagueData.leagueName}</h2>
            <ul className="lista">
              {leagueData.matches.map((fixture) => (
                <li key={fixture.fixture.id}>
                  <div>
                    <div className="teams">
                      <div className="team">
                        <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} />
                        <strong>{fixture.teams.home.name}</strong>
                      </div>
                      <div className="score">
                        {fixture.goals.home} - {fixture.goals.away}
                      </div>
                      <div className="team">
                        <strong>{fixture.teams.away.name}</strong>
                        <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} />
                      </div>
                    </div>
                    
                    <p>Estadio: {fixture.fixture.venue.name}, {fixture.fixture.venue.city}</p>
                    <p className="time-played">
                      <center> {fixture.fixture.status.long === "Match Finished" ? "Partido Terminado!⌚" : fixture.fixture.status.long === "Not Started"? `Empieza a las ${new Date(fixture.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs⚽`: `${fixture.fixture.status.elapsed} minutos jugados ⏳`}
                      </center>
                        </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
