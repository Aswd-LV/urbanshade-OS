import { Room } from '../types';

// Branching facility layout
// Layout visualization:
//
//     [STORAGE-A]---[HALL-NORTH]---[LAB-1]
//           |            |            |
//     [WEST-WING]---[CENTRAL]---[EAST-WING]
//           |            |            |
//     [STORAGE-B]---[HALL-SOUTH]---[LAB-2]
//                        |
//                  [FINAL-ROOM]
//                        |
//                  [CONTROL] (You are here)

export const FACILITY_ROOMS: Room[] = [
  // Top row
  {
    id: 'storage-a',
    name: 'Storage A',
    x: 0,
    y: 0,
    connections: ['hall-north', 'west-wing']
  },
  {
    id: 'hall-north',
    name: 'North Hallway',
    x: 1,
    y: 0,
    connections: ['storage-a', 'lab-1', 'central']
  },
  {
    id: 'lab-1',
    name: 'Laboratory 1',
    x: 2,
    y: 0,
    connections: ['hall-north', 'east-wing']
  },
  // Middle row
  {
    id: 'west-wing',
    name: 'West Wing',
    x: 0,
    y: 1,
    connections: ['storage-a', 'central', 'storage-b']
  },
  {
    id: 'central',
    name: 'Central Hub',
    x: 1,
    y: 1,
    connections: ['hall-north', 'west-wing', 'east-wing', 'hall-south']
  },
  {
    id: 'east-wing',
    name: 'East Wing',
    x: 2,
    y: 1,
    connections: ['lab-1', 'central', 'lab-2']
  },
  // Bottom row
  {
    id: 'storage-b',
    name: 'Storage B',
    x: 0,
    y: 2,
    connections: ['west-wing', 'hall-south']
  },
  {
    id: 'hall-south',
    name: 'South Hallway',
    x: 1,
    y: 2,
    connections: ['central', 'storage-b', 'lab-2', 'final-room']
  },
  {
    id: 'lab-2',
    name: 'Laboratory 2',
    x: 2,
    y: 2,
    connections: ['east-wing', 'hall-south']
  },
  // Final room before control
  {
    id: 'final-room',
    name: 'Access Corridor',
    x: 1,
    y: 3,
    connections: ['hall-south', 'control'],
    isFinalRoom: true
  },
  // Control room (player location)
  {
    id: 'control',
    name: 'Control Room',
    x: 1,
    y: 4,
    connections: ['final-room'],
    isControlRoom: true
  }
];

export const SPAWN_ROOMS = ['storage-a', 'lab-1', 'storage-b', 'lab-2'];

export const getRoomById = (id: string): Room | undefined => {
  return FACILITY_ROOMS.find(r => r.id === id);
};

export const getConnectedRooms = (roomId: string): Room[] => {
  const room = getRoomById(roomId);
  if (!room) return [];
  return room.connections.map(id => getRoomById(id)).filter(Boolean) as Room[];
};

export const getPathToControl = (fromRoomId: string): string[] => {
  // Simple BFS to find shortest path to control room
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

// Determine which door a subject would attack from based on their approach
export const getApproachDirection = (fromRoomId: string): 'front' | 'left' | 'right' => {
  const room = getRoomById(fromRoomId);
  if (!room) return 'front';
  
  // Based on room position relative to control room
  if (room.x < 1) return 'left';
  if (room.x > 1) return 'right';
  return 'front';
};
