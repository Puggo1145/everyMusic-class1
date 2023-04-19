import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import './Timbre.css';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

async function loadAudioFile(src) {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}


export default class Timbre extends Component {
  state = {
    interactionEnabled: false,
    instruments: {
      piano: {
        name: '钢琴',
        audioFile: require('../../static/timbre/audio/piano.mp3'),
        buffer: null,
        source: null,
        progress: 0,
      },
      guitar: {
        name: '吉他',
        audioFile: require('../../static/timbre/audio/guitar.mp3'),
        buffer: null,
        source: null,
        progress: 0,
      },
      violin: {
        name: '小提琴',
        audioFile: require('../../static/timbre/audio/violin.mp3'),
        buffer: null,
        source: null,
        progress: 0,
      },
    },
    currentlyPlaying: null,
  };


  async componentDidMount() {
    const instruments = { ...this.state.instruments };
    for (const instrument in instruments) {
      if (instruments.hasOwnProperty(instrument)) {
        const audioBuffer = await loadAudioFile(instruments[instrument].audioFile);
        instruments[instrument].buffer = audioBuffer;
      }
    }
    this.setState({ instruments });

    this.pubsubToken = PubSub.subscribe('CONTEXT_HIDDEN', () => {
      this.setState({ interactionEnabled: true });
    });
  }

  handleClick = (instrument) => {
    const instruments = { ...this.state.instruments };

    if (this.state.currentlyPlaying === instrument) {
      instruments[instrument].source.stop();
      instruments[instrument].source = null;
      instruments[instrument].progress = 0;
      this.setState({ instruments, currentlyPlaying: null });
    } else {
      if (this.state.currentlyPlaying) {
        instruments[this.state.currentlyPlaying].source.stop();
        instruments[this.state.currentlyPlaying].source = null;
        instruments[this.state.currentlyPlaying].progress = 0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = instruments[instrument].buffer;
      source.connect(audioContext.destination);
      source.start();

      instruments[instrument].startTime = audioContext.currentTime;

      source.onended = () => {
        instruments[instrument].source = null;
        instruments[instrument].progress = 0;
        this.setState((prevState) => {
          if (prevState.currentlyPlaying === instrument) {
            return { instruments, currentlyPlaying: null };
          } else {
            return null;
          }
        });
      };

      instruments[instrument].source = source;
      this.setState({ instruments, currentlyPlaying: instrument });

      const updateProgress = () => {
        if (this.state.currentlyPlaying === instrument && instruments[instrument].buffer) {
          const progress = (audioContext.currentTime - instruments[instrument].startTime) / instruments[instrument].buffer.duration;
          instruments[instrument].progress = progress;
          this.setState({ instruments });

          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    }
  };



  render() {
    const { instruments } = this.state;

    return (
      <div className="timbre-center">
        <div className="timbre-timbreSection">
          {Object.keys(instruments).map((instrument) => {
            const progress = instruments[instrument].progress;
            const radius = 45; // Convert rem to pixels
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = (1 - progress) * circumference;

            const playingClass = this.state.currentlyPlaying === instrument ? 'timbre-playing' : '';

            return (
              <div
                className={`timbre-${instrument} ${playingClass}`}
                key={instrument}
                onClick={() => this.handleClick(instrument)}
              >
                <h3>{instruments[instrument].name}</h3>
                <svg className="timbre-progress-ring" viewBox="0 0 100 100">
                  <circle
                    className="circle-bg"
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                  ></circle>
                  <circle
                    className="circle"
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                    style={{
                      strokeDasharray: `${2 * Math.PI * radius}px`,
                      strokeDashoffset: `${(1 - progress) * 2 * Math.PI * radius}px`,
                    }}
                  ></circle>
                </svg>

              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
