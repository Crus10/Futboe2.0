import { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [allFixtures, setAllFixtures] = useState([]);
  const LigasImportantes = [11, 2, 3, 5, 9, 10, 39, 61, 71, 78, 88, 128, 129, 130, 135, 140, 253,270,17,13];

  const fetchFixtures = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

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
  };

  useEffect(() => {
    fetchFixtures(); 

    const intervalId = setInterval(fetchFixtures, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  const handleClick = () => {
    window.open('https://github.com/Crus10', '_blank'); 
};
  

  
  const filteredFixtures = allFixtures.filter(fixture =>
    fixture.league && LigasImportantes.includes(fixture.league.id)
  );

  
  const groupedByLeague = filteredFixtures.reduce((acc, fixture) => {
    const leagueId = fixture.league.id;
    if (!acc[leagueId]) {
      acc[leagueId] = {
        leagueName: fixture.league.name,
        logo: fixture.league.logo,  
        flag: fixture.league.flag,   
        matches: []
      };
    }
    acc[leagueId].matches.push(fixture);
    return acc;
  }, {});

  
  Object.values(groupedByLeague).forEach(league => {
    league.matches.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
  });

  

  
  return (
    <>
      <div className="root">
      <header>
        <h1 className='futboe'>⚽🗣️  FUTBOE  🗣️⚽</h1> <br />
        <h2> FIXTURE PARTIDOS DE HOY </h2>
      </header>
      
      <div className="container">
        {Object.entries(groupedByLeague).map(([leagueId, leagueData]) => (
          <div key={leagueId} className="league-section">
            <h2 className="league-name">
            {leagueData.leagueName} 
            <img className='logo' src={leagueData.logo} alt={leagueData.leagueName} />
            <img className='flag' src={leagueData.flag} alt={``}  />
        </h2>
          
            <ul className="lista">
              {leagueData.matches.map((fixture) => (
                <li key={fixture.fixture.id}>
                  <div>
                    <div className="teams">
                    <div className="team home">
                        <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} />
                        <strong>{fixture.teams.home.name}</strong>
                      </div>
                      <div className="score">
                        {fixture.goals.home} - {fixture.goals.away}
                      </div>
                      <div className="team away">
                        <strong>{fixture.teams.away.name}</strong>
                        <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} />
                      </div>
                    </div>
                    
                    <p className='estadio'>Estadio: {fixture.fixture.venue.name}, {fixture.fixture.venue.city}</p>
                    <div className="time-played">
  <center>
    {fixture.fixture.status.long === "Match Finished" ? (
      <span className="finished">Partido Terminado!⌚</span>
    ) : fixture.fixture.status.long === "Not Started" ? (
      <span>{`Empieza a las ${new Date(fixture.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs⚽`}</span>
    ) : (
      <span className="live">{`${fixture.fixture.status.elapsed} minutos jugados `}
      <img className="live-indicator" src="https://cdn-icons-png.flaticon.com/128/4768/4768748.png" alt="Live" />
      </span>
    )}
  </center>
</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <footer>
  <p className='derechos'>&copy; 2024 Futboe. Todos los derechos reservados.</p>
  <article onClick={handleClick} className='contacto'> Contacto </article>
</footer>
</div>
    </>
  );
}

export default App;