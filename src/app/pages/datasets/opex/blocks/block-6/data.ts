export const VIEWS = ["Per line", "Share of total"];

export const simpleFormatter = (value: number) => {
  const isNegative = value < 0;
  value = Math.abs(value);
  if (value === 0) {
    return "";
  }
  if (value >= 1e9) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e9).toFixed(1)}B`.replace(
      ".0",
      "",
    );
  }
  if (value >= 1e6) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e6).toFixed(1)}M`.replace(
      ".0",
      "",
    );
  }
  if (value >= 1e3) {
    return `${isNegative ? "-" : ""}$${(Math.abs(value) / 1e3).toFixed(1)}K`.replace(
      ".0",
      "",
    );
  }
  return `${isNegative ? "-" : ""}$${Math.abs(value)}`;
};

export const keyCostsOverTimeData = [
  {
    name: "CCM Funding",
    values: [
      10790473.38, 9396647.83, 9037672.91, 8224945.35, 7568378.21, 7564708.56,
      10751120.28, 10786485.22, 10486941.64,
    ],
    actualPercentageValues: [
      1.0970209459742326, 0.9680358735036381, 0.918119940533807,
      0.8429317454372124, 0.7552366665890736, 0.6994866967908369,
      0.9628174588382719, 0.9462062676341813, 0.9534450626947464,
    ],
    endYearBudget: 10866500,
    growthPercentage: 22.09550561797753,
    startYearBudgetPercentage: 0.9048246611003334,
    endYearBudgetPercentage: 0.9879535072698719,
  },
  {
    name: "LFA Fees",
    values: [
      48987819.56, 44961781.26, 46974822.89, 48395742.38, 46046828.28,
      44826515.62, 47224950.24, 41940628.87, 39384265.04,
    ],
    actualPercentageValues: [
      4.980380587800144, 4.6319302355192775, 4.772082595579675,
      4.959827191569494, 4.594941232090816, 4.144978103383358,
      4.229234293697312, 3.679093337256071, 3.5807134567261025,
    ],
    endYearBudget: 43212472,
    growthPercentage: -16.899092307692307,
    startYearBudgetPercentage: 5.28661599744015,
    endYearBudgetPercentage: 3.9287639322874086,
  },
  {
    name: "Office Infrastructure",
    values: [
      27115955.52, 24695207.3, 22880429.94, 22770281.87, 23436840.4, 24962689.8,
      20798909.56, 19795223.33, 18522779.9,
    ],
    actualPercentageValues: [
      2.7567623891905297, 2.5440824219980285, 2.3243792052550325,
      2.3336074130603692, 2.338725778224042, 2.308227645879899,
      1.862648052261047, 1.7364659573569938, 1.684042273647714,
    ],
    endYearBudget: 21049409.44,
    growthPercentage: -22.270480527647972,
    startYearBudgetPercentage: 2.753140373022174,
    endYearBudgetPercentage: 1.9137567645707034,
  },
  {
    name: "Professional fees",
    values: [
      30789601.75, 29343318.16, 31367964.3, 34076243.7, 32713558.47, 37789127.8,
      36104366.37, 35962030.29, 27431348.27,
    ],
    actualPercentageValues: [
      3.1302461762761773, 3.0229274460859266, 3.186611620555161,
      3.492296466138199, 3.2644350170694705, 3.494251228553448,
      3.2333294927409524, 3.1546419211844303, 2.493985803385435,
    ],
    endYearBudget: 30356011.09,
    growthPercentage: -9.010929147533306,
    startYearBudgetPercentage: 3.3917973364894607,
    endYearBudgetPercentage: 2.759888429861374,
  },
  {
    name: "Travel",
    values: [
      16154461.01, 15432963.23, 16429974.12, 3113640.83, 768882.36, 10944530.86,
      14012676.76, 14778376.92, 8433727.06,
    ],
    actualPercentageValues: [
      1.6423544616440224, 1.5898927267877165, 1.6690897106195874,
      0.3191008070949031, 0.07672557243482948, 1.0120090785343854,
      1.2549064170255297, 1.296380848993953, 0.7667722107655478,
    ],
    endYearBudget: 13960279.69,
    growthPercentage: -16.041472595898114,
    startYearBudgetPercentage: 1.6904554459066066,
    endYearBudgetPercentage: 1.2692317933284736,
  },
  {
    name: "Workforce",
    values: [
      155034200.72, 152651630.28, 157033471.49, 160436620.66, 171516396.06,
      176615932.53, 188147350.77, 197012437.37, 194893501.49,
    ],
    actualPercentageValues: [
      15.761659339936523, 15.726060711573375, 15.952730635636167,
      16.44231237171463, 17.115353862016594, 16.331163886377535,
      16.849551436282916, 17.28221929936326, 17.719202902604472,
    ],
    endYearBudget: 203940274.79,
    growthPercentage: 35.54135311105925,
    startYearBudgetPercentage: 15.296976708590257,
    endYearBudgetPercentage: 18.54171165990539,
  },
];
