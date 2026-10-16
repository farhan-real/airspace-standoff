/**
 * AIRSPACE STANDOFF: Pseudo-Random Number Generator (PRNG) Engine
 * Implements Xoshiro128** with SplitMix32 seeding, high-entropy fallback, and Fisher-Yates shuffling.
 */

class PRNG {
  constructor(seedValue) {
    this.s0 = 0;
    this.s1 = 0;
    this.s2 = 0;
    this.s3 = 0;
    this.seed(seedValue);
  }

  getEntropySeed() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0];
    }
    const t = (typeof performance !== 'undefined' && performance.now) ? (performance.now() * 1000) | 0 : 0;
    return (Date.now() ^ t ^ (Math.random() * 0x100000000)) >>> 0;
  }

  splitMix32(val) {
    let z = (val + 0x9E3779B9) | 0;
    z = Math.imul(z ^ (z >>> 16), 0x21F0AAAD);
    z = Math.imul(z ^ (z >>> 15), 0x735A2D97);
    return (z ^ (z >>> 15)) >>> 0;
  }

  seed(val) {
    let seedVal = (typeof val === 'number' && Number.isFinite(val)) ? (val >>> 0) : this.getEntropySeed();
    if (typeof val === 'string') {
      let hash = 0x811C9DC5;
      for (let i = 0; i < val.length; i++) {
        hash ^= val.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
      }
      seedVal = hash >>> 0;
    }

    this.s0 = this.splitMix32(seedVal);
    this.s1 = this.splitMix32(this.s0);
    this.s2 = this.splitMix32(this.s1);
    this.s3 = this.splitMix32(this.s2);

    if ((this.s0 | this.s1 | this.s2 | this.s3) === 0) {
      this.s0 = 0x12345678;
      this.s1 = 0x9ABCDEF0;
      this.s2 = 0xFEDCBA98;
      this.s3 = 0x76543210;
    }
  }

  rotl(x, k) {
    return (x << k) | (x >>> (32 - k));
  }

  nextUint32() {
    const result = Math.imul(this.rotl(Math.imul(this.s1, 5), 7), 9);
    const t = this.s1 << 9;

    this.s2 ^= this.s0;
    this.s3 ^= this.s1;
    this.s1 ^= this.s2;
    this.s0 ^= this.s3;

    this.s2 ^= t;
    this.s3 = this.rotl(this.s3, 11);

    return result >>> 0;
  }

  next() {
    return this.nextUint32() / 4294967296.0;
  }

  random() {
    return this.next();
  }

  range(min, max) {
    if (max === undefined) {
      return this.next() * min;
    }
    return min + this.next() * (max - min);
  }

  int(min, max) {
    if (max === undefined) {
      return Math.floor(this.next() * (min + 1));
    }
    return Math.floor(min + this.next() * (max - min + 1));
  }

  boolean(chance = 0.5) {
    return this.next() < chance;
  }

  chance(probability) {
    return this.boolean(probability);
  }

  sign(chance = 0.5) {
    return this.next() < chance ? 1 : -1;
  }

  pick(list) {
    if (!Array.isArray(list) || list.length === 0) return null;
    return list[Math.floor(this.next() * list.length)];
  }

  choose(list) {
    return this.pick(list);
  }

  shuffle(list, inPlace = false) {
    if (!Array.isArray(list)) return [];
    const arr = inPlace ? list : [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  sample(list, count) {
    if (!Array.isArray(list) || list.length === 0 || count <= 0) return [];
    const shuffled = this.shuffle(list, false);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  create(seedValue) {
    return new PRNG(seedValue !== undefined ? seedValue : this.nextUint32());
  }
}

window.PRNG = new PRNG();