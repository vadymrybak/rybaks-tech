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
import { useEffect, useRef } from "react";
import { Logger } from "../utils/logger";

const ScreenshotList = observer(() => {
  const { selfPageStore } = useStores();
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !selfPageStore.screenshotsLoading && !selfPageStore.endReached) {
        Logger.debug(`(ScreenshotList) handleFetchMoreItems`);
        selfPageStore.handleFetchMoreItems();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef]);

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
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          selfPageStore.handleThumbnailClick(screenshot);
                        }}
                        srcSet={`data:image/jpeg;base64,${screenshot.base64}`}
                        src={`data:image/jpeg;base64,${screenshot.base64}`}
                        alt={screenshot.description}
                        // loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
      {selfPageStore.screenshotsLoading && <Loader />}
      <div ref={loadMoreRef} style={{ height: "20px", background: "transparent" }} />
    </Box>
  ) : (
    <Loader />
  );
});

export default ScreenshotList;
