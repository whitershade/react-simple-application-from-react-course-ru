window.ee = new EventEmitter();

var my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четверг, четвертого числа...',
    bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 8 гривен!',
    bigText: 'А евро я уже и не помню сколько стоило, 12 гривен?'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

var Article = React.createClass({
  propTypes: {
    content: React.PropTypes.shape({
      author: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired
    }).isRequired
  },

  getInitialState: function() {
    return {
      showMoreTextIsVisible: false
    };
  },

  readmoreClick: function(e) {
    e.preventDefault();
    this.setState({showMoreTextIsVisible: !this.state.showMoreTextIsVisible}, function() {
      console.log('State showMoreTextIsVisible was changed to ' + this.state.showMoreTextIsVisible);
    })
  },

  render: function() {
    var props = this.props.content,
        state = this.state;

   console.log('render Article'); // Изменение state вызывает render компонента
   return(
      <div>
        <p className="news__text">{props.text}</p>
        <p className="news__author">{props.author}</p> {/* <p className="news__author">''+item.author+':'</p> */}
        <a href="#"
           className='news__readmore'
           onClick={this.readmoreClick}>
           Подробнее
        </a>
        <p className={'news__big-text ' + (state.showMoreTextIsVisible ? '' : 'hide')}>{props.bigText}</p>
      </div>
    );
  }
});

var Add = React.createClass({
  getInitialState: function() {
    return {
        authorFieldIsEmpty: true,
        textFieldIsEmpty: true,
        checkRulesBoxIsEmpty: true
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },
  onBtnClickHandler: function(e) {
    e.preventDefault();
    let author = ReactDOM.findDOMNode(this.refs.author).value,
        text = ReactDOM.findDOMNode(this.refs.text).value;
    window.ee.emit('News.add', [{
        author: author,
        text: text,
        bigText: '...'
      }]);
  },
  onCheckRuleClick: function(e) {
    this.setState({ checkRulesBoxIsEmpty: !e.target.checked })
  },
  inputOnChange: function(fieldName, e) {
    (e.target.value.trim().length) ? this.setState({ ['' + fieldName]: false }) :
                                     this.setState({ ['' + fieldName]: true });
  },
  render: function() {
    const checkRulesBoxIsEmpty = this.state.checkRulesBoxIsEmpty,
          authorFieldIsEmpty = this.state.authorFieldIsEmpty,
          textFieldIsEmpty = this.state.textFieldIsEmpty;
    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          defaultValue=''
          placeholder='Ваше имя'
          ref='author'
          onChange={this.inputOnChange.bind(this, 'authorFieldIsEmpty')}
        />
        <textarea
          className='add__text'
          defaultValue=''
          placeholder='Текст новости'
          ref='text'
          onChange={this.inputOnChange.bind(this, 'textFieldIsEmpty')}
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' defaultChecked={false} ref='checkrule' onClick={this.onCheckRuleClick} />Я согласен с правилами
        </label>
        <button
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={checkRulesBoxIsEmpty || authorFieldIsEmpty || textFieldIsEmpty}>
          Показать alert
        </button>
      </form>
    );
  }
});

var News = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired /* если в пропсах не будет массива, то выдаст в консоль ошибку Failed propType: Required prop `data` was not specified in `News`. Check the render method of `App`.*/
  },

  getInitialState: function() {
    return {
      counter: 0
    };
  },

  incrementTotalNewsCounter: function() {
    this.setState({
      counter: ++this.state.counter // setState() - не изменяет this.state немедленно, а создает очередь изменений состояния. Доступ к this.state после вызова метода, потенциально может вернуть имеющееся (что равносильно - бывшее) значение. Постфиксная запись не изменит значения.
    });
  },

  render: function() {
    var data = this.props.data,
        newsTemplate;

    console.log('render News');

    if(data.length) {
      newsTemplate = data.map(function(item, index) {
        return (
          <li key={index} className="article">
            <Article content = {item} index = {index} />
          </li>
        )
      });
    } else {
      newsTemplate = "Увы, но новостей пока нет, приходите позже. ";
    }

    return (
      <div className="news">
        <ol className="news__list">
          {newsTemplate}
        </ol>
        <p className={'news__count ' + (data.length ? '' : 'hide')}
           onClick={this.incrementTotalNewsCounter}>
           Общее количество новостей: {data.length}
        </p> {/* Для работы с классами, когда их становится больше и условия становятся сложнее, можно использовать classNames (NPM пакет). */}
        <p>Счетчик кликов: {this.state.counter}</p>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      news: my_news
    };
  },
  componentDidMount: function() {
    /* Слушай событие "Создана новость"
      если событие произошло, обнови this.state.news
    */
    var that = this;
      window.ee.addListener('News.add', function(item) {
        var nextNews = item.concat(that.state.news);
        that.setState({news: nextNews});
      });
  },
  componentWillUnmount: function() {
    /* Больше не слушай событие "Создана новость" */
    window.ee.removeListener('News.add');
  },
  render: function() {
    return (
      <div className="app">
        <h3>Новости</h3>
        <Add />
        <News data = {this.state.news} /> {/* send data to News props */}
      </div>
    );
  }
});

ReactDOM.render(                  // ReactDOM.render(
  <App />,      //   React.createElement('h1', null, 'Привет, Мир!'),
  document.getElementById('app')  //   document.getElementById('app')
);
