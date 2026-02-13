// import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipWrapper({hoverText}: {hoverText: string}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <h1 className="text-ellipsis truncate whitespace-nowrap w-[20vw]">{hoverText}</h1>
      </TooltipTrigger>
      <TooltipContent>
        <p>{hoverText}</p>
      </TooltipContent>
    </Tooltip>
  )
}
