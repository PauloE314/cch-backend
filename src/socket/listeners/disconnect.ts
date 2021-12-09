import { EventLabels } from '../EventManager';
import { Listener, serializeParty, serializePlayer } from './index';

const disconnect: Listener = ({ socket, player, storage, eventManager }) => {
  socket.on(EventLabels.Disconnect, () => {
    const party = storage.parties.get(player.partyId);

    if (party) {
      party.players = party.players.filter(({ id }) => id !== player.id);

      if (party.players.length === 0) storage.parties.remove(party);
      else
        eventManager.broadcast({
          label: EventLabels.LeaveParty,
          to: party,
          payload: {
            player: serializePlayer(player),
            party: serializeParty(party),
          },
        });
    }

    storage.players.remove(player);
  });
};

export { disconnect };
