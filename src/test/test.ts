import './test.css';

const content = document.querySelector('.content');
content?.classList.add('test');

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'http://localhost:3334/test.css';
document.head.appendChild(link);

console.log('test');
