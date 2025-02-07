import React, { useRef } from "react";
import { Box, Grid, Card, CardMedia } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type ViewMode = "grid" | "loupe" | "survey" | "fullscreen";

const photos = [
  { id: 1, src: "/images/J&M-2.jpg" },
  { id: 2, src: "/images/J&M-3.jpg" },
  { id: 3, src: "/images/J&M-4.jpg" },
  { id: 4, src: "/images/J&M-5.jpg" },
  { id: 5, src: "/images/J&M-10.jpg" },
  { id: 6, src: "/images/J&M-11.jpg" },
  { id: 7, src: "/images/J&M-12.jpg" },
  { id: 8, src: "/images/J&M-13.jpg" },
  { id: 9, src: "/images/J&M-14.jpg" },
  { id: 11, src: "/images/J&M-15.jpg" },
  { id: 12, src: "/images/J&M-16.jpg" },
  { id: 13, src: "/images/J&M-17.jpg" },
  { id: 14, src: "/images/J&M-18.jpg" },
  { id: 15, src: "/images/J&M-19.jpg" },
  { id: 16, src: "/images/J&M-20.jpg" },
  { id: 17, src: "/images/J&M-21.jpg" },
  { id: 18, src: "/images/J&M-22.jpg" },
  { id: 19, src: "/images/J&M-23.jpg" },
  { id: 20, src: "/images/J&M-24.jpg" },
  { id: 21, src: "/images/J&M-25.jpg" },
];

const PhotoGrid: React.FC<
  { selectedPhotos: number[]; setSelectedPhotos: (photos: number[]) => void; viewMode: ViewMode; magnificationFactor: number; loupeIndex: number; setLoupeIndex: (index: number) => void }> =
  ({ selectedPhotos, setSelectedPhotos, viewMode, magnificationFactor, loupeIndex, setLoupeIndex }) => {

    const lastSelectedRef = useRef<number | null>(null);

    const toggleSelection = (id: number, shiftKey: boolean) => {
      if (viewMode !== "grid") return;
      if (shiftKey && lastSelectedRef.current !== null) {
        const start = Math.min(lastSelectedRef.current, id);
        const end = Math.max(lastSelectedRef.current, id);
        const rangeSelection = photos.filter(photo => photo.id >= start && photo.id <= end).map(photo => photo.id);
        setSelectedPhotos([...new Set([...selectedPhotos, ...rangeSelection])]);
      } else {
        setSelectedPhotos(selectedPhotos.includes(id) ? selectedPhotos.filter(photoId => photoId !== id) : [...selectedPhotos, id]);
      }
      lastSelectedRef.current = id;
    };

    const getLoupeModePhoto = (): string => {
      if (selectedPhotos.length === 1) {
        // return photos.find(photo => photo.id === selectedPhotos[0])!.src;
        return photos.find(photo => photo.id === selectedPhotos[loupeIndex])!.src;
      }
      return photos[loupeIndex]?.src;
    }

    if (viewMode === "loupe" && selectedPhotos.length > 0) {
      console.log('render PhotoGrid: loupeIndex', loupeIndex);
      return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "calc(100vh - 64px - 128px)", backgroundColor: "white" }}>
          <img
            src={getLoupeModePhoto()}
            alt="Loupe View"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </Box>
      );
    }

    if (viewMode === "fullscreen" && selectedPhotos.length === 1) {
      const selectedPhoto = photos.find(photo => photo.id === selectedPhotos[0]);
      return selectedPhoto ? <CardMedia component="img" image={selectedPhoto.src} alt="Fullscreen View" sx={{ width: "100vw", height: "100vh" }} /> : null;
    }

    /*    
    Material-UI (MUI) Grid follows a 12-column system, meaning each row is divided into 12 equal columns by default.
      <Grid item lg={2} />
    means this grid item spans 2 out of 12 columns, making it (2/12) * 100% = 16.67% of the row width
    and meaning that there are 6 columns.

    as magnification factor gets higher, the lg value (as returned by this function) should get higher to make each column wider.

    function could be named getNumberOfColumnsOutOf12 columns.

    the return value of this fuction should be the number of columns out of 12 that the grid item should span.

    the baseCols argument is the number of columns that the grid item should span at a magnification factor of 1.0
    magnificationFactor is a number that is greater than 0.0 and represents how much the user has zoomed in on the grid.
    magnificationFactor = 2, means the user has zoomed in by 2x, so the grid should show baseCols / 2 and the value for
    NumberOfColumnsOf12ThatThisColumnSpans is 8.

    */

    const getColumnsSpanned = (baseColumnCount: number): number => {
      const columnsSpanned: number = Math.round(12 / (baseColumnCount / magnificationFactor));
      console.log('getColumnsSpanned: ', magnificationFactor, columnsSpanned);
      return Math.round(12 / (baseColumnCount / magnificationFactor));
    }

    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {photos.map((photo) => {
          const isSelected = selectedPhotos.includes(photo.id);
          return (
            <Grid
              item
              key={photo.id}
              // xs={getDynamicGridSize(6)}
              // sm={getDynamicGridSize(4)}
              // md={getDynamicGridSize(3)}
              lg={getColumnsSpanned(4)}
              onClick={(e) => toggleSelection(photo.id, e.shiftKey)}
            >
              <Card
                sx={{
                  position: "relative",
                  border: isSelected ? "2px solid blue" : "none",
                  cursor: "pointer",
                  '&:hover': {
                    opacity: 0.8,
                  }
                }}
              >
                <CardMedia component="img" image={photo.src} alt={`Photo ${photo.id}`} />
                {isSelected && (
                  <CheckCircleIcon
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Card>
            </Grid>);
        })}
      </Grid>
    );
  };

export default PhotoGrid;