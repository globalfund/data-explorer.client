function fnum(x: number) {
  if (isNaN(x)) {
    return {
      number: x,
      text: "",
    };
  }
  if (x < 9999) {
    return {
      number: evenRound(x, 0),
      text: "",
    };
  }
  if (x < 1000000) {
    return {
      number: evenRound(x / 1000000, 2),
      text: "Million",
    };
  }
  // if (x < 10000000) {
  //   const n =
  //     x.toString()[2] > 0 && x.toString()[3] > 0
  //       ? Math.round((x / 1000000) * 2) / 2
  //       : (x / 1000000).toFixed(2);
  //   return {
  //     number: Number(n),
  //     text: 'Million'
  //   };
  // }
  if (x < 10000000) {
    return {
      number: evenRound(x / 1000000, 2),
      text: "Million",
    };
  }
  if (x < 100000000) {
    return {
      number: evenRound(x / 1000000, 2),
      text: "Million",
    };
  }
  if (x < 1000000000) {
    return {
      number: Math.round(x / 1000000),
      text: "Million",
    };
  }
  if (x < 1000000000000) {
    return {
      number: Math.round(x / 1000000000),
      text: "Billion",
    };
  }
  return {
    number: 1,
    text: "T+",
  };
}

function evenRound(num: number, decimalPlaces: number) {
  const d = decimalPlaces || 0;
  const m = 10 ** d;
  const n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
  const i = Math.floor(n);
  const f = n - i;
  const e = 1e-8; // Allow for rounding errors in f
  let r = 0;
  if (f > 0.5 - e && f < 0.5 + e) {
    r = i % 2 === 0 ? i : i + 1;
  } else {
    r = Math.round(n);
  }
  return d ? r / m : r;
}

function roundToSigFigs(value: number, sigFigures: number) {
  if (value === 0.0) {
    return value;
  }
  if (isNaN(value)) {
    return Number.NaN;
  }
  if (value === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY;
  }
  if (value === Number.NEGATIVE_INFINITY) {
    return Number.NEGATIVE_INFINITY;
  }
  if (sigFigures < 1 || sigFigures > 14) {
    sigFigures = 1;
  }
  const roundingPosition =
    sigFigures - 1 - Math.floor(Math.log10(Math.abs(value)));
  if (roundingPosition > 0 && roundingPosition < 15) {
    return Math.round(value);
  }
  const scale = 10 ** Math.ceil(Math.log10(Math.abs(value)));
  return evenRound(value / scale, sigFigures) * scale;
}

export function applyResultValueFormula(value: number, sigFigure: number) {
  return fnum(roundToSigFigs(value, value < 100 ? 1 : sigFigure));
}
