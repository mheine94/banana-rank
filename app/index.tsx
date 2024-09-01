import { useState } from "react";
import { memoizedLeaderBoardUsers } from "@/redux/selectors";
import { AppState } from "@/redux/types";
import { useAppSelector } from "../redux/hooks";

import GrowingImageContainer, {
  ImageSize,
} from "@/components/GrowingImageContainer";
import LeaderBoard from "@/components/LeaderBoard";
import Options from "@/components/Options";
import SearchComponent from "@/components/SearchComponent";

export default function Index() {
  const [searched, setSearched] = useState<string | null>(null);

  const leaderBoardUsers = useAppSelector((state: AppState) =>
    memoizedLeaderBoardUsers(state)(searched),
  );

  const handleSearch = (search: string | null) => {
    setSearched(search);
  };

  const scaleImageTo =
    leaderBoardUsers.length > 0 ? ImageSize.SMALL : ImageSize.BIG;

  return (
    <GrowingImageContainer scaleTo={scaleImageTo}>
      <SearchComponent leaderBoard={leaderBoardUsers} onSearch={handleSearch} />
      <Options leaderBoard={leaderBoardUsers} />

      {leaderBoardUsers.length > 0 && (
        <LeaderBoard leaderBoard={leaderBoardUsers} />
      )}
    </GrowingImageContainer>
  );
}
