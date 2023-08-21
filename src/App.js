import React, { useState, useRef, useCallback, useContext } from 'react';
import './App.css';
import { HexColorPicker } from "react-colorful";




function App() {
    // React State
    const [circles, setCircles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [starColor, setStarColor] = useState('#FFFFFF');
    const [stars, setStars] = useState(10); // start with 10 stars
    const [createdSquares, setCreatedSquares] = useState([]);
    const [tempSquareSize, setTempSquareSize] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [draggingCircle, setDraggingCircle] = useState(null);
    const [isClick, setIsClick] = useState(true);
    const [isDraggingSquare, setIsDraggingSquare] = useState(false);
    const [isDraggingModal, setIsDraggingModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedShape, setSelectedShape] = useState(null);
    const [tempSquareCost, setTempSquareCost] = useState(10); // set initial cost to 10
    const [showTextbox, setShowTextbox] = useState(false);
    const [textboxPosition, setTextboxPosition] = useState({ x: 0, y: 0 });

     const [answers, setAnswers] = useState({}); // Store answers with commentId as key


    const [selectedComment, setSelectedComment] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedReplyId, setSelectedReplyId] = useState(null);


// Functions

const YourContext = React.createContext();


const saveAnswer = (commentId) => {
    // Logic to save the answer for the given commentId
};


const handleCommentClick = useCallback((circleIndex, commentIndex, commentId) => {
    if (commentId !== undefined) {
        setSelectedCommentId(commentId);
    } else {
        setSelectedComment({
            circleIndex: circleIndex,
            commentIndex: commentIndex
        });
    }
}, []);




const handleAnswerChange = (commentId, answer) => {
    setAnswers(prevAnswers => ({
        ...prevAnswers,
        [commentId]: answer
    }));
};

const comments = useContext(YourContext);

    
    // Refs
    const lastDragPoint = useRef({ x: 0, y: 0 });
    const draggingSquareRef = useRef(null);
    const [modalPosition, setModalPosition] = useState({ 
        x: (window.innerWidth / 2) - 150,
        y: (window.innerHeight / 2) - 150
    });
    
    
    const onSliderChange = (e) => {
        const value = parseInt(e.target.value);
        const logScale = Math.log10(value + 1) * 25; // Logarithmic scaling
        const linearScale = value / 4000;           // Linear scaling
        const sizeValue = logScale + linearScale;   // Combining the two scales
    
        // Updating both the temp size and cost here
        setTempSquareSize(sizeValue);
        setTempSquareCost(value);
    };
    
    // ...
    
    // Inside the return statement, update the input element like this:
    <input
        type="range"
        min="10"
        max="100000"
        step="10"
        value={tempSquareCost} // Bind the value attribute to the state
        onChange={onSliderChange}
    />
    
    
    





    const startDrag = useCallback((e) => {
        // If the color wheel modal is active, do nothing and return
        if (showModal) return;
        setIsDragging(true);
        lastDragPoint.current = { x: e.clientX, y: e.clientY };
    }, [showModal]);
    
    const endDrag = useCallback(() => {
        if (showModal) return;  // Add this condition
        setIsDragging(false);
        setDraggingCircle(null);
    }, [showModal]);
    

    const move = useCallback((e) => {
        const dx = e.clientX - lastDragPoint.current.x;
        const dy = e.clientY - lastDragPoint.current.y;

        if (isDragging) {
            window.scrollBy(-dx, -dy);
        } else if (draggingCircle !== null && typeof circles[draggingCircle] !== 'undefined') {
            const updatedCircles = [...circles];
            updatedCircles[draggingCircle].x += dx;
            updatedCircles[draggingCircle].y += dy;
            setCircles(updatedCircles);
        }
        

        if (dx !== 0 || dy !== 0) {
            setIsClick(false);
        }

        lastDragPoint.current = { x: e.clientX, y: e.clientY };
    }, [isDragging, draggingCircle, circles]);

    const startDragCircle = useCallback((e, index) => {
        e.stopPropagation();
        setDraggingCircle(index);
        setIsClick(true);
    }, []);

    const toggleGrid = useCallback((index) => {
        if (isClick && typeof circles[index] !== 'undefined' && document.activeElement.tagName !== 'INPUT') {
            const updatedCircles = [...circles];
            updatedCircles[index].showGrid = !updatedCircles[index].showGrid;
            setCircles(updatedCircles);
        }
        setIsClick(true); // Reset the flag here after checking
    }, [isClick, circles]);
    

















    const startDragModal = useCallback((e) => {
        // e.stopPropagation(); // Remove this line
        setIsDraggingModal(true);
        lastDragPoint.current = { x: e.clientX, y: e.clientY };
    }, []);
    

    const moveModal = useCallback((e) => {
        if (!isDraggingModal) return;
    
        const dx = e.clientX - lastDragPoint.current.x;
        const dy = e.clientY - lastDragPoint.current.y;
    
        setModalPosition(prevPos => {
            // Calculate the new proposed positions
            let newX = prevPos.x + dx;
            let newY = prevPos.y + dy;
    
            // Check boundaries for the X axis
            if (newX < 0) newX = 0;
            if (newX + 300 > window.innerWidth) newX = window.innerWidth - 300; // 300 is the width of the modal
    
            // Check boundaries for the Y axis
            if (newY < 0) newY = 0;
            if (newY + 300 > window.innerHeight) newY = window.innerHeight - 300; // 300 is the height of the modal
    
            return {
                x: newX,
                y: newY
            };
        });
    
        lastDragPoint.current = { x: e.clientX, y: e.clientY };
    }, [isDraggingModal]);
    

const endDragModal = useCallback(() => {

    setIsDraggingModal(false);
}, []);

const toggleModal = useCallback(() => {
    setShowModal(prevShowModal => !prevShowModal);
}, []);

  
  const outsideClick = useCallback((e) => {
      if (e.target.classList.contains("backdrop")) {
          toggleModal();
      }
  }, [toggleModal]);
  
  
  
  
  












  const handlePriceCircleClick = (e) => {
    // Toggle the visibility of the textbox
    setShowTextbox(prev => !prev);
    
    // Get the bounding box of the clicked element (PriceCircle)
    const rect = e.target.getBoundingClientRect();
    
    // Set the position of the textbox to where the PriceCircle is
    setTextboxPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    });
}




const handleSquareTextChange = useCallback((e, squareIndex) => {
    const value = e.target.value;
    const updatedSquares = [...createdSquares];
    updatedSquares[squareIndex].text = value;
    setCreatedSquares(updatedSquares);
  }, [createdSquares]);
  
  // Define the handleSaveSquareCom
  
  const handleSaveSquareComment = useCallback((squareIndex) => {
    const updatedSquares = [...createdSquares];
    if (updatedSquares[squareIndex].text) { // Only save if there's content
        updatedSquares[squareIndex].comments = [updatedSquares[squareIndex].text, ...updatedSquares[squareIndex].comments]; 
        updatedSquares[squareIndex].text = ""; // Clear the textarea
        setCreatedSquares(updatedSquares);
    }
}, [createdSquares]);



const startDragSquare = useCallback((e, index) => {
    e.stopPropagation();
    setIsDraggingSquare(true);
    draggingSquareRef.current = index;
    lastDragPoint.current = { x: e.clientX, y: e.clientY };
}, []);

const moveSquare = useCallback((e) => {
    if (!isDraggingSquare || draggingSquareRef.current === null) return;

    const dx = e.clientX - lastDragPoint.current.x;
    const dy = e.clientY - lastDragPoint.current.y;
    const updatedSquares = [...createdSquares];
    
    updatedSquares[draggingSquareRef.current].x += dx;
    updatedSquares[draggingSquareRef.current].y += dy;
    setCreatedSquares(updatedSquares);

    lastDragPoint.current = { x: e.clientX, y: e.clientY };
}, [isDraggingSquare, createdSquares]);

const endDragSquare = useCallback(() => {
    setIsDraggingSquare(false);
    draggingSquareRef.current = null;
}, []);








    
const handleSaveComment = useCallback((circleIndex, textboxIndex) => {
    const updatedCircles = [...circles];
    const comment = updatedCircles[circleIndex].textValues[textboxIndex];
    if (comment) {
        if (!updatedCircles[circleIndex].comments[textboxIndex]) {
            updatedCircles[circleIndex].comments[textboxIndex] = [];
        }
        updatedCircles[circleIndex].comments[textboxIndex] = [comment, ...updatedCircles[circleIndex].comments[textboxIndex]];
        updatedCircles[circleIndex].textValues[textboxIndex] = ""; // Clear the textbox
        setCircles(updatedCircles);
        setStars(prevStars => prevStars + 10); // Increase stars for comment
    }
}, [circles]);





    
  const handleTextboxChange = useCallback((e, circleIndex, textboxIndex) => {
      e.stopPropagation();
      const value = e.target.value;
      const updatedCircles = [...circles];
      updatedCircles[circleIndex].textValues[textboxIndex] = value;
  
      const nextTextboxes = getNextActiveTextboxes(updatedCircles[circleIndex]);
  
      console.log("Current activeTextbox before update:", updatedCircles[circleIndex].activeTextbox);
      console.log("Next textboxes from the function:", nextTextboxes);
  
      updatedCircles[circleIndex].activeTextbox = nextTextboxes;
  
      console.log("Updated activeTextbox:", updatedCircles[circleIndex].activeTextbox);
  
      setCircles(updatedCircles);
      setStars(prevStars => prevStars + 10); // increase stars by 10
  }, [circles]);
  



  
  







//NEW









 // Helper Functions


 const createCircle = useCallback(() => {
    return {
        x: window.scrollX + window.innerWidth / 2,
        y: window.scrollY + window.innerHeight / 2,
        radius: 1.5,
        showGrid: false,
        textValues: Array(9).fill(''),
        activeTextbox: [6],
        comments: Array(9).fill([{ 
            id: Date.now(),  // Using Date.now() for simplicity, but you may want a more robust mechanism.
            text: "",
            replies: [] 
        }])
            };
}, []);


const addCircle = useCallback(() => {
    const newCircle = createCircle();
    setCircles(prevCircles => [...prevCircles, newCircle]);
}, [createCircle]);

const getNextActiveTextboxes = (circle) => {
    const { textValues, activeTextbox } = circle;

    let newActiveTextbox = [...activeTextbox];

    // After 6, activate 3 and 7
    if (textValues[6] && !newActiveTextbox.includes(3) && !newActiveTextbox.includes(7)) {
        newActiveTextbox.push(3, 7);
    }
    // After 3 and 7, activate 4
    if (textValues[3] && textValues[7] && !newActiveTextbox.includes(4)) {
        newActiveTextbox.push(4);
    }
    // After 4, activate 0 and 8
    if (textValues[4] && !newActiveTextbox.includes(0) && !newActiveTextbox.includes(8)) {
        newActiveTextbox.push(0, 8);
    }
    // After 0 and 8, activate 1 and 5
    if (textValues[0] && textValues[8] && !newActiveTextbox.includes(1) && !newActiveTextbox.includes(5)) {
        newActiveTextbox.push(1, 5);
    }
    // After 1 and 5, activate 2
    if (textValues[1] && textValues[5] && !newActiveTextbox.includes(2)) {
        newActiveTextbox.push(2);
    }

    return newActiveTextbox;
};
const createShape = () => {
    if (stars >= tempSquareCost) {
        setStars(prevStars => prevStars - tempSquareCost);
        const newShape = {
            x: window.scrollX + window.innerWidth / 2,
            y: window.scrollY + window.innerHeight / 2,
            size: tempSquareSize,
            color: starColor,
            borderColor: 'black',
            text: '',
            comments: [],
            shapeType: selectedShape // Property to identify the shape type
        };
        setCreatedSquares(prevSquares => [...prevSquares, newShape]);
    } else {
        alert("Not enough stars to create the shape of this size!");
    }
    setShowModal(false); // Close the modal once the shape has been created
    return;
}

































return (
    <div className="App" onMouseDown={startDrag} onMouseUp={endDrag} onMouseMove={move}>
        <button className="CreateButton" onClick={addCircle}>SKAPA</button>
        <button className="CreateButton" style={{left: 'calc(20% + 20px)'}} onClick={toggleModal}>SYMBOL</button>
        <div className="starCount">{stars} Stars</div>

        {showModal && (
            <div className="backdrop" onClick={outsideClick}>
                <div 
                    className="modal" 
                    onMouseDown={startDragModal}
                    onMouseMove={moveModal}
                    onMouseUp={endDragModal}
                    style={{left: `${modalPosition.x}px`, top: `${modalPosition.y}px`}}
                >

                    {currentStep > 1 && (
                        <button onClick={() => setCurrentStep(currentStep - 1)} style={{ color: 'blue', position: 'absolute', top: '10px', left: '50px' }}>←</button>
                    )}

                    {currentStep === 1 && (
                        <div className="step">
                            <div className="shapes-selection">
                                <div 
                                    className={`shape-icon triangle ${selectedShape === 'triangle' ? 'selected' : ''}`} 
                                    onClick={() => setSelectedShape('triangle')}
                                ></div>
                                <div 
                                    className={`shape-icon square ${selectedShape === 'square' ? 'selected' : ''}`} 
                                    onClick={() => setSelectedShape('square')}
                                ></div>
                                <div 
                                    className={`shape-icon pentagon ${selectedShape === 'pentagon' ? 'selected' : ''}`} 
                                    onClick={() => setSelectedShape('pentagon')}
                                ></div>
                                <div 
                                    className={`shape-icon hexagon ${selectedShape === 'hexagon' ? 'selected' : ''}`} 
                                    onClick={() => setSelectedShape('hexagon')}
                                ></div>
                                <div 
                                    className={`shape-icon circle-icon ${selectedShape === 'circle' ? 'selected' : ''}`} 
                                    onClick={() => setSelectedShape('circle')}
                                ></div>
                            </div>
                            <button 
                                className={`next-button ${selectedShape ? 'selected' : ''}`} 
                                onClick={() => setCurrentStep(2)}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step">
                            <div 
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseMove={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                                onMouseUp={(e) => e.stopPropagation()}
                            >
                                <HexColorPicker color={starColor} onChange={setStarColor} />
                            </div>
                            <button onClick={() => setCurrentStep(3)}>Next</button>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step">
                            <div className={`selected-shape ${selectedShape}`} style={{ 
                                width: `${tempSquareSize}px`, 
                                height: `${tempSquareSize}px`, 
                                backgroundColor: starColor,
                                margin: '10px auto',
                                color: 'white',
                                display: 'block'
                            }}></div>

                            <input 
                                type="range" 
                                value={tempSquareCost} 
                                onChange={onSliderChange} 
                                min="10" max="100000" 
                                onMouseDown={(e) => e.stopPropagation()} 
                            />
                            <div style={{color: 'white'}}>Cost: {tempSquareCost} Stars</div>
                            <button style={{width: '100%'}} onClick={() => setCurrentStep(4)}>Next</button>
                        </div>
                    )}

{currentStep === 4 && (
                            <div className="step">
                                <textarea placeholder="Enter something..." />
                                <button onClick={createShape}>Starta</button>
                            </div>
                        )}

                        <button onClick={toggleModal} style={{ color: 'red', position: 'absolute', top: '10px', left: '10px' }}>✖</button>
                    </div>
                </div>
            )}

            {createdSquares.map((square, index) => (
                <div
                    key={index}
                    className={`createdSquare ${square.shapeType}`}  // Use shape type here
                    style={{ 
                        backgroundColor: square.color,
                        border: `1px solid ${square.borderColor}`,
                        width: `${square.size}px`,
                        height: `${square.size}px`,
                        position: 'absolute',
                        left: square.x,
                        top: square.y,
                        cursor: 'pointer'
                    }}
                    onMouseDown={(e) => startDragSquare(e, index)}
                    onMouseUp={endDragSquare}
                    onMouseMove={moveSquare}
                >
                    <textarea
                        className="square-textbox"
                        placeholder="Enter text"
                        value={square.text}
                        onChange={(e) => handleSquareTextChange(e, index)}
                    />
                    <button onClick={() => handleSaveSquareComment(index)}>Save</button>
                    <div className="square-comments">
                        {square.comments.map((comment, cidx) => (
                            <div key={cidx}>{comment}</div>
                        ))}
                    </div>
                </div>
            ))}

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
                <div className="circle-content">
                    <div className="innerCircle"></div>
                    {circle.showGrid && (
                        <div className="grid">
                            {[...Array(9)].map((_, idx) => (
                                <div key={idx} className="grid-square">
                                    <div className="contentWrapper">
                                        {circle.activeTextbox.includes(idx) && (
                                            <div className="textboxWrapper">
                                                <textarea
                                                    className="textbox"
                                                    placeholder="Enter text"
                                                    onChange={(e) => handleTextboxChange(e, index, idx)}
                                                    value={circle.textValues[idx] || ""}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button className="spara" onClick={(e) => { e.stopPropagation(); setIsClick(false); handleSaveComment(index, idx); }}>Save</button>
                                            </div>
                                        )}
                    <div className="commentsWrapper">
                        {(circle.comments[idx] || []).map((comment, cidx) => (
                            <div 
                                key={comment.id} 
                                className={`commentBox ${selectedComment && selectedComment.circleIndex === index && selectedComment.commentIndex === cidx ? 'selected' : ''}`} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCommentClick(index, cidx, comment.id);
                                }}
                            >
                                {comment.text}
                                {(comment.id === selectedCommentId) && (
                                    <>
                                        <textarea 
                                            placeholder="Skriv en ny kommentar..."
                                            value={answers[comment.id] || ''}
                                            onChange={e => handleAnswerChange(comment.id, e.target.value)}
                                        ></textarea>
                                        <button onClick={() => saveAnswer(comment.id)}>Save Answer</button>
                                    </>
                                )}
                                {comment.replies && comment.replies.map(reply => (
                                    <div 
                                        key={reply.id}
                                        className={`reply ${reply.id === selectedReplyId ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCommentClick(index, cidx, reply.id);
                                        }}
                                    >
                                        {reply.text}
                                        {reply.id === selectedReplyId && (
                                            <>
                                                <textarea 
                                                    placeholder="Skriv en ny kommentar..."
                                                    value={answers[reply.id] || ''}
                                                    onChange={e => handleAnswerChange(reply.id, e.target.value)}
                                                ></textarea>
                                                <button onClick={() => saveAnswer(reply.id)}>Save Answer</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    ))}
</div>
</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
);

        }

export default App;