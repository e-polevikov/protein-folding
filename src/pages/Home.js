import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <h1>Задача «Сворачивание белка»</h1>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempus iaculis urna id volutpat lacus. Semper viverra nam libero justo laoreet sit amet cursus sit. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Duis at consectetur lorem donec massa sapien. Viverra justo nec ultrices dui sapien. Penatibus et magnis dis parturient. Amet luctus venenatis lectus magna fringilla. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Euismod in pellentesque massa placerat duis ultricies lacus sed turpis. In iaculis nunc sed augue lacus viverra vitae congue eu. Amet est placerat in egestas erat imperdiet sed euismod nisi. Porttitor massa id neque aliquam vestibulum morbi blandit. Tortor at auctor urna nunc id cursus. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam.
      </div>
      <div>
        <ul>
          <li><Link to="/protein-folding/level-1">Уровень 1</Link></li>
          <li><Link to="/protein-folding/level-2">Уровень 2</Link></li>
          <li><Link to="/protein-folding/level-3">Уровень 3</Link></li>
          <li><Link to="/protein-folding/constructor">Конструктор</Link></li>
        </ul>
      </div>
    </div>
  );
}
