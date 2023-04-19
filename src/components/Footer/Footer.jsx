import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import PubSub from 'pubsub-js';

import './Footer.css'

const routesOrder = [
  '/video',
  '/note',
  '/pitchgame',
  '/volumn',
  '/length',
  '/timbre',
  '/review',
];

class Footer extends Component {
  state = {
    promptNextPage: false,
  }

  componentDidMount() {
    PubSub.publish("ROUTES_ORDER", routesOrder);

    // 提示下一页
    this.pubsubToken = PubSub.subscribe('PROMPT_NEXT', () => {
      this.setState({ promptNextPage: true });
    });

  }


  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
  }


  goPrevPage = () => {
      const currentIndex = routesOrder.indexOf(this.props.location.pathname);
    
      if (currentIndex > 0) {
        this.props.history.push(routesOrder[currentIndex - 1]);
        PubSub.publish("PAGE_CHANGED", { pageIndex: currentIndex - 1, routesOrder });
      }
  };

  goNextPage = () => {
      const currentIndex = routesOrder.indexOf(this.props.location.pathname);
    
      if (currentIndex < routesOrder.length - 1) {
        this.props.history.push(routesOrder[currentIndex + 1]);
        PubSub.publish("PAGE_CHANGED", { pageIndex: currentIndex + 1, routesOrder });
      } else {
        window.location.href = "/";
      }
      if (this.state.promptNextPage) {
        this.setState({ promptNextPage: false });
      }
      if (currentIndex === 6) {
        console.log(1);
      }
  };

  render() {
    const currentIndex = routesOrder.indexOf(this.props.location.pathname);
    const { promptNextPage } = this.state;

    return (
      <footer>
        <div className="footer-content">
          <div className='footer-texts'>
            <h2>请手动点击按钮翻页</h2>
          </div>
          <div className="footer-page-routeBtn">
            {currentIndex > 0 && (
              <a className="footer-pageBtn prev" onClick={this.goPrevPage}></a>
            )}
            {currentIndex < routesOrder.length - 1 ? (
              <a className={promptNextPage ? "footer-pageBtn next promptNextPage" : "footer-pageBtn next"} onClick={this.goNextPage}></a>
            ) : (
              <a className="footer-pageBtn home" onClick={this.goNextPage}></a>
            )}
          </div>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);