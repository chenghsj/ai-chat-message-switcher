import { createRoot } from 'react-dom/client';
import App from '../../components/app';
import './style.css';

function main() {
  const div = document.createElement('div');
  div.id = 'chat-message-switcher';
  div.classList.add('chat-message-switcher-container');
  document.body.appendChild(div);

  const rootContainer = document.querySelector('#chat-message-switcher');
  if (!rootContainer) throw new Error("Can't find Content root element");
  const root = createRoot(rootContainer);

  root.render(<App />);
}

main();
