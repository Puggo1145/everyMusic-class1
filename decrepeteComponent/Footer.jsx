import React, { Component } from 'react'
import img from './static/img/prevPage.png'
import {Link,Route,Switch,Redirect} from 'react-router-dom'
import Note from '../class1/note/Note'
import Length from '../class1/length/length'

export default class Footer extends Component {
	
	state={
		List:[
			{
				id:"1001",
				pathname:"note"
			},{
				id:"1002",
				pathname:"length"
			}
		],
		nextIndex:0,
		nextPathname:'',
		nextId:''
	}
	
	componentWillMount(){
		this.nextPage();
	}
	
	
	nextPage=()=>{
		console.log(window.location.pathname)
		const {List,nextIndex} = this.state
		List.forEach((item,index)=>{
			if('/class1/'+item.pathname === window.location.pathname){
				const temp = index+1
				this.setState({
					nextIndex:temp,
				})
			}
		})
		this.setState({
			nextPathname : List[nextIndex].pathname,
		})
	}
	
	

	
	render() {
		console.log("Fuck"+this.state.nextPathname)
		const {nextId,nextPathname} = this.state
		return (
			<div>
				<footer>
				    <div className="prevPageBtn" onClick={this.prePage}>
						<Link to={`/class1/${nextPathname}`}>
						<img src={img} alt=""/>
						</Link>
				    </div>
					
				    <div className="nextPageBtn" onClick={this.nextPage}>
						<Link to={`/class1/${nextPathname}`}>
						<img src={img} alt=""/>
						</Link>
				    </div>
					
				</footer>
				<Switch>
				<Route path="/class1/note" component={Note}></Route>
				<Route path="/class1/length" component={Length}></Route>
				<Redirect to="/class1/note"></Redirect>
				</Switch>
			</div>
		)
	}
}
