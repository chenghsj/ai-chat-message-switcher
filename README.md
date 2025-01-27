# AI Chat Message Switcher

[Chrome](https://chrome.google.com/webstore/detail/eihabkibbhhklajnohjngcnfgnobodbj) <br>
[Edge](https://microsoftedge.microsoft.com/addons/detail/chatgpt-message-switcher/jklfagjjdkaclkdbicaoheplcaeoiojm)

## Key Features

- **Supports:** Works with both ChatGPT, Gemini and DeepSeek.
- **Role-Based Control:** Manage message access and navigation for `user` and `assistant` roles independently.
- **User-Friendly:** Simple and intuitive interface for all users.
- **Efficient:** Quickly find and respond to messages, improving communication flow.

## Instructions

- **Open Chat List:** Right-click the panel to open the chat list.
- **Draggable Panel:** Drag the panel using the dot in the panel. The panel can be fixed, and preferences will be saved in local storage.
- **Resizable:** The menu list can be resized by dragging the edge of the list container.
- **Stay on Top:** Enable the "Stay on top" option to prevent the chat list from closing.
- **Switch Chats:** Use the up and down arrow buttons in the panel to switch between chats.
- **Switch Roles:** Use the top-left button to switch between chat roles.

## TODO

- Add a list to the side panel.
- Decide whether to implement keyboard control features.
- Fix window resizing panel position issue.

## Known Bugs

- If the assistant has no message reply (e.g., only an image), the element cannot be captured since the function retrieves the `data-message-author-role` attribute
