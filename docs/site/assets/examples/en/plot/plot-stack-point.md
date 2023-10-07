---
category: examples
group: plot
title: stack point plot
order: 120-4
cover: /vgrammar/preview/plot-plot-stack-point_0.7.6.png
---

# stack point plot

Data sourced and demo from: [observable](https://observablehq.com/@observablehq/plot-stacked-dots?intent=fork)

## Code Demonstration

```javascript livedemo template=vgrammar
const data = [
  {
    full_name: 'Sherrod Brown',
    birthday: '1952-11-09',
    gender: 'M',
    type: 'sen',
    state: 'OH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Maria Cantwell',
    birthday: '1958-10-13',
    gender: 'F',
    type: 'sen',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Benjamin L. Cardin',
    birthday: '1943-10-05',
    gender: 'M',
    type: 'sen',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Thomas R. Carper',
    birthday: '1947-01-23',
    gender: 'M',
    type: 'sen',
    state: 'DE',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Robert P. Casey, Jr."',
    birthday: '1960-04-13',
    gender: 'M',
    type: 'sen',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Dianne Feinstein',
    birthday: '1933-06-22',
    gender: 'F',
    type: 'sen',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Amy Klobuchar',
    birthday: '1960-05-25',
    gender: 'F',
    type: 'sen',
    state: 'MN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Robert Menendez',
    birthday: '1954-01-01',
    gender: 'M',
    type: 'sen',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bernard Sanders',
    birthday: '1941-09-08',
    gender: 'M',
    type: 'sen',
    state: 'VT',
    party: 'Independent',
    '': ''
  },
  {
    full_name: 'Debbie Stabenow',
    birthday: '1950-04-29',
    gender: 'F',
    type: 'sen',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jon Tester',
    birthday: '1956-08-21',
    gender: 'M',
    type: 'sen',
    state: 'MT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Sheldon Whitehouse',
    birthday: '1955-10-20',
    gender: 'M',
    type: 'sen',
    state: 'RI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John Barrasso',
    birthday: '1952-07-21',
    gender: 'M',
    type: 'sen',
    state: 'WY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Roger F. Wicker',
    birthday: '1951-07-05',
    gender: 'M',
    type: 'sen',
    state: 'MS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Susan M. Collins',
    birthday: '1952-12-07',
    gender: 'F',
    type: 'sen',
    state: 'ME',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John Cornyn',
    birthday: '1952-02-02',
    gender: 'M',
    type: 'sen',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Richard J. Durbin',
    birthday: '1944-11-21',
    gender: 'M',
    type: 'sen',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lindsey Graham',
    birthday: '1955-07-09',
    gender: 'M',
    type: 'sen',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mitch McConnell',
    birthday: '1942-02-20',
    gender: 'M',
    type: 'sen',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jeff Merkley',
    birthday: '1956-10-24',
    gender: 'M',
    type: 'sen',
    state: 'OR',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jack Reed',
    birthday: '1949-11-12',
    gender: 'M',
    type: 'sen',
    state: 'RI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'James E. Risch',
    birthday: '1943-05-03',
    gender: 'M',
    type: 'sen',
    state: 'ID',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jeanne Shaheen',
    birthday: '1947-01-28',
    gender: 'F',
    type: 'sen',
    state: 'NH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mark R. Warner',
    birthday: '1954-12-15',
    gender: 'M',
    type: 'sen',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Kirsten E. Gillibrand',
    birthday: '1966-12-09',
    gender: 'F',
    type: 'sen',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Christopher A. Coons',
    birthday: '1963-09-09',
    gender: 'M',
    type: 'sen',
    state: 'DE',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Joe Manchin, III"',
    birthday: '1947-08-24',
    gender: 'M',
    type: 'sen',
    state: 'WV',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Robert B. Aderholt',
    birthday: '1965-07-22',
    gender: 'M',
    type: 'rep',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tammy Baldwin',
    birthday: '1962-02-11',
    gender: 'F',
    type: 'sen',
    state: 'WI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Michael F. Bennet',
    birthday: '1964-11-28',
    gender: 'M',
    type: 'sen',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Gus M. Bilirakis',
    birthday: '1963-02-08',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Sanford D. Bishop, Jr."',
    birthday: '1947-02-04',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Marsha Blackburn',
    birthday: '1952-06-06',
    gender: 'F',
    type: 'sen',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Earl Blumenauer',
    birthday: '1948-08-16',
    gender: 'M',
    type: 'rep',
    state: 'OR',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Richard Blumenthal',
    birthday: '1946-02-13',
    gender: 'M',
    type: 'sen',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John Boozman',
    birthday: '1950-12-10',
    gender: 'M',
    type: 'sen',
    state: 'AR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Vern Buchanan',
    birthday: '1951-05-08',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Larry Bucshon',
    birthday: '1962-05-31',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Michael C. Burgess',
    birthday: '1950-12-23',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ken Calvert',
    birthday: '1953-06-08',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Shelley Moore Capito',
    birthday: '1953-11-26',
    gender: 'F',
    type: 'sen',
    state: 'WV',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'AndrÃ© Carson',
    birthday: '1974-10-16',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John R. Carter',
    birthday: '1941-11-06',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Bill Cassidy',
    birthday: '1957-09-28',
    gender: 'M',
    type: 'sen',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kathy Castor',
    birthday: '1966-08-20',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Judy Chu',
    birthday: '1953-07-07',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'David N. Cicilline',
    birthday: '1961-07-15',
    gender: 'M',
    type: 'rep',
    state: 'RI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Yvette D. Clarke',
    birthday: '1964-11-21',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Emanuel Cleaver',
    birthday: '1944-10-26',
    gender: 'M',
    type: 'rep',
    state: 'MO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'James E. Clyburn',
    birthday: '1940-07-21',
    gender: 'M',
    type: 'rep',
    state: 'SC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Steve Cohen',
    birthday: '1949-05-24',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tom Cole',
    birthday: '1949-04-28',
    gender: 'M',
    type: 'rep',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Gerald E. Connolly',
    birthday: '1950-03-30',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jim Costa',
    birthday: '1952-04-13',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Joe Courtney',
    birthday: '1953-04-06',
    gender: 'M',
    type: 'rep',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Crapo',
    birthday: '1951-05-20',
    gender: 'M',
    type: 'sen',
    state: 'ID',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Eric A. ""Rick"" Crawford"',
    birthday: '1966-01-22',
    gender: 'M',
    type: 'rep',
    state: 'AR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Henry Cuellar',
    birthday: '1955-09-19',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Danny K. Davis',
    birthday: '1941-09-06',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Diana DeGette',
    birthday: '1957-07-29',
    gender: 'F',
    type: 'rep',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Rosa L. DeLauro',
    birthday: '1943-03-02',
    gender: 'F',
    type: 'rep',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Scott DesJarlais',
    birthday: '1964-02-21',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mario Diaz-Balart',
    birthday: '1961-09-25',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Lloyd Doggett',
    birthday: '1946-10-06',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jeff Duncan',
    birthday: '1966-01-07',
    gender: 'M',
    type: 'rep',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Anna G. Eshoo',
    birthday: '1942-12-13',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Charles J. ""Chuck"" Fleischmann"',
    birthday: '1962-10-11',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Virginia Foxx',
    birthday: '1943-06-29',
    gender: 'F',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John Garamendi',
    birthday: '1945-01-24',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Paul A. Gosar',
    birthday: '1958-11-22',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kay Granger',
    birthday: '1943-01-18',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Chuck Grassley',
    birthday: '1933-09-17',
    gender: 'M',
    type: 'sen',
    state: 'IA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Sam Graves',
    birthday: '1963-11-07',
    gender: 'M',
    type: 'rep',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Al Green',
    birthday: '1947-09-01',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'H. Morgan Griffith',
    birthday: '1958-03-15',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'RaÃºl M. Grijalva',
    birthday: '1948-02-19',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brett Guthrie',
    birthday: '1964-02-18',
    gender: 'M',
    type: 'rep',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Andy Harris',
    birthday: '1957-01-25',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Martin Heinrich',
    birthday: '1971-10-17',
    gender: 'M',
    type: 'sen',
    state: 'NM',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brian Higgins',
    birthday: '1959-10-06',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'James A. Himes',
    birthday: '1966-07-05',
    gender: 'M',
    type: 'rep',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mazie K. Hirono',
    birthday: '1947-11-03',
    gender: 'F',
    type: 'sen',
    state: 'HI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John Hoeven',
    birthday: '1957-03-13',
    gender: 'M',
    type: 'sen',
    state: 'ND',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Steny H. Hoyer',
    birthday: '1939-06-14',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bill Huizenga',
    birthday: '1969-01-31',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Sheila Jackson Lee',
    birthday: '1950-01-12',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bill Johnson',
    birthday: '1954-11-10',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Henry C. ""Hank"" Johnson',
    birthday: '1954-10-02',
    gender: 'M',
    type: 'M',
    state: 'GA',
    party: 'GA',
    '': 'Democrat'
  },
  {
    full_name: 'Ron Johnson',
    birthday: '1955-04-08',
    gender: 'M',
    type: 'sen',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jim Jordan',
    birthday: '1964-02-17',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Marcy Kaptur',
    birthday: '1946-06-17',
    gender: 'F',
    type: 'rep',
    state: 'OH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'William R. Keating',
    birthday: '1952-09-06',
    gender: 'M',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Kelly',
    birthday: '1948-05-10',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Doug Lamborn',
    birthday: '1954-05-24',
    gender: 'M',
    type: 'rep',
    state: 'CO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'James Lankford',
    birthday: '1968-03-04',
    gender: 'M',
    type: 'sen',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Rick Larsen',
    birthday: '1965-06-15',
    gender: 'M',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John B. Larson',
    birthday: '1948-07-22',
    gender: 'M',
    type: 'rep',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Robert E. Latta',
    birthday: '1956-04-18',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Barbara Lee',
    birthday: '1946-07-16',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Lee',
    birthday: '1971-06-04',
    gender: 'M',
    type: 'sen',
    state: 'UT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Zoe Lofgren',
    birthday: '1947-12-21',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Frank D. Lucas',
    birthday: '1960-01-06',
    gender: 'M',
    type: 'rep',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Blaine Luetkemeyer',
    birthday: '1952-05-07',
    gender: 'M',
    type: 'rep',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ben Ray LujÃ¡n',
    birthday: '1972-06-07',
    gender: 'M',
    type: 'sen',
    state: 'NM',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Stephen F. Lynch',
    birthday: '1955-03-31',
    gender: 'M',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Edward J. Markey',
    birthday: '1946-07-11',
    gender: 'M',
    type: 'sen',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Doris O. Matsui',
    birthday: '1944-09-25',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Kevin McCarthy',
    birthday: '1965-01-26',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Michael T. McCaul',
    birthday: '1962-01-14',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tom McClintock',
    birthday: '1956-07-10',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Betty McCollum',
    birthday: '1954-07-12',
    gender: 'F',
    type: 'rep',
    state: 'MN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'James P. McGovern',
    birthday: '1959-11-20',
    gender: 'M',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Patrick T. McHenry',
    birthday: '1975-10-22',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Cathy McMorris Rodgers',
    birthday: '1969-05-22',
    gender: 'F',
    type: 'rep',
    state: 'WA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Gregory W. Meeks',
    birthday: '1953-09-25',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Gwen Moore',
    birthday: '1951-04-18',
    gender: 'F',
    type: 'rep',
    state: 'WI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jerry Moran',
    birthday: '1954-05-29',
    gender: 'M',
    type: 'sen',
    state: 'KS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Lisa Murkowski',
    birthday: '1957-05-22',
    gender: 'F',
    type: 'sen',
    state: 'AK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Christopher Murphy',
    birthday: '1973-08-03',
    gender: 'M',
    type: 'sen',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Patty Murray',
    birthday: '1950-10-11',
    gender: 'F',
    type: 'sen',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jerrold Nadler',
    birthday: '1947-06-13',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Grace F. Napolitano',
    birthday: '1936-12-04',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Richard E. Neal',
    birthday: '1949-02-14',
    gender: 'M',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Eleanor Holmes Norton',
    birthday: '1937-06-13',
    gender: 'F',
    type: 'rep',
    state: 'DC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Frank Pallone, Jr."',
    birthday: '1951-10-30',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Bill Pascrell, Jr."',
    birthday: '1937-01-25',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Rand Paul',
    birthday: '1963-01-07',
    gender: 'M',
    type: 'sen',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Nancy Pelosi',
    birthday: '1940-03-26',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Gary C. Peters',
    birthday: '1958-12-01',
    gender: 'M',
    type: 'sen',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Chellie Pingree',
    birthday: '1955-04-02',
    gender: 'F',
    type: 'rep',
    state: 'ME',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bill Posey',
    birthday: '1947-12-18',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Quigley',
    birthday: '1958-10-17',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Harold Rogers',
    birthday: '1937-12-31',
    gender: 'M',
    type: 'rep',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Rogers',
    birthday: '1958-07-16',
    gender: 'M',
    type: 'rep',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Marco Rubio',
    birthday: '1971-05-28',
    gender: 'M',
    type: 'sen',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'C. A. Dutch Ruppersberger',
    birthday: '1946-01-31',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Gregorio Kilili Camacho Sablan',
    birthday: '1955-01-19',
    gender: 'M',
    type: 'rep',
    state: 'MP',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John P. Sarbanes',
    birthday: '1962-05-22',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Steve Scalise',
    birthday: '1965-10-06',
    gender: 'M',
    type: 'rep',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Janice D. Schakowsky',
    birthday: '1944-05-26',
    gender: 'F',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Adam B. Schiff',
    birthday: '1960-06-22',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Charles E. Schumer',
    birthday: '1950-11-23',
    gender: 'M',
    type: 'sen',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'David Schweikert',
    birthday: '1962-03-03',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Austin Scott',
    birthday: '1969-12-10',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'David Scott',
    birthday: '1945-06-27',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Robert C. ""Bobby"" Scott"',
    birthday: '1947-04-30',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tim Scott',
    birthday: '1965-09-19',
    gender: 'M',
    type: 'sen',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Terri A. Sewell',
    birthday: '1965-01-01',
    gender: 'F',
    type: 'rep',
    state: 'AL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brad Sherman',
    birthday: '1954-10-24',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Michael K. Simpson',
    birthday: '1950-09-08',
    gender: 'M',
    type: 'rep',
    state: 'ID',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Adam Smith',
    birthday: '1965-06-15',
    gender: 'M',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Adrian Smith',
    birthday: '1970-12-19',
    gender: 'M',
    type: 'rep',
    state: 'NE',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Christopher H. Smith',
    birthday: '1953-03-04',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Linda T. SÃ¡nchez',
    birthday: '1969-01-28',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bennie G. Thompson',
    birthday: '1948-01-28',
    gender: 'M',
    type: 'rep',
    state: 'MS',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Thompson',
    birthday: '1951-01-24',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Glenn Thompson',
    birthday: '1959-07-27',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John Thune',
    birthday: '1961-01-07',
    gender: 'M',
    type: 'sen',
    state: 'SD',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Paul Tonko',
    birthday: '1949-06-18',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Michael R. Turner',
    birthday: '1960-01-11',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Chris Van Hollen',
    birthday: '1959-01-10',
    gender: 'M',
    type: 'sen',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Nydia M. VelÃ¡zquez',
    birthday: '1953-03-28',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tim Walberg',
    birthday: '1951-04-12',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Debbie Wasserman Schultz',
    birthday: '1966-09-27',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Maxine Waters',
    birthday: '1938-08-15',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Daniel Webster',
    birthday: '1949-04-27',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Peter Welch',
    birthday: '1947-05-02',
    gender: 'M',
    type: 'sen',
    state: 'VT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Joe Wilson',
    birthday: '1947-07-31',
    gender: 'M',
    type: 'rep',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Frederica S. Wilson',
    birthday: '1942-11-05',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Robert J. Wittman',
    birthday: '1959-02-03',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Steve Womack',
    birthday: '1957-02-18',
    gender: 'M',
    type: 'rep',
    state: 'AR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ron Wyden',
    birthday: '1949-05-03',
    gender: 'M',
    type: 'sen',
    state: 'OR',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Todd Young',
    birthday: '1972-08-24',
    gender: 'M',
    type: 'sen',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mark E. Amodei',
    birthday: '1958-06-12',
    gender: 'M',
    type: 'rep',
    state: 'NV',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Suzanne Bonamici',
    birthday: '1954-10-14',
    gender: 'F',
    type: 'rep',
    state: 'OR',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Suzan K. DelBene',
    birthday: '1962-02-17',
    gender: 'F',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Thomas Massie',
    birthday: '1971-01-13',
    gender: 'M',
    type: 'rep',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Donald M. Payne, Jr."',
    birthday: '1958-12-17',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brian Schatz',
    birthday: '1972-10-20',
    gender: 'M',
    type: 'sen',
    state: 'HI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bill Foster',
    birthday: '1955-10-07',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Dina Titus',
    birthday: '1950-05-23',
    gender: 'F',
    type: 'rep',
    state: 'NV',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tom Cotton',
    birthday: '1977-05-13',
    gender: 'M',
    type: 'sen',
    state: 'AR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kyrsten Sinema',
    birthday: '1976-07-12',
    gender: 'F',
    type: 'sen',
    state: 'AZ',
    party: 'Independent',
    '': ''
  },
  {
    full_name: 'Doug LaMalfa',
    birthday: '1960-07-02',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jared Huffman',
    birthday: '1964-02-18',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ami Bera',
    birthday: '1965-03-02',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Eric Swalwell',
    birthday: '1980-11-16',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Julia Brownley',
    birthday: '1952-08-28',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tony CÃ¡rdenas',
    birthday: '1963-03-31',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Raul Ruiz',
    birthday: '1972-08-25',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mark Takano',
    birthday: '1960-12-10',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Juan Vargas',
    birthday: '1961-03-07',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Scott H. Peters',
    birthday: '1958-06-17',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lois Frankel',
    birthday: '1948-05-16',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tammy Duckworth',
    birthday: '1968-03-12',
    gender: 'F',
    type: 'sen',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Andy Barr',
    birthday: '1973-07-24',
    gender: 'M',
    type: 'rep',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Elizabeth Warren',
    birthday: '1949-06-22',
    gender: 'F',
    type: 'sen',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Angus S. King, Jr."',
    birthday: '1944-03-31',
    gender: 'M',
    type: 'sen',
    state: 'ME',
    party: 'Independent',
    '': ''
  },
  {
    full_name: 'Daniel T. Kildee',
    birthday: '1958-08-11',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ann Wagner',
    birthday: '1962-09-13',
    gender: 'F',
    type: 'rep',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Steve Daines',
    birthday: '1962-08-20',
    gender: 'M',
    type: 'sen',
    state: 'MT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Richard Hudson',
    birthday: '1971-11-04',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kevin Cramer',
    birthday: '1961-01-21',
    gender: 'M',
    type: 'sen',
    state: 'ND',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Deb Fischer',
    birthday: '1951-03-01',
    gender: 'F',
    type: 'sen',
    state: 'NE',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ann M. Kuster',
    birthday: '1956-09-05',
    gender: 'F',
    type: 'rep',
    state: 'NH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Grace Meng',
    birthday: '1975-10-01',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Hakeem S. Jeffries',
    birthday: '1970-08-04',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brad R. Wenstrup',
    birthday: '1958-06-17',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Joyce Beatty',
    birthday: '1950-03-12',
    gender: 'F',
    type: 'rep',
    state: 'OH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'David P. Joyce',
    birthday: '1957-03-17',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Markwayne Mullin',
    birthday: '1977-07-26',
    gender: 'M',
    type: 'sen',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Scott Perry',
    birthday: '1962-05-27',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Matt Cartwright',
    birthday: '1961-05-01',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ted Cruz',
    birthday: '1970-12-22',
    gender: 'M',
    type: 'sen',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Randy K. Weber, Sr."',
    birthday: '1953-07-02',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Joaquin Castro',
    birthday: '1974-09-16',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Roger Williams',
    birthday: '1949-09-13',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Marc A. Veasey',
    birthday: '1971-01-03',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Chris Stewart',
    birthday: '1960-07-15',
    gender: 'M',
    type: 'rep',
    state: 'UT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tim Kaine',
    birthday: '1958-02-26',
    gender: 'M',
    type: 'sen',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Derek Kilmer',
    birthday: '1974-01-01',
    gender: 'M',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mark Pocan',
    birthday: '1964-08-14',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Robin L. Kelly',
    birthday: '1956-04-30',
    gender: 'F',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jason Smith',
    birthday: '1980-06-16',
    gender: 'M',
    type: 'rep',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Cory A. Booker',
    birthday: '1969-04-27',
    gender: 'M',
    type: 'sen',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Katherine M. Clark',
    birthday: '1963-07-17',
    gender: 'F',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Donald Norcross',
    birthday: '1958-12-13',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Alma S. Adams',
    birthday: '1946-05-27',
    gender: 'F',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Gary J. Palmer',
    birthday: '1954-05-14',
    gender: 'M',
    type: 'rep',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'J. French Hill',
    birthday: '1956-12-05',
    gender: 'M',
    type: 'rep',
    state: 'AR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Bruce Westerman',
    birthday: '1967-11-18',
    gender: 'M',
    type: 'rep',
    state: 'AR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ruben Gallego',
    birthday: '1979-11-20',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mark DeSaulnier',
    birthday: '1952-03-31',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Pete Aguilar',
    birthday: '1979-06-19',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ted Lieu',
    birthday: '1969-03-29',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Norma J. Torres',
    birthday: '1965-04-04',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ken Buck',
    birthday: '1959-02-16',
    gender: 'M',
    type: 'rep',
    state: 'CO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Earl L. ""Buddy"" Carter"',
    birthday: '1957-09-06',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Barry Loudermilk',
    birthday: '1963-12-22',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Rick W. Allen',
    birthday: '1951-11-07',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Bost',
    birthday: '1960-12-30',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Garret Graves',
    birthday: '1972-01-31',
    gender: 'M',
    type: 'rep',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Seth Moulton',
    birthday: '1978-10-24',
    gender: 'M',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John R. Moolenaar',
    birthday: '1961-05-08',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Debbie Dingell',
    birthday: '1953-11-23',
    gender: 'F',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Tom Emmer',
    birthday: '1961-03-03',
    gender: 'M',
    type: 'rep',
    state: 'MN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'David Rouzer',
    birthday: '1972-02-16',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Bonnie Watson Coleman',
    birthday: '1945-02-06',
    gender: 'F',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Elise M. Stefanik',
    birthday: '1984-07-02',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Brendan F. Boyle',
    birthday: '1977-02-06',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brian Babin',
    birthday: '1948-03-23',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"Donald S. Beyer, Jr."',
    birthday: '1950-06-20',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Stacey E. Plaskett',
    birthday: '1966-05-13',
    gender: 'F',
    type: 'rep',
    state: 'VI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Dan Newhouse',
    birthday: '1955-07-10',
    gender: 'M',
    type: 'rep',
    state: 'WA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Glenn Grothman',
    birthday: '1955-07-03',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Alexander X. Mooney',
    birthday: '1971-06-05',
    gender: 'M',
    type: 'rep',
    state: 'WV',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Aumua Amata Coleman Radewagen',
    birthday: '1947-12-29',
    gender: 'F',
    type: 'rep',
    state: 'AS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Dan Sullivan',
    birthday: '1964-11-13',
    gender: 'M',
    type: 'sen',
    state: 'AK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Joni Ernst',
    birthday: '1970-07-01',
    gender: 'F',
    type: 'sen',
    state: 'IA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Thom Tillis',
    birthday: '1960-08-30',
    gender: 'M',
    type: 'sen',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Rounds',
    birthday: '1954-10-24',
    gender: 'M',
    type: 'sen',
    state: 'SD',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Trent Kelly',
    birthday: '1966-03-01',
    gender: 'M',
    type: 'rep',
    state: 'MS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Darin LaHood',
    birthday: '1968-07-05',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Warren Davidson',
    birthday: '1970-03-01',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'James Comer',
    birthday: '1972-08-19',
    gender: 'M',
    type: 'rep',
    state: 'KY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Dwight Evans',
    birthday: '1954-05-16',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John Kennedy',
    birthday: '1951-11-21',
    gender: 'M',
    type: 'sen',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Margaret Wood Hassan',
    birthday: '1958-02-27',
    gender: 'F',
    type: 'sen',
    state: 'NH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Catherine Cortez Masto',
    birthday: '1964-03-29',
    gender: 'F',
    type: 'sen',
    state: 'NV',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bradley Scott Schneider',
    birthday: '1961-08-20',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Andy Biggs',
    birthday: '1958-11-07',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ro Khanna',
    birthday: '1976-09-13',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jimmy Panetta',
    birthday: '1969-10-01',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Salud O. Carbajal',
    birthday: '1964-11-18',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Nanette Diaz BarragÃ¡n',
    birthday: '1976-09-15',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'J. Luis Correa',
    birthday: '1958-01-24',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lisa Blunt Rochester',
    birthday: '1962-02-10',
    gender: 'F',
    type: 'rep',
    state: 'DE',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Matt Gaetz',
    birthday: '1982-05-07',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Neal P. Dunn',
    birthday: '1953-02-16',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John H. Rutherford',
    birthday: '1952-09-02',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Darren Soto',
    birthday: '1978-02-25',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brian J. Mast',
    birthday: '1980-07-10',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'A. Drew Ferguson IV',
    birthday: '1966-11-15',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Raja Krishnamoorthi',
    birthday: '1973-07-19',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jim Banks',
    birthday: '1979-07-16',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Roger Marshall',
    birthday: '1960-08-09',
    gender: 'M',
    type: 'sen',
    state: 'KS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Clay Higgins',
    birthday: '1961-08-24',
    gender: 'M',
    type: 'rep',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Johnson',
    birthday: '1972-01-30',
    gender: 'M',
    type: 'rep',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jamie Raskin',
    birthday: '1962-12-13',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jack Bergman',
    birthday: '1947-02-02',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ted Budd',
    birthday: '1971-10-21',
    gender: 'M',
    type: 'sen',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Don Bacon',
    birthday: '1963-08-16',
    gender: 'M',
    type: 'rep',
    state: 'NE',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Josh Gottheimer',
    birthday: '1975-03-08',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jacky Rosen',
    birthday: '1957-08-02',
    gender: 'F',
    type: 'sen',
    state: 'NV',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Adriano Espaillat',
    birthday: '1954-09-27',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brian K. Fitzpatrick',
    birthday: '1973-12-17',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Lloyd Smucker',
    birthday: '1964-01-23',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jenniffer GonzÃ¡lez-ColÃ³n',
    birthday: '1976-08-05',
    gender: 'F',
    type: 'rep',
    state: 'PR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'David Kustoff',
    birthday: '1966-10-08',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Vicente Gonzalez',
    birthday: '1967-09-04',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jodey C. Arrington',
    birthday: '1972-03-09',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Pramila Jayapal',
    birthday: '1965-09-21',
    gender: 'F',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Gallagher',
    birthday: '1984-03-03',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ron Estes',
    birthday: '1956-07-19',
    gender: 'M',
    type: 'rep',
    state: 'KS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ralph Norman',
    birthday: '1953-06-20',
    gender: 'M',
    type: 'rep',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jimmy Gomez',
    birthday: '1974-11-25',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John R. Curtis',
    birthday: '1960-05-10',
    gender: 'M',
    type: 'rep',
    state: 'UT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tina Smith',
    birthday: '1958-03-04',
    gender: 'F',
    type: 'sen',
    state: 'MN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Cindy Hyde-Smith',
    birthday: '1959-05-10',
    gender: 'F',
    type: 'sen',
    state: 'MS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Debbie Lesko',
    birthday: '1958-11-14',
    gender: 'F',
    type: 'rep',
    state: 'AZ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Michael Cloud',
    birthday: '1975-05-13',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Troy Balderson',
    birthday: '1962-01-16',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kevin Hern',
    birthday: '1961-12-04',
    gender: 'M',
    type: 'rep',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Joseph D. Morelle',
    birthday: '1957-04-29',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mary Gay Scanlon',
    birthday: '1959-08-30',
    gender: 'F',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Susan Wild',
    birthday: '1957-06-07',
    gender: 'F',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ed Case',
    birthday: '1952-09-27',
    gender: 'M',
    type: 'rep',
    state: 'HI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Steven Horsford',
    birthday: '1973-04-29',
    gender: 'M',
    type: 'rep',
    state: 'NV',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Greg Stanton',
    birthday: '1970-03-08',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Josh Harder',
    birthday: '1986-08-01',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Katie Porter',
    birthday: '1974-01-03',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Levin',
    birthday: '1978-10-28',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Joe Neguse',
    birthday: '1984-05-13',
    gender: 'M',
    type: 'rep',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jason Crow',
    birthday: '1979-03-15',
    gender: 'M',
    type: 'rep',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jahana Hayes',
    birthday: '1973-03-08',
    gender: 'F',
    type: 'rep',
    state: 'CT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Michael Waltz',
    birthday: '1974-01-31',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'W. Gregory Steube',
    birthday: '1978-05-19',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Lucy McBath',
    birthday: '1960-06-01',
    gender: 'F',
    type: 'rep',
    state: 'GA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Russ Fulcher',
    birthday: '1973-07-19',
    gender: 'M',
    type: 'rep',
    state: 'ID',
    party: 'Republican',
    '': ''
  },
  {
    full_name: '"JesÃºs G. ""Chuy"" GarcÃ­a"',
    birthday: '1956-04-12',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Sean Casten',
    birthday: '1971-11-23',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lauren Underwood',
    birthday: '1986-10-04',
    gender: 'F',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'James R. Baird',
    birthday: '1945-06-04',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Greg Pence',
    birthday: '1956-11-14',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Sharice Davids',
    birthday: '1980-05-22',
    gender: 'F',
    type: 'rep',
    state: 'KS',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lori Trahan',
    birthday: '1973-10-27',
    gender: 'F',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ayanna Pressley',
    birthday: '1974-02-03',
    gender: 'F',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'David J. Trone',
    birthday: '1955-09-21',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Elissa Slotkin',
    birthday: '1976-07-10',
    gender: 'F',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Haley M. Stevens',
    birthday: '1983-06-24',
    gender: 'F',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Rashida Tlaib',
    birthday: '1976-07-24',
    gender: 'F',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Angie Craig',
    birthday: '1972-02-14',
    gender: 'F',
    type: 'rep',
    state: 'MN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Dean Phillips',
    birthday: '1969-01-20',
    gender: 'M',
    type: 'rep',
    state: 'MN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ilhan Omar',
    birthday: '1981-10-04',
    gender: 'F',
    type: 'rep',
    state: 'MN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Pete Stauber',
    birthday: '1966-05-10',
    gender: 'M',
    type: 'rep',
    state: 'MN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Michael Guest',
    birthday: '1970-02-04',
    gender: 'M',
    type: 'rep',
    state: 'MS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kelly Armstrong',
    birthday: '1976-10-08',
    gender: 'M',
    type: 'rep',
    state: 'ND',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Chris Pappas',
    birthday: '1980-06-04',
    gender: 'M',
    type: 'rep',
    state: 'NH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jefferson Van Drew',
    birthday: '1953-02-23',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Andy Kim',
    birthday: '1982-07-12',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mikie Sherrill',
    birthday: '1972-01-19',
    gender: 'F',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Susie Lee',
    birthday: '1966-11-07',
    gender: 'F',
    type: 'rep',
    state: 'NV',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Alexandria Ocasio-Cortez',
    birthday: '1989-10-13',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Madeleine Dean',
    birthday: '1959-06-06',
    gender: 'F',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Chrissy Houlahan',
    birthday: '1967-06-05',
    gender: 'F',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Daniel Meuser',
    birthday: '1964-02-10',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John Joyce',
    birthday: '1957-02-08',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Guy Reschenthaler',
    birthday: '1983-04-17',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'William R. Timmons IV',
    birthday: '1984-04-30',
    gender: 'M',
    type: 'rep',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Dusty Johnson',
    birthday: '1976-09-30',
    gender: 'M',
    type: 'rep',
    state: 'SD',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tim Burchett',
    birthday: '1964-08-25',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John W. Rose',
    birthday: '1965-02-23',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mark E. Green',
    birthday: '1964-11-08',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Dan Crenshaw',
    birthday: '1984-03-14',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Lance Gooden',
    birthday: '1982-12-01',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Lizzie Fletcher',
    birthday: '1975-02-13',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Veronica Escobar',
    birthday: '1969-09-15',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Chip Roy',
    birthday: '1972-08-07',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Sylvia R. Garcia',
    birthday: '1950-09-06',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Colin Z. Allred',
    birthday: '1983-04-15',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Ben Cline',
    birthday: '1972-02-29',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Abigail Davis Spanberger',
    birthday: '1979-08-07',
    gender: 'F',
    type: 'rep',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jennifer Wexton',
    birthday: '1968-05-27',
    gender: 'F',
    type: 'rep',
    state: 'VA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Kim Schrier',
    birthday: '1968-08-23',
    gender: 'F',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bryan Steil',
    birthday: '1981-03-30',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Carol D. Miller',
    birthday: '1950-11-04',
    gender: 'F',
    type: 'rep',
    state: 'WV',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Rick Scott',
    birthday: '1952-12-01',
    gender: 'M',
    type: 'sen',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Braun',
    birthday: '1954-03-24',
    gender: 'M',
    type: 'sen',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Josh Hawley',
    birthday: '1979-12-31',
    gender: 'M',
    type: 'sen',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mitt Romney',
    birthday: '1947-03-12',
    gender: 'M',
    type: 'sen',
    state: 'UT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jared F. Golden',
    birthday: '1982-07-25',
    gender: 'M',
    type: 'rep',
    state: 'ME',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Dan Bishop',
    birthday: '1964-07-01',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Gregory F. Murphy',
    birthday: '1963-03-05',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kweisi Mfume',
    birthday: '1948-10-24',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Thomas P. Tiffany',
    birthday: '1957-12-30',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Garcia',
    birthday: '1976-04-24',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mark Kelly',
    birthday: '1964-02-21',
    gender: 'M',
    type: 'sen',
    state: 'AZ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Cynthia M. Lummis',
    birthday: '1954-09-10',
    gender: 'F',
    type: 'sen',
    state: 'WY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Darrell Issa',
    birthday: '1953-11-01',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Pete Sessions',
    birthday: '1955-03-22',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'David G. Valadao',
    birthday: '1977-04-14',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tommy Tuberville',
    birthday: '1954-09-18',
    gender: 'M',
    type: 'sen',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John W. Hickenlooper',
    birthday: '1952-02-07',
    gender: 'M',
    type: 'sen',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Bill Hagerty',
    birthday: '1959-08-14',
    gender: 'M',
    type: 'sen',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jerry L. Carl',
    birthday: '1958-06-17',
    gender: 'M',
    type: 'rep',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Barry Moore',
    birthday: '1966-09-26',
    gender: 'M',
    type: 'rep',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jay Obernolte',
    birthday: '1970-08-18',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Young Kim',
    birthday: '1962-10-18',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Michelle Steel',
    birthday: '1955-06-21',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Sara Jacobs',
    birthday: '1989-02-01',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lauren Boebert',
    birthday: '1986-12-15',
    gender: 'F',
    type: 'rep',
    state: 'CO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kat Cammack',
    birthday: '1988-02-16',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'C. Scott Franklin',
    birthday: '1964-08-23',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Byron Donalds',
    birthday: '1978-10-28',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Carlos A. Gimenez',
    birthday: '1954-01-17',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Maria Elvira Salazar',
    birthday: '1961-11-01',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Nikema Williams',
    birthday: '1978-07-30',
    gender: 'F',
    type: 'rep',
    state: 'GA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Andrew S. Clyde',
    birthday: '1963-11-22',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Marjorie Taylor Greene',
    birthday: '1974-05-27',
    gender: 'F',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ashley Hinson',
    birthday: '1983-06-27',
    gender: 'F',
    type: 'rep',
    state: 'IA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mariannette Miller-Meeks',
    birthday: '1955-09-06',
    gender: 'F',
    type: 'rep',
    state: 'IA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Randy Feenstra',
    birthday: '1969-01-14',
    gender: 'M',
    type: 'rep',
    state: 'IA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mary E. Miller',
    birthday: '1959-08-27',
    gender: 'F',
    type: 'rep',
    state: 'IL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Frank J. Mrvan',
    birthday: '1969-04-16',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Victoria Spartz',
    birthday: '1978-10-06',
    gender: 'F',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tracey Mann',
    birthday: '1976-12-17',
    gender: 'M',
    type: 'rep',
    state: 'KS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jake LaTurner',
    birthday: '1988-02-17',
    gender: 'M',
    type: 'rep',
    state: 'KS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jake Auchincloss',
    birthday: '1988-01-29',
    gender: 'M',
    type: 'rep',
    state: 'MA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lisa C. McClain',
    birthday: '1966-04-07',
    gender: 'F',
    type: 'rep',
    state: 'MI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Michelle Fischbach',
    birthday: '1965-11-03',
    gender: 'F',
    type: 'rep',
    state: 'MN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Cori Bush',
    birthday: '1976-07-21',
    gender: 'F',
    type: 'rep',
    state: 'MO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Matthew M. Rosendale, Sr."',
    birthday: '1960-07-07',
    gender: 'M',
    type: 'rep',
    state: 'MT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Deborah K. Ross',
    birthday: '1963-06-20',
    gender: 'F',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Kathy E. Manning',
    birthday: '1956-12-03',
    gender: 'F',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Teresa Leger Fernandez',
    birthday: '1959-07-01',
    gender: 'F',
    type: 'rep',
    state: 'NM',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Andrew R. Garbarino',
    birthday: '1984-09-27',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Nicole Malliotakis',
    birthday: '1980-11-11',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ritchie Torres',
    birthday: '1988-03-12',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jamaal Bowman',
    birthday: '1976-04-01',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Stephanie I. Bice',
    birthday: '1973-11-11',
    gender: 'F',
    type: 'rep',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Cliff Bentz',
    birthday: '1952-01-12',
    gender: 'M',
    type: 'rep',
    state: 'OR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Nancy Mace',
    birthday: '1977-12-04',
    gender: 'F',
    type: 'rep',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Diana Harshbarger',
    birthday: '1960-01-01',
    gender: 'F',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Pat Fallon',
    birthday: '1967-12-19',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'August Pfluger',
    birthday: '1978-12-28',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ronny Jackson',
    birthday: '1967-05-04',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Troy E. Nehls',
    birthday: '1968-04-07',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Tony Gonzales',
    birthday: '1980-10-10',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Beth Van Duyne',
    birthday: '1970-11-16',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Blake D. Moore',
    birthday: '1980-06-22',
    gender: 'M',
    type: 'rep',
    state: 'UT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Burgess Owens',
    birthday: '1951-08-02',
    gender: 'M',
    type: 'rep',
    state: 'UT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Bob Good',
    birthday: '1965-09-11',
    gender: 'M',
    type: 'rep',
    state: 'VA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Marilyn Strickland',
    birthday: '1962-09-25',
    gender: 'F',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Scott Fitzgerald',
    birthday: '1963-11-16',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Alex Padilla',
    birthday: '1973-03-22',
    gender: 'M',
    type: 'sen',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jon Ossoff',
    birthday: '1987-02-16',
    gender: 'M',
    type: 'sen',
    state: 'GA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Raphael G. Warnock',
    birthday: '1969-07-23',
    gender: 'M',
    type: 'sen',
    state: 'GA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Claudia Tenney',
    birthday: '1961-02-04',
    gender: 'F',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Julia Letlow',
    birthday: '1981-03-16',
    gender: 'F',
    type: 'rep',
    state: 'LA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Troy A. Carter',
    birthday: '1963-10-26',
    gender: 'M',
    type: 'rep',
    state: 'LA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Melanie A. Stansbury',
    birthday: '1979-01-31',
    gender: 'F',
    type: 'rep',
    state: 'NM',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jake Ellzey',
    birthday: '1970-01-24',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Shontel M. Brown',
    birthday: '1975-06-24',
    gender: 'F',
    type: 'rep',
    state: 'OH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Carey',
    birthday: '1971-03-13',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Sheila Cherfilus-McCormick',
    birthday: '1979-01-25',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mike Flood',
    birthday: '1975-02-23',
    gender: 'M',
    type: 'rep',
    state: 'NE',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Brad Finstad',
    birthday: '1976-05-30',
    gender: 'M',
    type: 'rep',
    state: 'MN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mary Sattler Peltola',
    birthday: '1973-08-31',
    gender: 'F',
    type: 'rep',
    state: 'AK',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Patrick Ryan',
    birthday: '1982-03-28',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Rudy Yakym III',
    birthday: '1984-02-24',
    gender: 'M',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Ryan K. Zinke',
    birthday: '1961-11-01',
    gender: 'M',
    type: 'rep',
    state: 'MT',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Katie Boyd Britt',
    birthday: '1982-02-02',
    gender: 'F',
    type: 'sen',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Eric Schmitt',
    birthday: '1975-06-20',
    gender: 'M',
    type: 'sen',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'J.D. Vance',
    birthday: '1984-08-02',
    gender: 'M',
    type: 'sen',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John Fetterman',
    birthday: '1969-08-15',
    gender: 'M',
    type: 'sen',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Dale W. Strong',
    birthday: '1970-05-08',
    gender: 'M',
    type: 'rep',
    state: 'AL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Elijah Crane',
    birthday: '1980-01-03',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Juan Ciscomani',
    birthday: '1982-08-30',
    gender: 'M',
    type: 'rep',
    state: 'AZ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kevin Kiley',
    birthday: '1985-01-30',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'John S. Duarte',
    birthday: '1966-09-06',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Kevin Mullin',
    birthday: '1970-06-15',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Sydney Kamlager-Dove',
    birthday: '1972-07-20',
    gender: 'F',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Robert Garcia',
    birthday: '1977-12-02',
    gender: 'M',
    type: 'rep',
    state: 'CA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Brittany Pettersen',
    birthday: '1981-12-06',
    gender: 'F',
    type: 'rep',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Yadira Caraveo',
    birthday: '1980-12-23',
    gender: 'F',
    type: 'rep',
    state: 'CO',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Aaron Bean',
    birthday: '1967-01-25',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Cory Mills',
    birthday: '1980-07-30',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Maxwell Frost',
    birthday: '1997-01-17',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Anna Paulina Luna',
    birthday: '1989-05-06',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Laurel M. Lee',
    birthday: '1974-03-26',
    gender: 'F',
    type: 'rep',
    state: 'FL',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jared Moskowitz',
    birthday: '1980-12-18',
    gender: 'M',
    type: 'rep',
    state: 'FL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Richard McCormick',
    birthday: '1968-10-07',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Collins',
    birthday: '1967-07-02',
    gender: 'M',
    type: 'rep',
    state: 'GA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'James C. Moylan',
    birthday: '1962-07-18',
    gender: 'M',
    type: 'rep',
    state: 'GU',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jill N. Tokuda',
    birthday: '1976-03-28',
    gender: 'F',
    type: 'rep',
    state: 'HI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Zachary Nunn',
    birthday: '1979-05-04',
    gender: 'M',
    type: 'rep',
    state: 'IA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jonathan L. Jackson',
    birthday: '1966-01-07',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Delia C. Ramirez',
    birthday: '1983-06-02',
    gender: 'F',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Nikki Budzinski',
    birthday: '1977-03-11',
    gender: 'F',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Eric Sorensen',
    birthday: '1976-03-18',
    gender: 'M',
    type: 'rep',
    state: 'IL',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Erin Houchin',
    birthday: '1976-09-24',
    gender: 'F',
    type: 'rep',
    state: 'IN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Morgan McGarvey',
    birthday: '1979-12-23',
    gender: 'M',
    type: 'rep',
    state: 'KY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Glenn Ivey',
    birthday: '1961-02-27',
    gender: 'M',
    type: 'rep',
    state: 'MD',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Hillary J. Scholten',
    birthday: '1982-02-22',
    gender: 'F',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'John James',
    birthday: '1981-06-08',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Shri Thanedar',
    birthday: '1955-02-22',
    gender: 'M',
    type: 'rep',
    state: 'MI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Mark Alford',
    birthday: '1963-10-04',
    gender: 'M',
    type: 'rep',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Eric Burlison',
    birthday: '1976-10-02',
    gender: 'M',
    type: 'rep',
    state: 'MO',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Mike Ezell',
    birthday: '1959-04-06',
    gender: 'M',
    type: 'rep',
    state: 'MS',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Donald G. Davis',
    birthday: '1971-08-29',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Valerie P. Foushee',
    birthday: '1956-05-07',
    gender: 'F',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Chuck Edwards',
    birthday: '1960-09-13',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Wiley Nickel',
    birthday: '1975-11-23',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Jeff Jackson',
    birthday: '1982-09-12',
    gender: 'M',
    type: 'rep',
    state: 'NC',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: '"Thomas H. Kean, Jr."',
    birthday: '1968-09-05',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Robert Menendez',
    birthday: '1985-07-12',
    gender: 'M',
    type: 'rep',
    state: 'NJ',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Gabe Vasquez',
    birthday: '1984-08-03',
    gender: 'M',
    type: 'rep',
    state: 'NM',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Nick LaLota',
    birthday: '1978-06-23',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'George Santos',
    birthday: '1988-07-22',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Anthony Dâ€™Esposito',
    birthday: '1982-02-22',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Daniel S. Goldman',
    birthday: '1976-02-26',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Michael Lawler',
    birthday: '1986-09-09',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Marcus J. Molinaro',
    birthday: '1975-10-08',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Brandon Williams',
    birthday: '1967-05-22',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Nicholas A. Langworthy',
    birthday: '1981-02-27',
    gender: 'M',
    type: 'rep',
    state: 'NY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Greg Landsman',
    birthday: '1976-12-04',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Max L. Miller',
    birthday: '1988-11-13',
    gender: 'M',
    type: 'rep',
    state: 'OH',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Emilia Strong Sykes',
    birthday: '1986-01-04',
    gender: 'F',
    type: 'rep',
    state: 'OH',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Josh Brecheen',
    birthday: '1979-06-19',
    gender: 'M',
    type: 'rep',
    state: 'OK',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Val T. Hoyle',
    birthday: '1964-02-14',
    gender: 'F',
    type: 'rep',
    state: 'OR',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Lori Chavez-DeRemer',
    birthday: '1968-04-07',
    gender: 'F',
    type: 'rep',
    state: 'OR',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Andrea Salinas',
    birthday: '1969-12-06',
    gender: 'F',
    type: 'rep',
    state: 'OR',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Summer L. Lee',
    birthday: '1987-11-26',
    gender: 'F',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Christopher R. Deluzio',
    birthday: '1984-07-13',
    gender: 'M',
    type: 'rep',
    state: 'PA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Seth Magaziner',
    birthday: '1983-07-22',
    gender: 'M',
    type: 'rep',
    state: 'RI',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Russell Fry',
    birthday: '1985-01-31',
    gender: 'M',
    type: 'rep',
    state: 'SC',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Andrew Ogles',
    birthday: '1971-06-18',
    gender: 'M',
    type: 'rep',
    state: 'TN',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Nathaniel Moran',
    birthday: '1974-07-22',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Keith Self',
    birthday: '1953-03-20',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Morgan Luttrell',
    birthday: '1975-11-07',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Monica De La Cruz',
    birthday: '1974-11-11',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jasmine Crockett',
    birthday: '1981-03-29',
    gender: 'F',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Greg Casar',
    birthday: '1989-05-04',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Wesley Hunt',
    birthday: '1981-11-13',
    gender: 'M',
    type: 'rep',
    state: 'TX',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jennifer Kiggans',
    birthday: '1971-06-18',
    gender: 'F',
    type: 'rep',
    state: 'VA',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Becca Balint',
    birthday: '1968-05-04',
    gender: 'F',
    type: 'rep',
    state: 'VT',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Marie Gluesenkamp Perez',
    birthday: '1988-06-06',
    gender: 'F',
    type: 'rep',
    state: 'WA',
    party: 'Democrat',
    '': ''
  },
  {
    full_name: 'Derrick Van Orden',
    birthday: '1969-09-15',
    gender: 'M',
    type: 'rep',
    state: 'WI',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Harriet M. Hageman',
    birthday: '1962-10-18',
    gender: 'F',
    type: 'rep',
    state: 'WY',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Pete Ricketts',
    birthday: '1964-08-19',
    gender: 'M',
    type: 'sen',
    state: 'NE',
    party: 'Republican',
    '': ''
  },
  {
    full_name: 'Jennifer L. McClellan',
    birthday: '1972-12-28',
    gender: 'F',
    type: 'rep',
    state: 'VA',
    party: 'Democrat',
    '': ''
  }
];

const plot = new Plot({
  autoFit: true,
  container: document.getElementById(CONTAINER_ID),
  hover: true
});

plot
  .symbol()
  .data(data, [
    {
      type: 'map',
      all: true,
      callback: arr => {
        return arr.map(entry => ({
          ...entry,
          age: 2023 - new Date(entry.birthday).getUTCFullYear(),
          value: entry.gender === 'M' ? 1 : -1
        }));
      }
    },
    {
      type: 'stack',
      dimensionField: 'age',
      stackField: 'value',
      asStack: 'stack'
    }
  ])
  .encode('x', 'age')
  .encode('y', 'stack')
  .encode('group', 'gender')
  .scale('x', { nice: true, type: 'linear' })
  .scale('y', { nice: true, type: 'linear' })
  .axis('x', { tickCount: 5, line: { visible: false } })
  .axis('y', { tickCount: 5, line: { visible: false } })
  .tooltip({
    title: null,
    staticContentKey: ['fullname', 'birthday', 'gender', 'state'],
    content: [
      {
        value: 'full_name'
      },
      {
        value: 'birthday'
      },
      {
        value: 'gender'
      },
      {
        value: 'state'
      }
    ]
  });
plot
  .ruleY()
  .data([{ y: 0 }])
  .encode('y', 'y')
  .style({ stroke: '#999' });

plot.runAsync();

// 只为了方便控制太调试用，不要拷贝
window.vGrammarView = plot;
```

## 相关教程
