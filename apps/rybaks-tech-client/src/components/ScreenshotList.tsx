import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { observer } from "mobx-react-lite";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useStores } from "../stores/RootStore";
import { Loader } from "./Loader/Loader";
import { Box, Typography } from "@mui/material";
import TimelineOppositeContent, { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";

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
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">09:30 am</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <ImageList cols={6}>
              {selfPageStore.loadedScreenshots.map((item) => (
                <ImageListItem key={item.id}>
                  <img
                    srcSet={`data:image/jpeg;base64,${item.base64}`}
                    src={`data:image/jpeg;base64,${item.base64}`}
                    alt={item.description}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">10:00 am</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>Code</TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  ) : (
    <Loader />
  );
});

export default ScreenshotList;
