import { useState } from 'react';

import {
  Center,
  Highlight,
  ScrollArea,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons';

import useStyles from './GamePlaysTable.styles';

import { useGamesToPlay } from '../GamesToPlayContext/GamesToPlayContext';

interface GamePlaysTableProps {
  users: string[];
}

function formatDateString(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}`;
}

function GamePlaysTable({ users }: GamePlaysTableProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const { gamesToPlayState } = useGamesToPlay();
  const isMobile = useMediaQuery('(max-width: 900px)');

  if (!gamesToPlayState.selectedGameId) {
    return null;
  }
  if (!gamesToPlayState.selectedGamePlays) {
    return <div>Cannot find game plays</div>;
  }

  if (isMobile) {
    return (
      <Center inline>
        <IconInfoCircle />
        <Text>Plays view not available in mobile</Text>
      </Center>
    );
  }

  const rows = gamesToPlayState.selectedGamePlays.map((play) => {
    return (
      <tr key={play.id}>
        <td>{formatDateString(play.date)}</td>
        <td>{play.location}</td>
        <td>
          {play.players
            .map((player) => {
              return player.name;
            })
            .join(', ')}
        </td>
        <td>
          <Highlight highlight={users}>
            {play.players
              .filter((player) => {
                return player.username !== '';
              })
              .map((player) => {
                return player.username;
              })
              .join(', ')}
          </Highlight>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Title order={3}>Game Plays</Title>
      <ScrollArea
        onScrollPositionChange={({ y }) => {
          return setScrolled(y !== 0);
        }}
        sx={{
          height: 300,
        }}
      >
        <Table
          sx={{
            minWidth: 700,
          }}
        >
          <thead
            className={cx(classes.header, {
              [classes.scrolled]: scrolled,
            })}
          >
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Players</th>
              <th>Bgg users</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

export default GamePlaysTable;
