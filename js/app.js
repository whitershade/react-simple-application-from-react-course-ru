var my_news = [
  {
    author: 'Саша Печкин',
    text: 'В четверг, четвертого числа...'
  },
  {
    author: 'Просто Вася',
    text: 'Считаю, что $ должен стоить 8 гривен!'
  },
  {
    author: 'Гость',
    text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000'
  }
];

var Article = React.createClass({
  render: function() {
    var props = this.props.content;

    return(
      <div>
        <p className="news__text">{props.text}</p>
        <p className="news__author">{props.author}</p> {/* <p className="news__author">''+item.author+':'</p> */}
      </div>
    );
  }
});

var News = React.createClass({
  render: function() {
    var data = this.props.data,
        newsTemplate;

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
        <p className={'news__count ' + (data.length ? '' : 'none')}>Общее количество новостей: {data.length}</p> {/* Для работы с классами, когда их становится больше и условия становятся сложнее, можно использовать classNames (NPM пакет). */}
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <h3>Новости</h3>
        <News data = {my_news} /> {/* send data to News props */}
      </div>
    );
  }
});

ReactDOM.render(                  // ReactDOM.render(
  <App />,      //   React.createElement('h1', null, 'Привет, Мир!'),
  document.getElementById('app')  //   document.getElementById('app')
);
