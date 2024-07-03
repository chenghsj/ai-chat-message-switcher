import {
  Pin,
  Hand
} from "lucide-react"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { clearStorageData, setStorageData } from "@src/config/storage"
import { useDraggable } from "@src/hooks/use-draggable"
import { useContextMenu } from "@src/hooks/use-context-menu"
import { useDropdown } from "@src/hooks/use-dropdown"

export function SettingsMenu() {
  // const {open, setOpen} = useDropdown();
  const {isDraggable, setIsDraggable} = useDraggable();
  const {pinned, setPinned} = useContextMenu();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-between">
            <div className="flex">
              <Pin className="mr-2 h-4 w-4" />
            <Label htmlFor="pin-menu">Stay on top</Label>
            </div>
            <Switch id="pin-menu" 
             onClick={async () => {
            await setStorageData((data) => ({
              ...data,
              pinned: !pinned,
            }));
            setPinned(!pinned);
          }}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between">
            <div className="flex">
              <Hand className="mr-2 h-4 w-4" />
            <Label htmlFor="panel-graggable">Draggable</Label>
            </div>
            <Switch 
            id="panel-graggable" 
            onClick={async () => {
            await setStorageData((data) => ({
              ...data,
              draggable: !isDraggable,
            }));
            setIsDraggable(!isDraggable);
          }}
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
            className="w-full"
            size='sm'
            onClick={() =>{
              clearStorageData().then(() => {
                console.log("Storage cleared");
              })
            }}
            >
              Reset
              </Button>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
