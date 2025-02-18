import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/RootStore";

const ScreenshotList = observer(() => {
  const { selfPageStore } = useStores();
  
  return (
    <ImageList cols={3}>
      {selfPageStore.loadedScreenshots.map((item) => (
        <ImageListItem key={item.id}>
          <img srcSet={`data:image/jpeg;base64,${item.base64}`} src={`data:image/jpeg;base64,${item.base64}`} alt={item.description} loading="lazy" />
        </ImageListItem>
      ))}
    </ImageList>
  );
});

export default ScreenshotList;
