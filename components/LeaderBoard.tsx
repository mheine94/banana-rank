import { LeaderBoardEntry } from "@/redux/types";
import React, { useState } from "react";
import { StyleSheet, Vibration, View } from "react-native";
import { DataTable } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

interface LeadeBoardProps {
  leaderBoard: LeaderBoardEntry[];
}

const VIBRATION_LEN_MS = 50;
const ITEMS_PER_PAGE = 10;

export default function LeaderBoard({ leaderBoard }: LeadeBoardProps) {
  const [page, setPage] = useState<number>(0);

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, leaderBoard.length);

  const fullPages = Math.floor(leaderBoard.length / ITEMS_PER_PAGE);
  const partialPages = leaderBoard.length % ITEMS_PER_PAGE;

  let numberOfItemsPerPageList: number[] = [];

  for (let i = 0; i < fullPages; i++) {
    numberOfItemsPerPageList.push(ITEMS_PER_PAGE);
  }

  if (partialPages > 0) {
    numberOfItemsPerPageList.push(partialPages);
  }

  const copyToClipboard = async (value: string) => {
    Vibration.vibrate(VIBRATION_LEN_MS);
    await Clipboard.setStringAsync(value);
  };

  const getRowBackGroundColor = (
    entry: LeaderBoardEntry,
  ): string | undefined => {
    return entry.selected ? "#d0e3ff" : undefined;
  };

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.rank}>Rank</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title numeric>Bananas</DataTable.Title>
        </DataTable.Header>

        {leaderBoard.slice(from, to).map((entry) => (
          <DataTable.Row
            style={{ backgroundColor: getRowBackGroundColor(entry) }}
            key={entry.user.rank}
            onLongPress={() => copyToClipboard(entry.user.name)}
          >
            <DataTable.Cell style={styles.rank}>
              {entry.user.rank}
            </DataTable.Cell>
            <DataTable.Cell>{entry.user.name}</DataTable.Cell>
            <DataTable.Cell numeric>{entry.user.bananas}</DataTable.Cell>
          </DataTable.Row>
        ))}

        {leaderBoard.length > ITEMS_PER_PAGE && (
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(leaderBoard.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${leaderBoard.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={ITEMS_PER_PAGE}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
          />
        )}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  rank: {
    flex: 0.3,
  },
});
