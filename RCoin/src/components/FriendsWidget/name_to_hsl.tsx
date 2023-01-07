const hRange = [0, 360];
const sRange = [39, 40];
const lRange = [79, 80];

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const generateHSL = (name: string) => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  // const s = normalizeHash(hash, sRange[0], sRange[1]);
  const s = 30;
  // const l = normalizeHash(hash, lRange[0], lRange[1]);
  const l = 80;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default generateHSL;
