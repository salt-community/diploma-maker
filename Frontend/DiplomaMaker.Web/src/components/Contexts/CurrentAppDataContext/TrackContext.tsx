import { createContext, useContext, useState } from "react";
import { TrackResponse } from "../../../util/types";


type TrackContextType = {
  tracks: TrackResponse[];
  currentTrackIndex: number;
  setTracks: (tracks: TrackResponse[]) => void;
  setCurrentTrackIndex: (index: number) => void;
};

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const useTrack = () => {
  const context = useContext(TrackContext);
  if (!context) throw new Error("useTrack must be used within a TrackProvider");
  return context;
};

export const TrackProvider = ({ children }: { children: React.ReactNode }) => {
  const [tracks, setTracks] = useState<TrackResponse[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

  return (
    <TrackContext.Provider value={{ tracks, currentTrackIndex, setTracks, setCurrentTrackIndex }}>
      {children}
    </TrackContext.Provider>
  );
};
