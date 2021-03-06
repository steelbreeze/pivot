export interface Player {
	shirt: number,
	position: string,
	givenName: string,
	familyName: string,
	country: string,
	dateOfBirth: Date
}

export const squad: Player[] = [
	{ shirt: 1, position: 'Goalkeeper', givenName: 'Alphonse', familyName: 'Areola', country: 'France', dateOfBirth: new Date('1993-02-27') },
	{ shirt: 12, position: 'Goalkeeper', givenName: 'Marek', familyName: 'Rodak', country: 'Slovakia', dateOfBirth: new Date('1996-12-13') },
	{ shirt: 31, position: 'Goalkeeper', givenName: 'Fabrico', familyName: 'Agosto Ramirez', country: 'Spain', dateOfBirth: new Date('1987-12-31') },
	{ shirt: 2, position: 'Defender', givenName: 'Kenny', familyName: 'Tete', country: 'Netherlands', dateOfBirth: new Date('1995-10-09') },
	{ shirt: 3, position: 'Defender', givenName: 'Michael', familyName: 'Hector', country: 'Jamaica', dateOfBirth: new Date('1992-07-19') },
	{ shirt: 4, position: 'Defender', givenName: 'Denis', familyName: 'Odoi', country: 'Belgium', dateOfBirth: new Date('1988-05-27') },
	{ shirt: 5, position: 'Defender', givenName: 'Joachim', familyName: 'Anderson', country: 'Denmark', dateOfBirth: new Date('1996-05-31') },
	{ shirt: 13, position: 'Defender', givenName: 'Tim', familyName: 'Ream', country: 'USA', dateOfBirth: new Date('1987-10-05') },
	{ shirt: 16, position: 'Defender', givenName: 'Tosin', familyName: 'Abarabioyo', country: 'England', dateOfBirth: new Date('1997-09-24') },
	{ shirt: 23, position: 'Defender', givenName: 'Joe', familyName: 'Bryan', country: 'England', dateOfBirth: new Date('1993-09-17') },
	{ shirt: 30, position: 'Defender', givenName: 'Terence', familyName: 'Kongolo', country: 'France', dateOfBirth: new Date('1994-02-14') },
	{ shirt: 33, position: 'Defender', givenName: 'Antonee', familyName: 'Robinson', country: 'USA', dateOfBirth: new Date('1997-08-08') },
	{ shirt: 34, position: 'Defender', givenName: 'Ola', familyName: 'Aina', country: 'Nigeria', dateOfBirth: new Date('1996-10-08') },
	{ shirt: 6, position: 'Midfielder', givenName: 'Kevin', familyName: 'McDonald', country: 'Scotland', dateOfBirth: new Date('1988-11-04') },
	{ shirt: 10, position: 'Midfielder', givenName: 'Tom', familyName: 'Cairney', country: 'Scotland', dateOfBirth: new Date('1991-01-20') },
	{ shirt: 15, position: 'Midfielder', givenName: 'Ruben', familyName: 'Loftus-Cheek', country: 'England', dateOfBirth: new Date('1996-01-23') },
	{ shirt: 18, position: 'Midfielder', givenName: 'Mario', familyName: 'Lemina', country: 'Gabon', dateOfBirth: new Date('1993-09-01') },
	{ shirt: 21, position: 'Midfielder', givenName: 'Harrison', familyName: 'Reed', country: 'England', dateOfBirth: new Date('1995-01-27') },
	{ shirt: 25, position: 'Midfielder', givenName: 'Josh', familyName: 'Onomah', country: 'England', dateOfBirth: new Date('1997-04-27') },
	{ shirt: 29, position: 'Midfielder', givenName: 'Andre-Frank', familyName: 'Zambo Anguissa', country: 'Cameroon', dateOfBirth: new Date('1995-11-16') },
	{ shirt: 48, position: 'Midfielder', givenName: 'Fabio', familyName: 'Carvalho', country: 'England', dateOfBirth: new Date('2002-08-30') },
	{ shirt: 9, position: 'Forward', givenName: 'Aleksander', familyName: 'Mitrovic', country: 'Serbia', dateOfBirth: new Date('1994-09-16') },
	{ shirt: 14, position: 'Forward', givenName: 'Bobby', familyName: 'De Cordova-Reid', country: 'Jamaica', dateOfBirth: new Date('1993-02-02') },
	{ shirt: 17, position: 'Forward', givenName: 'Ivan', familyName: 'Cavaleiro', country: 'Portugal', dateOfBirth: new Date('1993-10-18') },
	{ shirt: 19, position: 'Forward', givenName: 'Ademola', familyName: 'Lookman', country: 'England', dateOfBirth: new Date('1997-10-20') },
	{ shirt: 27, position: 'Forward', givenName: 'Josh', familyName: 'Maja', country: 'Nigeria', dateOfBirth: new Date('1998-12-27') }
];
