---
category: examples
group: plot
title: 数值轴线图
order: 120-1
cover: http://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/vgrammar/basic-mark-arc-basic-arc.png
---

# 数值轴线图

## 代码演示

```javascript livedemo template=vgrammar
const data = [
  {
    side: 'left',
    year: '1956',
    miles: '3683.6965',
    gas: '2.3829'
  },
  {
    side: 'right',
    year: '1957',
    miles: '3722.7648',
    gas: '2.4026'
  },
  {
    side: 'bottom',
    year: '1958',
    miles: '3776.8595',
    gas: '2.2539'
  },
  {
    side: 'top',
    year: '1959',
    miles: '3912.0962',
    gas: '2.3079'
  },
  {
    side: 'right',
    year: '1960',
    miles: '3942.1488',
    gas: '2.2658'
  },
  {
    side: 'bottom',
    year: '1961',
    miles: '3984.2224',
    gas: '2.2526'
  },
  {
    side: 'right',
    year: '1962',
    miles: '4089.4064',
    gas: '2.2158'
  },
  {
    side: 'bottom',
    year: '1963',
    miles: '4230.6536',
    gas: '2.1237'
  },
  {
    side: 'bottom',
    year: '1964',
    miles: '4383.9219',
    gas: '2.1039'
  },
  {
    side: 'bottom',
    year: '1965',
    miles: '4546.2059',
    gas: '2.1368'
  },
  {
    side: 'top',
    year: '1966',
    miles: '4681.4425',
    gas: '2.1421'
  },
  {
    side: 'bottom',
    year: '1967',
    miles: '4837.716',
    gas: '2.1408'
  },
  {
    side: 'right',
    year: '1968',
    miles: '5048.0841',
    gas: '2.1263'
  },
  {
    side: 'right',
    year: '1969',
    miles: '5216.3787',
    gas: '2.0737'
  },
  {
    side: 'right',
    year: '1970',
    miles: '5384.6732',
    gas: '2.0118'
  },
  {
    side: 'bottom',
    year: '1971',
    miles: '5652.1412',
    gas: '1.9316'
  },
  {
    side: 'bottom',
    year: '1972',
    miles: '5979.7145',
    gas: '1.8737'
  },
  {
    side: 'right',
    year: '1973',
    miles: '6160.0301',
    gas: '1.9026'
  },
  {
    side: 'left',
    year: '1974',
    miles: '5946.6566',
    gas: '2.3447'
  },
  {
    side: 'bottom',
    year: '1975',
    miles: '6117.9564',
    gas: '2.3079'
  },
  {
    side: 'bottom',
    year: '1976',
    miles: '6400.4508',
    gas: '2.3237'
  },
  {
    side: 'right',
    year: '1977',
    miles: '6634.861',
    gas: '2.3592'
  },
  {
    side: 'bottom',
    year: '1978',
    miles: '6890.308',
    gas: '2.2288'
  },
  {
    side: 'left',
    year: '1979',
    miles: '6755.0714',
    gas: '2.6829'
  },
  {
    side: 'left',
    year: '1980',
    miles: '6670.9241',
    gas: '3.2974'
  },
  {
    side: 'right',
    year: '1981',
    miles: '6743.0503',
    gas: '3.2961'
  },
  {
    side: 'right',
    year: '1982',
    miles: '6836.2134',
    gas: '2.9197'
  },
  {
    side: 'right',
    year: '1983',
    miles: '6938.3921',
    gas: '2.6566'
  },
  {
    side: 'right',
    year: '1984',
    miles: '7127.7235',
    gas: '2.475'
  },
  {
    side: 'right',
    year: '1985',
    miles: '7326.0706',
    gas: '2.3618'
  },
  {
    side: 'left',
    year: '1986',
    miles: '7554.4703',
    gas: '1.7605'
  },
  {
    side: 'top',
    year: '1987',
    miles: '7776.8595',
    gas: '1.7553'
  },
  {
    side: 'bottom',
    year: '1988',
    miles: '8089.4064',
    gas: '1.6842'
  },
  {
    side: 'left',
    year: '1989',
    miles: '8395.9428',
    gas: '1.7473'
  },
  {
    side: 'top',
    year: '1990',
    miles: '8537.1901',
    gas: '1.8763'
  },
  {
    side: 'right',
    year: '1991',
    miles: '8528.1743',
    gas: '1.7776'
  },
  {
    side: 'right',
    year: '1992',
    miles: '8675.432',
    gas: '1.6855'
  },
  {
    side: 'left',
    year: '1993',
    miles: '8843.7265',
    gas: '1.5974'
  },
  {
    side: 'bottom',
    year: '1994',
    miles: '8906.837',
    gas: '1.5842'
  },
  {
    side: 'bottom',
    year: '1995',
    miles: '9144.2524',
    gas: '1.5987'
  },
  {
    side: 'top',
    year: '1996',
    miles: '9183.3208',
    gas: '1.6737'
  },
  {
    side: 'right',
    year: '1997',
    miles: '9405.71',
    gas: '1.6461'
  },
  {
    side: 'bottom',
    year: '1998',
    miles: '9577.0098',
    gas: '1.3881'
  },
  {
    side: 'right',
    year: '1999',
    miles: '9688.2044',
    gas: '1.4987'
  },
  {
    side: 'top',
    year: '2000',
    miles: '9706.2359',
    gas: '1.8947'
  },
  {
    side: 'left',
    year: '2001',
    miles: '9685.1991',
    gas: '1.7658'
  },
  {
    side: 'bottom',
    year: '2002',
    miles: '9802.4042',
    gas: '1.6381'
  },
  {
    side: 'right',
    year: '2003',
    miles: '9853.4936',
    gas: '1.8592'
  },
  {
    side: 'left',
    year: '2004',
    miles: '9991.7355',
    gas: '2.1421'
  },
  {
    side: 'left',
    year: '2005',
    miles: '10054.846',
    gas: '2.5329'
  },
  {
    side: 'right',
    year: '2006',
    miles: '10030.8039',
    gas: '2.7934'
  },
  {
    side: 'right',
    year: '2007',
    miles: '10012.7724',
    gas: '2.9487'
  },
  {
    side: 'left',
    year: '2008',
    miles: '9871.5252',
    gas: '3.3066'
  },
  {
    side: 'bottom',
    year: '2009',
    miles: '9652.1412',
    gas: '2.3776'
  },
  {
    side: 'left',
    year: '2010',
    miles: '9592.0361',
    gas: '2.6066'
  }
];

const plot = new Plot({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});

plot
  .line()
  .data(data)
  .encode('x', 'miles')
  .encode('y', 'gas')
  .axis('x', { tickCount: 5 })
  .axis('y', { tickCount: 5 })
  .scale('x', { type: 'linear' })
  .tooltip(false)
  .crosshair('x', false)
  .label(
    datum => {
      return 'test';
    },
    { type: 'symbol', textStyle: { fill: 'pink' } }
  );

plot
  .symbol()
  .data(data)
  .encode('x', 'miles')
  .encode('y', 'gas')
  .scale('x', { type: 'linear' })
  .style({ size: 6 })
  .label('year', {
    textStyle: { fill: '#333' },
    dataFilter: data => {
      return data.filter((entry, index) => +entry.text % 5 === 0);
    }
  });

plot.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = plot;
```

## 相关教程
