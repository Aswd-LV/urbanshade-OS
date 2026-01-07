import { Room } from '../types';

// Facility map based on sketch layout
// Gray squares = camera positions
// Layout:
//
//        [CONTAIN-1]---[CAM]---[HALLWAY-TOP]---[CAM]
//             |                     |                \
//           [CAM]             [CAM]-|                 \
//             |                     |                  \
//   [CONTAIN-2]--[CAM]--[BRIDGE]--[CAM]--[HALL-MID]--[CAM]--[CONTAIN-5]
//                         |                |                    |
//                       [CAM]           [FRONT]               [CAM]
//                         |                |
//                    [FOXY-ROOM]--[LEFT]--[PLAYER]--[RIGHT]--[CONTAIN-3]
//                                          |                    |
//                                        [CAM]                [CAM]
//                                          |
//                                     [HALL-LOWER]
//                                          |
//                                        [CAM]
//                                          |
//                                     [CONTAIN-6]

export const FACILITY_ROOMS: Room[] = [
  // Entity Containment 1 (top center)
  {
    id: 'contain-1',
    name: 'Containment 1',
    x: 2,
    y: 0,
    connections: ['hall-top-left'],
    isContainmentRoom: true
  },
  // Top hallway sections
  {
    id: 'hall-top-left',
    name: 'Hall T-1',
    x: 3,
    y: 0,
    connections: ['contain-1', 'hall-top-center']
  },
  {
    id: 'hall-top-center',
    name: 'Hall T-2',
    x: 4,
    y: 0,
    connections: ['hall-top-left', 'hall-top-right', 'hall-vertical']
  },
  {
    id: 'hall-top-right',
    name: 'Hall T-3',
    x: 5,
    y: 0,
    connections: ['hall-top-center', 'hall-right-upper']
  },
  // Vertical hallway from top
  {
    id: 'hall-vertical',
    name: 'Hall V-1',
    x: 4,
    y: 1,
    connections: ['hall-top-center', 'hall-mid']
  },
  // Entity Containment 2 (left side)
  {
    id: 'contain-2',
    name: 'Containment 2',
    x: 0,
    y: 2,
    connections: ['bridge-left'],
    isContainmentRoom: true
  },
  // Bridge corridor (left to center)
  {
    id: 'bridge-left',
    name: 'Bridge W',
    x: 1,
    y: 2,
    connections: ['contain-2', 'bridge']
  },
  {
    id: 'bridge',
    name: 'Bridge',
    x: 2,
    y: 2,
    connections: ['bridge-left', 'hall-mid', 'foxy-room']
  },
  // Central hallway
  {
    id: 'hall-mid',
    name: 'Hall Central',
    x: 4,
    y: 2,
    connections: ['hall-vertical', 'bridge', 'front-hall', 'hall-right']
  },
  // Right side hallway leading to containment 5
  {
    id: 'hall-right',
    name: 'Hall E-1',
    x: 5,
    y: 2,
    connections: ['hall-mid', 'hall-right-upper', 'contain-5']
  },
  {
    id: 'hall-right-upper',
    name: 'Hall E-2',
    x: 6,
    y: 1,
    connections: ['hall-top-right', 'hall-right', 'contain-5']
  },
  // Entity Containment 5 (right side)
  {
    id: 'contain-5',
    name: 'Containment 5',
    x: 7,
    y: 2,
    connections: ['hall-right', 'hall-right-upper', 'hall-lower-right'],
    isContainmentRoom: true
  },
  // Front approach to player
  {
    id: 'front-hall',
    name: 'Front Corridor',
    x: 4,
    y: 3,
    connections: ['hall-mid', 'control'],
    isFinalRoom: true,
    approachDirection: 'front'
  },
  // Foxy room (special entity room)
  {
    id: 'foxy-room',
    name: 'Isolation Cell',
    x: 2,
    y: 3,
    connections: ['bridge', 'left-hall'],
    isContainmentRoom: true
  },
  // Left approach to player
  {
    id: 'left-hall',
    name: 'Left Corridor',
    x: 3,
    y: 4,
    connections: ['foxy-room', 'control'],
    isFinalRoom: true,
    approachDirection: 'left'
  },
  // Player Control Room (center bottom)
  {
    id: 'control',
    name: 'Control Room',
    x: 4,
    y: 4,
    connections: ['front-hall', 'left-hall', 'right-hall', 'hall-lower'],
    isControlRoom: true
  },
  // Right approach to player and Containment 3
  {
    id: 'right-hall',
    name: 'Right Corridor',
    x: 5,
    y: 4,
    connections: ['control', 'contain-3'],
    isFinalRoom: true,
    approachDirection: 'right'
  },
  // Entity Containment 3 (right of player)
  {
    id: 'contain-3',
    name: 'Containment 3',
    x: 6,
    y: 4,
    connections: ['right-hall', 'hall-lower-right'],
    isContainmentRoom: true
  },
  // Lower right connector
  {
    id: 'hall-lower-right',
    name: 'Hall S-E',
    x: 6,
    y: 5,
    connections: ['contain-3', 'contain-5']
  },
  // Lower hallway (below player)
  {
    id: 'hall-lower',
    name: 'Lower Hall',
    x: 4,
    y: 5,
    connections: ['control', 'contain-6']
  },
  // Entity Containment 6 (bottom)
  {
    id: 'contain-6',
    name: 'Containment 6',
    x: 4,
    y: 6,
    connections: ['hall-lower'],
    isContainmentRoom: true
  }
];

// Spawn points for entities
export const SPAWN_ROOMS = ['contain-1', 'contain-2', 'contain-3', 'contain-5', 'contain-6'];

// Foxy spawns in foxy-room specifically
export const FOXY_SPAWN_ROOM = 'foxy-room';

// Containment rooms where shock is available
export const CONTAINMENT_ROOMS = ['contain-1', 'contain-2', 'contain-3', 'contain-5', 'contain-6', 'foxy-room'];

export const getRoomById = (id: string): Room | undefined => {
  return FACILITY_ROOMS.find(r => r.id === id);
};

export const getConnectedRooms = (roomId: string): Room[] => {
  const room = getRoomById(roomId);
  if (!room) return [];
  return room.connections.map(id => getRoomById(id)).filter(Boolean) as Room[];
};

export const getPathToControl = (fromRoomId: string): string[] => {
  // BFS to find shortest path to control room
  const visited = new Set<string>();
  const queue: { roomId: string; path: string[] }[] = [{ roomId: fromRoomId, path: [fromRoomId] }];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.roomId === 'control') {
      return current.path;
    }
    
    if (visited.has(current.roomId)) continue;
    visited.add(current.roomId);
    
    const room = getRoomById(current.roomId);
    if (!room) continue;
    
    for (const connectedId of room.connections) {
      if (!visited.has(connectedId)) {
        queue.push({
          roomId: connectedId,
          path: [...current.path, connectedId]
        });
      }
    }
  }
  
  return [];
};

// Get approach direction based on which final room the entity is in
export const getApproachDirection = (fromRoomId: string): 'front' | 'left' | 'right' => {
  const room = getRoomById(fromRoomId);
  if (room?.approachDirection) {
    return room.approachDirection;
  }
  
  // Fallback based on room position
  if (room) {
    if (room.x < 4) return 'left';
    if (room.x > 4) return 'right';
  }
  return 'front';
};

export const isContainmentRoom = (roomId: string): boolean => {
  return CONTAINMENT_ROOMS.includes(roomId);
};
