import wx from 'wxeact';
import { Component, PropTypes } from 'wxeact-immutable';

const { string, bool, func } = PropTypes;

class Todo extends Component {
  static propTypes = {
    id: string,
    title: string,
    createdAt: string,
    finished: bool,
    finishedAt: string,
    onRemove: func,
    onRestore: func,
    onFinish: func
  };

  constructor(props) {
    super(props);
    this.state = {
      icon: props.finished ? 'success_circle' : 'circle',
      className: props.finished ? 'todo-finished' : ''
    };
  }

  onUpdate(props) {
    this.setState({
      icon: props.finished ? 'success_circle' : 'circle',
      className: props.finished ? 'todo-finished' : ''
    });
  }

  handleRemove() {
    wx.showToast({ title: `删除成功`, icon: 'success', duration: 2000 });
    this.props.onRemove(this.props.id);
  }

  handleFinish() {
    if (this.props.finished) {
      this.props.onRestore(this.props.id);
    } else {
      this.props.onFinish(this.props.id);
    }
  }
}

export default Todo;
