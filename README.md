# ChatGPT Message Switcher

## Key Features:

- **Easy Navigation:** Use up and down buttons to move through user and assistant messages separately.
- **Role-Based Control:** Manage message access and navigation for 'user' and 'assistant' roles independently.
- **User-Friendly:** Simple and intuitive interface for all users.
- **Efficient:** Quickly find and respond to messages, improving communication flow.

## Instructions

- **Open Chat List:** Right-click to open the chat list.
- **Draggable Panel:** Drag the panel using the dot in the panel. The panel can be fixed, and preferences will be saved in local storage.
- **Stay on Top:** Enable the "Stay on top" option to prevent the chat list from closing.
- **Switch Chats:** Use the up and down arrow buttons in the panel to switch between chats.
- **Switch Roles:** Use the top-left button to switch between chat roles.

## TODO:

- Add a list to the side panel.
- Add a resizable component to the context menu.
- Decide whether to implement keyboard control features.
- Decide whether to save the dragged position.

## Known Bugs:

- If the assistant has no message reply (e.g., only an image), the element cannot be captured since the function retrieves the `data-message-author-role` attribute.
- Check if the text is truncated (ellipsis) to disable the expand button.
