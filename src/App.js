import { withRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // 根据location改变Header标题

import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Content from './components/Content/Content.jsx';
import Context from './components/Context/Context.jsx'


import './App.css';

function App(props) {
  const location = useLocation();
  const shouldShowContext = location.pathname !== '/review';

  // 根据路径设置标题
  const getTitle = () => {
    switch (location.pathname) {
      case '/video':
        return '先导视频';
      case '/note':
        return '音高';
      case '/pitchgame':
        return '音高';
      case '/volumn':
        return '强弱';
      case '/length':
        return '音值';
      case '/timbre':
        return '音色';
      case '/review':
        return '复习一下';
      default:
        return '未知页面';
    }
  };

  const title = getTitle();

  return (
    <div className="class1-center">
      <Header title={title} />
      <Content />
      {shouldShowContext && <Context />}
      <Footer />
    </div>
  );
}

export default App;
