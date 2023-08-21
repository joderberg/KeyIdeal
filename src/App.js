import logo from './logo.svg';
import './App.css';

function App() {
  return (
        <div className="App" onMouseDown={startDrag} onMouseUp={endDrag} onMouseMove={move}>
              <button className="CreateButton" onClick={addCircle}>SKAPA</button>
              <button className="CreateButton" style={{left: 'calc(20% + 20px)'}} onClick={toggleModal}>SYMBOL</button>

              {showModal && (
                  <div className="modal">
                      <label>Color: <input type="color" value={starColor} onChange={(e) => setStarColor(e.target.value)} /></label>
                      <label>Size: <input type="number" value={starSize} onChange={(e) => setStarSize(e.target.value)} /></label>
                      <label>Price: <input type="number" value={starPrice} onChange={(e) => setStarPrice(e.target.value)} /></label>
                      <button onClick={toggleModal}>Close</button>
                  </div>
              )}
            {circles.map((circle, index) => (
                <div
                    key={index}
                    className="Circle"
                    style={{
                        left: circle.x - circle.radius,
                        top: circle.y - circle.radius,
                        width: circle.radius * 5,
                        height: circle.radius * 5
                    }}
                    onMouseDown={(e) => startDragCircle(e, index)}
                    onClick={() => toggleGrid(index)}
                >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
