import { DIRECTION, Goal } from '.';
import * as Lugo from './proto_exported';
export default class GameSnapshotInspector {
    mySide: Lugo.Team.Side;
    myNumber: number;
    me: Lugo.Player | null;
    snapshot: Lugo.GameSnapshot;
    constructor(botSide: Lugo.Team.Side, playerNumber: number, gameSnapshot: Lugo.GameSnapshot);
    getSnapshot(): Lugo.GameSnapshot | null;
    getTurn(): number;
    getMe(): Lugo.Player | null;
    getBall(): Lugo.Ball | null;
    getPlayer(side: Lugo.Team.Side, number: number): Lugo.Player | null;
    getBallHolder(): Lugo.Player | null;
    isBallHolder(player: Lugo.Player): boolean;
    getTeam(side: Lugo.Team.Side): Lugo.Team | null;
    getMyTeam(): Lugo.Team | null;
    getOpponentTeam(): Lugo.Team | null;
    getMyTeamSide(): Lugo.Team.Side;
    getOpponentSide(): Lugo.Team.Side;
    getMyTeamPlayers(): Lugo.Player[];
    getOpponentPlayers(): Lugo.Player[];
    getMyTeamGoalkeeper(): Lugo.Player | null;
    getOpponentGoalkeeper(): Lugo.Player | null;
    makeOrderMove(target: Lugo.Point, speed: number): Lugo.Order;
    makeOrderMoveMaxSpeed(target: Lugo.Point): Lugo.Order;
    makeOrderMoveFromPoint(origin: Lugo.Point, target: Lugo.Point, speed: number): Lugo.Order;
    makeOrderMoveFromVector(direction: Lugo.Vector, speed: number): Lugo.Order;
    makeOrderMoveByDirection(direction: DIRECTION, speed?: number): Lugo.Order;
    makeOrderMoveToStop(): Lugo.Order;
    makeOrderJump(target: Lugo.Point, speed: number): Lugo.Order;
    makeOrderKick(target: Lugo.Point, speed: number): Lugo.Order;
    makeOrderKickMaxSpeed(target: Lugo.Point): Lugo.Order;
    makeOrderCatch(): Lugo.Order;
    private getOrientationByDirection;
    getOpponentGoal(): Goal;
    getMyGoal(): Goal;
}
