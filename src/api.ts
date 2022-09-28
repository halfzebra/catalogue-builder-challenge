import assert from 'assert';
import * as dotenv from 'dotenv';

dotenv.config();

export interface SetSummary {
  id: string;
}

interface SetsListRes {
  Sets: SetSummary[];
}

interface SetPieceRes {
  part: {
    designID: string;
    material: number;
  };
  quantity: number;
}

interface SetDataRes {
  id: string;
  name: string;
  pieces: SetPieceRes[];
}

interface SetData {
  id: string;
  name: string;
  pieces: Pieces;
}

interface VariantRes {
  color: string;
  count: number;
}

interface PieceRes {
  pieceId: string;
  variants: VariantRes[];
}

interface UserInfoRes {
  username: string;
  id: string;
  collection: PieceRes[];
}

type Variants = Map<string, number>;

export type Pieces = Map<string, Variants>;

interface UserInfo {
  username: string;
  id: string;
  collection: Pieces;
}

interface UserSummary {
  id: string;
}

console.log(process.env.API_HOST);

assert(
  typeof process.env.API_HOST === 'string' && process.env.API_HOST.length > 0,
  'API_HOST must be set',
);

const API_HOST = process.env.API_HOST;

export async function fetchSets(): Promise<SetSummary[]> {
  const { Sets: sets } = await fetch(API_HOST + '/api/sets').then(
    (res): Promise<SetsListRes> => res.json(),
  );

  return sets;
}

export async function fetchSetData(id: string): Promise<SetData> {
  return fetch(API_HOST + `/api/set/by-id/${id}`)
    .then((res) => res.json())
    .then((res: SetDataRes) => convertSetDataResToSetData(res));
}

async function fetchUserInfoById(userId: string): Promise<UserInfo> {
  return fetch(API_HOST + `/api/user/by-id/${userId}`)
    .then((res) => res.json())
    .then((res: UserInfoRes) => convertUserInfoResToUserInfo(res));
}

export async function fetchUserInfoByName(userName: string): Promise<UserInfo> {
  const userSummary: UserSummary = await fetch(
    API_HOST + `/api/user/by-username/${userName}`,
  ).then((res) => res.json());

  return fetchUserInfoById(userSummary.id);
}

function convertPiecesResToPieces(pieces: PieceRes[]): Pieces {
  const piecesMap = new Map<string, Variants>();
  pieces.forEach((piece) => {
    let variants = piecesMap.get(piece.pieceId) || new Map<string, number>();

    piece.variants.forEach((variant) => {
      variants.set(variant.color, variant.count);
    });
    piecesMap.set(piece.pieceId, variants);
  });
  return piecesMap;
}

function convertUserInfoResToUserInfo(userInfoRes: UserInfoRes): UserInfo {
  return {
    ...userInfoRes,
    collection: convertPiecesResToPieces(userInfoRes.collection),
  };
}

function convertSetDataResToSetData(setDataRes: SetDataRes): SetData {
  const pieces = new Map<string, Variants>();
  setDataRes.pieces.forEach((piece) => {
    let variants = pieces.get(piece.part.designID) || new Map<string, number>();
    variants.set(piece.part.material.toString(), piece.quantity);
    pieces.set(piece.part.designID, variants);
  });
  return {
    ...setDataRes,
    pieces,
  };
}
