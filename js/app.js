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

var Comments = React.createClass({
  render: function() {
    return (
      <div className="comments">
        Нет новостей - комментировать нечего.
      </div>
    )
  }
})

var News = React.createClass({
  render: function() {
    var data = this.props.data,
        newsTemplate;

    if(data.length) {
      newsTemplate = data.map(function(item, index) {
        return (
          <div key={index}> {/* Для геренации ключа нужно использовать id либо хэш, index не надежен, поскольку при удалении элемента из массива он будет идентифицировать уже другой элемент */}
          <li>
            <p className="news__text">{item.text}</p>
            <p className="news__author">{item.author}:</p> {/* <p className="news__author">''+item.author+':'</p> */}
          </li>
          </div>
          )
      });
    } else {
      newsTemplate = "Увы, но новостей пока нет, приходите позже. ";
    }

    return (
      <div className="news">
        <ol>
          {newsTemplate}
        </ol>
        <p className={data.length ? '' : 'none'}>Общее количество новостей: {data.length}</p> {/* Для работы с классами, когда их становится больше и условия становятся сложнее, можно использовать classNames (NPM пакет). */}
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        Всем привет, я компонент App! Я умею отображать новости.
        <News data = {my_news}/> {/* send data to News props */}
        <Comments />
      </div>
    );
  }
});

ReactDOM.render(                  // ReactDOM.render(
  <App />,      //   React.createElement('h1', null, 'Привет, Мир!'),
  document.getElementById('app')  //   document.getElementById('app')
);
