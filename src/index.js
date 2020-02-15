/**
 * Created by 沈北辰 on 2020/2/10.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return(
    <button className="square" onClick={props.onClick1}>
        {props.value}
    </button>);
}
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]}
            onClick1={()=>this.props.onClick(i)}
            />
        );
    }

    render() {
        return(
            <div>
                {
                    //3.使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）
                    Array(3).fill(null).map((itemx, x) => (
                        <div className="board-row" key={x}>
                            {
                                Array(3).fill(null).map((itemy, y) => (
                                    this.renderSquare(3 * x + y)
                                ))
                            }
                        </div>
                    ))
                }
            </div>
    );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history:[{squares:Array(9).fill(null)}],
            position:[{
                row : null,
                column: null,
            }],
            stepNumber: 0,
            xIsNext:true,
            sort:true,
        }
    }

    handleClick(i){
        //position记录坐标
        const position =this.state.position.slice(0,this.state.stepNumber + 1);
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current=history[history.length-1];
        const squares = current.squares.slice();
        if(calculateWinner(squares)||squares[i]){
            return;
        }
        squares[i]=this.state.xIsNext? 'X':'O';

        const row = parseInt(i%3+1);
        const column = parseInt(i/3+1);
        this.setState({
            history:history.concat([{
                squares:squares,
            }]),
            position:position.concat([{
                row : row,
                column: column,
            }]),
            stepNumber: history.length,
            xIsNext:!this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    changeSquence(){
        this.setState({
            sort:!this.state.sort,
        });
    }
    render() {
        //计算winner，为了保持react的不可变性，需要复制对象
        const history=this.state.history;
        const position = this.state.position;
        const current=history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);

        const moves = history.map((step,move)=>{

            //1.加入行列号
           const desc = move ?
               'go to move #' + move + '最后落棋点：('+position[move].row+ ','+position[move].column+ ')':
               'go to start';
            //2.在历史记录列表中加粗显示当前选择的项目。
           let font =  (move==this.state.stepNumber)?
               {fontWeight:'bold'}:
               {fontWeight:'normal'};
           return (
               <li key={move.id}>
                   <button style={font} onClick={()=>this.jumpTo(move)} >{desc}</button>
               </li>
           );
        });

        let status;
        // 5.每当有人获胜时，高亮显示连成一线的 3 颗棋子。
        if(winner){
            status = "Winner：" + winner.winnerName;
            for (let i of winner.squares){
                document.getElementsByClassName('square')[i].style= "background: lightblue;";
            }
        // 6.当无人获胜时，显示一个平局的消息。
        }else if (this.state.stepNumber===9){
            status='No winner';
        }
        else {
            status = 'Next player: '+(this.state.xIsNext ? 'X':'O');
        }
        return (
            <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i)=>this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{ status }</div>
            {/*4.添加一个可以升序或降序显示历史记录的按钮。*/}
            <button onClick={()=>this.changeSquence()}>{this.state.sort ? "倒序":"正序"}</button>
            <ol>{this.state.sort ? moves:moves.reverse()}</ol>
            </div>
            </div>
    );
    }
}

// ========================================

ReactDOM.render(
<Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                squares: [a, b, c],
                winnerName:squares[a],
            };
        }
    }
    return null;
}