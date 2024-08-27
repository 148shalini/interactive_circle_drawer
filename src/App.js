import React,{useState,useRef,useEffect} from 'react'
import './App.css';

const CANVAS_WIDTH=800;
const CANVAS_HEIGHT=600;
const MIN_RADIUS=10;
const MAX_RADIUS=50;
const OVERLAP_COLOR='red';


function App() {
  const [circles,setCircles]=useState([]);
  const canvasRef=useRef(null);

  useEffect(() => {
    drawCircles();
  }, [circles]);

  const handleCanvasClick=(event)=>{
    const canvas=canvasRef.current;
    const rect=canvas.getBoundingClientRect();
    const x=event.clientX-rect.left;
    const y=event.clientY-rect.top;

    const newCircle={
      x,
      y,
      radius:Math.random()*(MAX_RADIUS-MIN_RADIUS)+MIN_RADIUS,
      color:getRandomColor(),
      overlapping:false,
    };
    setCircles((prevCircles)=>{
      const updateCircles=[...prevCircles,newCircle];
      return checkOverlaps(updateCircles);
    });

  };

  const checkOverlaps=(circleArray)=>{
    return circleArray.map((circle,index)=>{
      let isOverlapping=false;
      for (let i=0;i<circleArray.length;i++){
        if(i!==index && circlesOverlap(circle,circleArray[i])){
          isOverlapping=true;
          break;
        }
      }
      return { ...circle,overlapping: isOverlapping};

    });
  };

  const circlesOverlap=(circle1,circle2)=>{
    const dx=circle1.x-circle2.x;
    const dy=circle1.y-circle2.y;
    const distance=Math.sqrt(dx*dx+dy*dy);
    return distance<circle1.radius+circle2.radius;
  };

  const drawCircles=()=>{
    const canvas=canvasRef.current
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    circles.forEach((circle)=>{
      ctx.beginPath();
      ctx.arc(circle.x,circle.y,circle.radius,0,2*Math.PI);
      ctx.fillStyle=circle.overlapping?OVERLAP_COLOR:circle.color;
      ctx.fill();
      ctx.closePath();
    });
  };

  const getRandomColor=()=>{
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
  };
  
  return (
    <div className="App">
      <h1>Interactive Circles Drawer</h1>
      <p>Click on the canvas to draw circles.Overlapping cirlces will turn red</p>
      <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      style={{border:'1px solid black'}}
      />
      
    </div>
  );
}

export default App;
