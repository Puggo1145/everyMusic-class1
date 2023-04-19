import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Video from '../../pages/Video/Video'
import Note from '../../pages/Note/Note'
import PitchGame from '../../pages/PitchGame/PitchGame'
import Volumn from '../../pages/Volumn/Volumn'
import Length from '../../pages/Length/Length'
import Timbre from '../../pages/Timbre/Timbre'
import Review from '../../pages/Review/Review'


export default class content extends Component {
  render() {
    return (
      <Switch>
        <Route path="/video" component={Video} />
        <Route path="/note" component={Note} />
        <Route path="/pitchgame" component={PitchGame} />
        <Route path="/volumn" component={Volumn} />
        <Route path="/length" component={Length} />
        <Route path="/timbre" component={Timbre} />
        <Route path="/review" component={Review} />
        <Redirect from="/" to="/video" />
      </Switch>
    )
  }
}

