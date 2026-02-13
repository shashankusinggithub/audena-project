import { Item, ItemMedia } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";


export function SpinnerWrapper() {
  return (
    <div className="flex justify-center items-center">
      <Item>
        <ItemMedia>
          <Spinner />
        </ItemMedia>
      </Item>
    </div>
  );
}