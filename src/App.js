import React from 'react';
import Style from './App.css';

const DIAMETER=60;

const letters = {
  h:[[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[4,4],[4,5],[4,6],[4,7],[1,7],[2,7],[3,7],[5,7],[6,7],[7,7]]
}



class Circle extends React.Component {

  constructor(props){
    super(props);
   //[""].forEach((method)=>this[method]=this[method].bind(this));
  }

  render(){
    const {touched,traced,row,col} = this.props;
    return  <div
     style={{height:DIAMETER,width:DIAMETER}}
     className={`circle ${traced ? "circleTraced":''} ${touched ? "circleTouched":''} `} 
     />
  }
}

const Row = ({col,touchCircle,touchedRowState,tracedRowState}) => {
  const id = [0,1,2,3,4,5,6,7,8,9,10];
  return <div className="row">
    {id.map((key)=>{
      return <Circle 
      key={`row-${key}`}
      row={key}
      col={col}
      touchCircle={touchCircle}
      traced={tracedRowState[key]}
      touched={touchedRowState[key]}
       />
    })}
  </div>
}

class AudioComp extends React.Component {
  componentDidMount() {
    const audioEl = document.getElementsByClassName("audio-element")[0];
    audioEl.play()
  }

  render() {
    return (
      <div>
        <audio className="audio-element">
          <source src={`${this.props.src}`} ></source>
        </audio>
      </div>
    )
  }
};

class App extends React.Component {

  constructor(props){
    super(props);
    const traced = this.getBlanc();
    const touched = this.getBlanc();
    this.state = {traced,touched,audioSrc:false};
    this.divRef = React.createRef();
    ["touchCircle","getH","compare"].forEach(method=>this[method]=this[method].bind(this));
  }

  componentDidMount(){
    this.getH();
  }

  compare(){
    const {traced,touched} = this.state;
    for(let I=0;I<traced.length;I++){
      for(let J=0;J<traced[I].length;J++){
        if(traced[I][J]!=touched[I][J]){
          this.setState({audioSrc:"/failed.mp3",traced:this.getBlanc(),touched:this.getBlanc()});
          setTimeout(()=>{
            this.setState({audioSrc:null});
            this.getH()
          },5000);
          return;
        }
      }
    }
    this.setState({audioSrc:"/success.mp3"});
  }

  getH(){
    this.count = 0;
    const ref= window.setInterval(()=>{
      const point = letters.h[this.count++];
      console.log(point)
      if(point){
        this.setState(prevState=>{
          const {traced}= prevState;
          traced[point[0]][point[1]] = true;
          return {traced};
        })
      }else{
        window.clearInterval(ref);
      }
    },500);
  }

  touchCircle(e){
    const offsetTop = this.divRef.current.offsetTop;
    const offsetX = this.divRef.current.offsetLeft;
    const {clientX,clientY} = e.touches[0] || {};
    if(!offsetX || !offsetTop ) return; 

    const row=Math.floor((clientX-offsetX)/DIAMETER);
    const col=Math.floor((clientY-offsetTop)/DIAMETER);
    if(row<0 || col < 0|| col> 8 || row>10 || isNaN(col) || isNaN(row)) return;
    this.setState(prevState=>{
      const touched = prevState.touched;
      touched[col][row] = true;
      return {touched};
    })
  }

  getBlanc(){
    const row = [];
    for(let I=0;I<9;I++){
      const col = Array(11).fill(false);
      row.push(col);
    }
    return row;
  }


  render(){
    const id = [0,1,2,3,4,5,6,7,8];
    const audioSrc = this.state.audioSrc;
    return (
      <div className="App">
        <header className="App-header" 
        >
        <div ref={this.divRef}
          onTouchStart={this.touchCircle}
          onTouchMove={this.touchCircle}
          onTouchEnd={this.touchCircle}>
        {id.map((key)=>(
          <Row
            key={`col-${key}`} 
            col={key}
            touchedRowState={this.state.touched[key]} 
            tracedRowState={this.state.traced[key]}
           />))}
        </div>
        {audioSrc && <AudioComp src={audioSrc} />}
        <img src="/check.png" onClick={this.compare}/>

        </header>
      </div>
    );
  }
}

export default App;
