import {
  Timeline,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import { Box } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/RootStore";
import { Loader } from "./Loader/Loader";

const ScreenshotList = observer(() => {
  const { selfPageStore } = useStores();

  return selfPageStore.gamesLoaded ? (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.05,
          },
        }}
      >
        {Object.entries(selfPageStore.loadedScreenshots).map(([day, screenshots]) => {
          return (
            <TimelineItem key={day}>
              <TimelineOppositeContent color="textSecondary">{day}</TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <ImageList cols={6}>
                  {screenshots.map((screenshot) => (
                    <ImageListItem key={screenshot.id}>
                      <img
                        srcSet={`data:image/jpeg;base64,${screenshot.base64}`}
                        src={`data:image/jpeg;base64,${screenshot.base64}`}
                        alt={screenshot.description}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  ) : (
    <Loader />
  );
});

export default ScreenshotList;
