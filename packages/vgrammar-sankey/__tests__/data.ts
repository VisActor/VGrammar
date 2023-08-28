export const hierarchyData = [
  {
    value: 100,
    name: 'A',
    children: [
      {
        name: '上面',
        value: 40,
        children: [
          { name: '00', value: 15 },
          { name: '01', value: 10 },
          { name: '02', value: 10 }
        ]
      },
      {
        name: '中间',
        value: 30,
        children: [
          { name: '00', value: 10 },
          { name: '01', value: 10 },
          { name: '02', value: 10 }
        ]
      },
      {
        name: '下面',
        value: 30
      }
    ]
  },
  {
    value: 80,
    name: 'B',
    children: [
      {
        name: '上面',
        value: 40,
        children: [
          {
            name: '00',
            value: 100,
            children: [
              { name: '000', value: 90 },
              { name: '001', value: 10 }
            ]
          },
          { name: '01', value: 40 }
        ]
      },
      {
        name: '中间',
        value: 10
      },
      {
        name: '下面',
        value: 30
      }
    ]
  },
  {
    value: 50,
    name: 'C',
    children: [
      {
        name: '上面',
        value: 20
      },
      {
        name: '中间',
        value: 20
      },
      {
        name: '下面',
        value: 10
      }
    ]
  }
];

export const hierarchyData01 = [
  {
    name: 'A',
    children: [
      {
        name: '上面',
        children: [
          { name: '00', value: 15 },
          { name: '01', value: 10 },
          { name: '02', value: 10 }
        ]
      },
      {
        name: '中间',
        children: [
          { name: '00', value: 10 },
          { name: '01', value: 10 },
          { name: '02', value: 10 }
        ]
      },
      {
        name: '下面'
      }
    ]
  },
  {
    name: 'B',
    children: [
      {
        name: '上面',
        children: [
          {
            name: '00',
            children: [
              { name: '000', value: 90 },
              { name: '001', value: 10 }
            ]
          },
          { name: '01', value: 40 }
        ]
      },
      {
        name: '中间',
        value: 10
      },
      {
        name: '下面'
      }
    ]
  },
  {
    name: 'C',
    children: [
      {
        name: '上面',
        value: 20
      },
      {
        name: '中间',
        value: 20
      },
      {
        name: '下面',
        value: 10
      }
    ]
  }
];
