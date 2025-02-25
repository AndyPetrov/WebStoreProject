-- ======================================================
-- Full Music Library SQL Insert File
-- Inserts artists, albums, and (for select albums) full tracklists.
-- Note: 200 albums are inserted (20 per genre) across 10 genres.
-- For many albums, full tracklists are not provided due to space;
-- please update those sections with the actual full tracklists as needed.
-- ======================================================

-- ======================================================
-- 1. Insert Artists
-- ======================================================
INSERT INTO artists (name) VALUES
('Pink Floyd'),
('The Beatles'),
('Led Zeppelin'),
('AC/DC'),
('Eagles'),
('Fleetwood Mac'),
('The Rolling Stones'),
('Bruce Springsteen'),
('Nirvana'),
('Guns N\' Roses'),
('Queen'),
('Radiohead'),
('Black Sabbath'),
('U2'),
('Green Day'),
('Red Hot Chili Peppers'),
('Pearl Jam'),
('Michael Jackson'),
('Taylor Swift'),
('Dua Lipa'),
('Madonna'),
('Lady Gaga'),
('Usher'),
('Lorde'),
('Justin Timberlake'),
('Adele'),
('Ariana Grande'),
('Billie Eilish'),
('Justin Bieber'),
('Eminem'),
('Nas'),
('Kendrick Lamar'),
('Dr. Dre'),
('Wu-Tang Clan'),
('Jay-Z'),
('Kanye West'),
('Outkast'),
('Raekwon'),
('50 Cent'),
('The Notorious B.I.G.'),
('Fugees'),
('Snoop Dogg'),
('Lauryn Hill'),
('Mos Def'),
('Beyoncé'),
('Stevie Wonder'),
('Janet Jackson'),
('The Weeknd'),
('Bruno Mars'),
('Amy Winehouse'),
('Aretha Franklin'),
('Solange'),
('Marvin Gaye'),
('Chaka Khan'),
('Miles Davis'),
('John Coltrane'),
('The Dave Brubeck Quartet'),
('Charles Mingus'),
('Ornette Coleman'),
('Cannonball Adderley'),
('Wayne Shorter'),
('Herbie Hancock'),
('Eric Dolphy'),
('Ella Fitzgerald'),
('Vivaldi'),
('Beethoven/Herbert von Karajan'),
('Mozart'),
('Glenn Gould'),
('Handel/The King\'s College Choir'),
('Tchaikovsky/Mariinsky Orchestra'),
('Beethoven'),
('Brahms'),
('Dvorak'),
('Rachmaninoff'),
('Stravinsky'),
('Mahler'),
('Shostakovich'),
('Debussy'),
('Ravel'),
('Schubert'),
('Puccini'),
('Verdi'),
('Kacey Musgraves'),
('Chris Stapleton'),
('Garth Brooks'),
('Shania Twain'),
('Johnny Cash'),
('Randy Travis'),
('Dixie Chicks'),
('Luke Combs'),
('Jason Aldean'),
('Miranda Lambert'),
('Alison Krauss & Union Station'),
('Martina McBride'),
('Carrie Underwood'),
('Eric Church'),
('Bob Marley & The Wailers'),
('Burning Spear'),
('Peter Tosh'),
('Toots & the Maytals'),
('Jimmy Cliff'),
('Third World'),
('Bunny Wailer'),
('Ziggy Marley'),
('Metallica'),
('Iron Maiden'),
('Slayer'),
('Megadeth'),
('Candlemass'),
('Opeth'),
('System of a Down'),
('Tool'),
('Motörhead'),
('Overkill'),
('Daft Punk'),
('Moby'),
('ODESZA'),
('The Knife'),
('Boards of Canada'),
('Burial'),
('Aphex Twin'),
('The Avalanches'),
('The Chemical Brothers'),
('Justice'),
('Squarepusher'),
('Bonobo'),
('Jamie xx');
-- ======================================================
-- End Artists Insert
-- ======================================================


-- ======================================================
-- 2. Insert Albums (200 total, 20 per genre)
-- Genre IDs (assumed to exist in table "genres"):
-- 1: Rock, 2: Pop, 3: Hip-Hop, 4: R&B, 5: Jazz, 6: Classical,
-- 7: Country, 8: Reggae, 9: Metal, 10: Electronic
-- ======================================================

-- --- Rock Albums (Genre ID = 1) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('The Dark Side of the Moon', (SELECT id FROM artists WHERE name='Pink Floyd'), 1, '/static/images/The_Dark_Side_of_the_Moon.png', '/static/audio/The_Dark_Side_of_the_Moon.wav'),
('Abbey Road', (SELECT id FROM artists WHERE name='The Beatles'), 1, '/static/images/Abbey_Road.png', '/static/audio/Abbey_Road.wav'),
('Led Zeppelin IV', (SELECT id FROM artists WHERE name='Led Zeppelin'), 1, '/static/images/Led_Zeppelin_IV.png', '/static/audio/Led_Zeppelin_IV.wav'),
('Back in Black', (SELECT id FROM artists WHERE name='AC/DC'), 1, '/static/images/Back_in_Black.png', '/static/audio/Back_in_Black.wav'),
('Hotel California', (SELECT id FROM artists WHERE name='Eagles'), 1, '/static/images/Hotel_California.png', '/static/audio/Hotel_California.wav'),
('Rumours', (SELECT id FROM artists WHERE name='Fleetwood Mac'), 1, '/static/images/Rumours.png', '/static/audio/Rumours.wav'),
('Sticky Fingers', (SELECT id FROM artists WHERE name='The Rolling Stones'), 1, '/static/images/Sticky_Fingers.png', '/static/audio/Sticky_Fingers.wav'),
('Born to Run', (SELECT id FROM artists WHERE name='Bruce Springsteen'), 1, '/static/images/Born_to_Run.png', '/static/audio/Born_to_Run.wav'),
('Nevermind', (SELECT id FROM artists WHERE name='Nirvana'), 1, '/static/images/Nevermind.png', '/static/audio/Nevermind.wav'),
('Appetite for Destruction', (SELECT id FROM artists WHERE name='Guns N'' Roses'), 1, '/static/images/Appetite_for_Destruction.png', '/static/audio/Appetite_for_Destruction.wav'),
('A Night at the Opera', (SELECT id FROM artists WHERE name='Queen'), 1, '/static/images/A_Night_at_the_Opera.png', '/static/audio/A_Night_at_the_Opera.wav'),
('OK Computer', (SELECT id FROM artists WHERE name='Radiohead'), 1, '/static/images/OK_Computer.png', '/static/audio/OK_Computer.wav'),
('Wish You Were Here', (SELECT id FROM artists WHERE name='Pink Floyd'), 1, '/static/images/Wish_You_Were_Here.png', '/static/audio/Wish_You_Were_Here.wav'),
('Paranoid', (SELECT id FROM artists WHERE name='Black Sabbath'), 1, '/static/images/Paranoid.png', '/static/audio/Paranoid.wav'),
('The Joshua Tree', (SELECT id FROM artists WHERE name='U2'), 1, '/static/images/The_Joshua_Tree.png', '/static/audio/The_Joshua_Tree.wav'),
('Physical Graffiti', (SELECT id FROM artists WHERE name='Led Zeppelin'), 1, '/static/images/Physical_Graffiti.png', '/static/audio/Physical_Graffiti.wav'),
('The Wall', (SELECT id FROM artists WHERE name='Pink Floyd'), 1, '/static/images/The_Wall.png', '/static/audio/The_Wall.wav'),
('American Idiot', (SELECT id FROM artists WHERE name='Green Day'), 1, '/static/images/American_Idiot.png', '/static/audio/American_Idiot.wav'),
('Californication', (SELECT id FROM artists WHERE name='Red Hot Chili Peppers'), 1, '/static/images/Californication.png', '/static/audio/Californication.wav'),
('Ten', (SELECT id FROM artists WHERE name='Pearl Jam'), 1, '/static/images/Ten.png', '/static/audio/Ten.wav');

-- --- Pop Albums (Genre ID = 2) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Thriller', (SELECT id FROM artists WHERE name='Michael Jackson'), 2, '/static/images/Thriller.png', '/static/audio/Thriller.wav'),
('1989', (SELECT id FROM artists WHERE name='Taylor Swift'), 2, '/static/images/1989.png', '/static/audio/1989.wav'),
('Future Nostalgia', (SELECT id FROM artists WHERE name='Dua Lipa'), 2, '/static/images/Future_Nostalgia.png', '/static/audio/Future_Nostalgia.wav'),
('True Blue', (SELECT id FROM artists WHERE name='Madonna'), 2, '/static/images/True_Blue.png', '/static/audio/True_Blue.wav'),
('Born This Way', (SELECT id FROM artists WHERE name='Lady Gaga'), 2, '/static/images/Born_This_Way.png', '/static/audio/Born_This_Way.wav'),
('The Fame', (SELECT id FROM artists WHERE name='Lady Gaga'), 2, '/static/images/The_Fame.png', '/static/audio/The_Fame.wav'),
('Bad', (SELECT id FROM artists WHERE name='Michael Jackson'), 2, '/static/images/Bad.png', '/static/audio/Bad.wav'),
('Off the Wall', (SELECT id FROM artists WHERE name='Michael Jackson'), 2, '/static/images/Off_the_Wall.png', '/static/audio/Off_the_Wall.wav'),
('Folklore', (SELECT id FROM artists WHERE name='Taylor Swift'), 2, '/static/images/Folklore.png', '/static/audio/Folklore.wav'),
('Evermore', (SELECT id FROM artists WHERE name='Taylor Swift'), 2, '/static/images/Evermore.png', '/static/audio/Evermore.wav'),
('Like a Prayer', (SELECT id FROM artists WHERE name='Madonna'), 2, '/static/images/Like_a_Prayer.png', '/static/audio/Like_a_Prayer.wav'),
('Confessions', (SELECT id FROM artists WHERE name='Usher'), 2, '/static/images/Confessions.png', '/static/audio/Confessions.wav'),
('Pure Heroine', (SELECT id FROM artists WHERE name='Lorde'), 2, '/static/images/Pure_Heroine.png', '/static/audio/Pure_Heroine.wav'),
('Melodrama', (SELECT id FROM artists WHERE name='Lorde'), 2, '/static/images/Melodrama.png', '/static/audio/Melodrama.wav'),
('Justified', (SELECT id FROM artists WHERE name='Justin Timberlake'), 2, '/static/images/Justified.png', '/static/audio/Justified.wav'),
('25', (SELECT id FROM artists WHERE name='Adele'), 2, '/static/images/25.png', '/static/audio/25.wav'),
('Dangerous Woman', (SELECT id FROM artists WHERE name='Ariana Grande'), 2, '/static/images/Dangerous_Woman.png', '/static/audio/Dangerous_Woman.wav'),
('Lover', (SELECT id FROM artists WHERE name='Taylor Swift'), 2, '/static/images/Lover.png', '/static/audio/Lover.wav'),
('When We All Fall Asleep, Where Do We Go?', (SELECT id FROM artists WHERE name='Billie Eilish'), 2, '/static/images/When_We_All_Fall_Asleep_Where_Do_We_Go.png', '/static/audio/When_We_All_Fall_Asleep_Where_Do_We_Go.wav'),
('Purpose', (SELECT id FROM artists WHERE name='Justin Bieber'), 2, '/static/images/Purpose.png', '/static/audio/Purpose.wav');

-- --- Hip-Hop Albums (Genre ID = 3) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('The Marshall Mathers LP', (SELECT id FROM artists WHERE name='Eminem'), 3, '/static/images/The_Marshall_Mathers_LP.png', '/static/audio/The_Marshall_Mathers_LP.wav'),
('Illmatic', (SELECT id FROM artists WHERE name='Nas'), 3, '/static/images/Illmatic.png', '/static/audio/Illmatic.wav'),
('To Pimp a Butterfly', (SELECT id FROM artists WHERE name='Kendrick Lamar'), 3, '/static/images/To_Pimp_a_Butterfly.png', '/static/audio/To_Pimp_a_Butterfly.wav'),
('The Chronic', (SELECT id FROM artists WHERE name='Dr. Dre'), 3, '/static/images/The_Chronic.png', '/static/audio/The_Chronic.wav'),
('Enter the Wu-Tang (36 Chambers)', (SELECT id FROM artists WHERE name='Wu-Tang Clan'), 3, '/static/images/Enter_the_Wu-Tang_36_Chambers.png', '/static/audio/Enter_the_Wu-Tang_36_Chambers.wav'),
('Good Kid, M.A.A.D City', (SELECT id FROM artists WHERE name='Kendrick Lamar'), 3, '/static/images/Good_Kid_MAAD_City.png', '/static/audio/Good_Kid_MAAD_City.wav'),
('The Blueprint', (SELECT id FROM artists WHERE name='Jay-Z'), 3, '/static/images/The_Blueprint.png', '/static/audio/The_Blueprint.wav'),
('My Beautiful Dark Twisted Fantasy', (SELECT id FROM artists WHERE name='Kanye West'), 3, '/static/images/My_Beautiful_Dark_Twisted_Fantasy.png', '/static/audio/My_Beautiful_Dark_Twisted_Fantasy.wav'),
('Stankonia', (SELECT id FROM artists WHERE name='Outkast'), 3, '/static/images/Stankonia.png', '/static/audio/Stankonia.wav'),
('Graduation', (SELECT id FROM artists WHERE name='Kanye West'), 3, '/static/images/Graduation.png', '/static/audio/Graduation.wav'),
('Only Built 4 Cuban Linx', (SELECT id FROM artists WHERE name='Raekwon'), 3, '/static/images/Only_Built_4_Cuban_Linx.png', '/static/audio/Only_Built_4_Cuban_Linx.wav'),
('Get Rich or Die Tryin''', (SELECT id FROM artists WHERE name='50 Cent'), 3, '/static/images/Get_Rich_or_Die_Tryin.png', '/static/audio/Get_Rich_or_Die_Tryin.wav'),
('Life After Death', (SELECT id FROM artists WHERE name='The Notorious B.I.G.'), 3, '/static/images/Life_After_Death.png', '/static/audio/Life_After_Death.wav'),
('The Score', (SELECT id FROM artists WHERE name='Fugees'), 3, '/static/images/The_Score.png', '/static/audio/The_Score.wav'),
('Doggystyle', (SELECT id FROM artists WHERE name='Snoop Dogg'), 3, '/static/images/Doggystyle.png', '/static/audio/Doggystyle.wav'),
('Reasonable Doubt', (SELECT id FROM artists WHERE name='Jay-Z'), 3, '/static/images/Reasonable_Doubt.png', '/static/audio/Reasonable_Doubt.wav'),
('Damn', (SELECT id FROM artists WHERE name='Kendrick Lamar'), 3, '/static/images/Damn.png', '/static/audio/Damn.wav'),
('Aquemini', (SELECT id FROM artists WHERE name='Outkast'), 3, '/static/images/Aquemini.png', '/static/audio/Aquemini.wav'),
('The Miseducation of Lauryn Hill', (SELECT id FROM artists WHERE name='Lauryn Hill'), 3, '/static/images/The_Miseducation_of_Lauryn_Hill.png', '/static/audio/The_Miseducation_of_Lauryn_Hill.wav'),
('Black on Both Sides', (SELECT id FROM artists WHERE name='Mos Def'), 3, '/static/images/Black_on_Both_Sides.png', '/static/audio/Black_on_Both_Sides.wav');

-- --- R&B Albums (Genre ID = 4) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Lemonade', (SELECT id FROM artists WHERE name='Beyoncé'), 4, '/static/images/Lemonade.png', '/static/audio/Lemonade.wav'),
('Songs in the Key of Life', (SELECT id FROM artists WHERE name='Stevie Wonder'), 4, '/static/images/Songs_in_the_Key_of_Life.png', '/static/audio/Songs_in_the_Key_of_Life.wav'),
('Dangerously in Love', (SELECT id FROM artists WHERE name='Beyoncé'), 4, '/static/images/Dangerously_in_Love.png', '/static/audio/Dangerously_in_Love.wav'),
('Control', (SELECT id FROM artists WHERE name='Janet Jackson'), 4, '/static/images/Control.png', '/static/audio/Control.wav'),
('Janet', (SELECT id FROM artists WHERE name='Janet Jackson'), 4, '/static/images/Janet.png', '/static/audio/Janet.wav'),
('4', (SELECT id FROM artists WHERE name='Beyoncé'), 4, '/static/images/4.png', '/static/audio/4.wav'),
('I Am... Sasha Fierce', (SELECT id FROM artists WHERE name='Beyoncé'), 4, '/static/images/I_Am_Sasha_Fierce.png', '/static/audio/I_Am_Sasha_Fierce.wav'),
('The Emancipation of Mimi', (SELECT id FROM artists WHERE name='Mariah Carey'), 4, '/static/images/The_Emancipation_of_Mimi.png', '/static/audio/The_Emancipation_of_Mimi.wav'),
('After Hours', (SELECT id FROM artists WHERE name='The Weeknd'), 4, '/static/images/After_Hours.png', '/static/audio/After_Hours.wav'),
('Beauty Behind the Madness', (SELECT id FROM artists WHERE name='The Weeknd'), 4, '/static/images/Beauty_Behind_the_Madness.png', '/static/audio/Beauty_Behind_the_Madness.wav'),
('Starboy', (SELECT id FROM artists WHERE name='The Weeknd'), 4, '/static/images/Starboy.png', '/static/audio/Starboy.wav'),
('24K Magic', (SELECT id FROM artists WHERE name='Bruno Mars'), 4, '/static/images/24K_Magic.png', '/static/audio/24K_Magic.wav'),
('Back to Black', (SELECT id FROM artists WHERE name='Amy Winehouse'), 4, '/static/images/Back_to_Black.png', '/static/audio/Back_to_Black.wav'),
('I Never Loved a Man the Way I Love You', (SELECT id FROM artists WHERE name='Aretha Franklin'), 4, '/static/images/I_Never_Loved_a_Man_the_Way_I_Love_You.png', '/static/audio/I_Never_Loved_a_Man_the_Way_I_Love_You.wav'),
('Lady Soul', (SELECT id FROM artists WHERE name='Aretha Franklin'), 4, '/static/images/Lady_Soul.png', '/static/audio/Lady_Soul.wav'),
('A Seat at the Table', (SELECT id FROM artists WHERE name='Solange'), 4, '/static/images/A_Seat_at_the_Table.png', '/static/audio/A_Seat_at_the_Table.wav'),
('What''s Going On', (SELECT id FROM artists WHERE name='Marvin Gaye'), 4, '/static/images/Whats_Going_On.png', '/static/audio/Whats_Going_On.wav'),
('Funk This', (SELECT id FROM artists WHERE name='Chaka Khan'), 4, '/static/images/Funk_This.png', '/static/audio/Funk_This.wav'),
('Justified', (SELECT id FROM artists WHERE name='Justin Timberlake'), 4, '/static/images/Justified_RB.png', '/static/audio/Justified_RB.wav'),
('FutureSex/LoveSounds', (SELECT id FROM artists WHERE name='Justin Timberlake'), 4, '/static/images/FutureSex_LoveSounds.png', '/static/audio/FutureSex_LoveSounds.wav');

-- --- Jazz Albums (Genre ID = 5) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Kind of Blue', (SELECT id FROM artists WHERE name='Miles Davis'), 5, '/static/images/Kind_of_Blue.png', '/static/audio/Kind_of_Blue.wav'),
('A Love Supreme', (SELECT id FROM artists WHERE name='John Coltrane'), 5, '/static/images/A_Love_Supreme.png', '/static/audio/A_Love_Supreme.wav'),
('Time Out', (SELECT id FROM artists WHERE name='The Dave Brubeck Quartet'), 5, '/static/images/Time_Out.png', '/static/audio/Time_Out.wav'),
('Blue Train', (SELECT id FROM artists WHERE name='John Coltrane'), 5, '/static/images/Blue_Train.png', '/static/audio/Blue_Train.wav'),
('Bitches Brew', (SELECT id FROM artists WHERE name='Miles Davis'), 5, '/static/images/Bitches_Brew.png', '/static/audio/Bitches_Brew.wav'),
('Mingus Ah Um', (SELECT id FROM artists WHERE name='Charles Mingus'), 5, '/static/images/Mingus_Ah_Um.png', '/static/audio/Mingus_Ah_Um.wav'),
('The Shape of Jazz to Come', (SELECT id FROM artists WHERE name='Ornette Coleman'), 5, '/static/images/The_Shape_of_Jazz_to_Come.png', '/static/audio/The_Shape_of_Jazz_to_Come.wav'),
('Somethin'' Else', (SELECT id FROM artists WHERE name='Cannonball Adderley'), 5, '/static/images/Somethin_Else.png', '/static/audio/Somethin_Else.wav'),
('My Favorite Things', (SELECT id FROM artists WHERE name='John Coltrane'), 5, '/static/images/My_Favorite_Things.png', '/static/audio/My_Favorite_Things.wav'),
('Speak No Evil', (SELECT id FROM artists WHERE name='Wayne Shorter'), 5, '/static/images/Speak_No_Evil.png', '/static/audio/Speak_No_Evil.wav'),
('Headhunters', (SELECT id FROM artists WHERE name='Herbie Hancock'), 5, '/static/images/Headhunters.png', '/static/audio/Headhunters.wav'),
('The Black Saint and the Sinner Lady', (SELECT id FROM artists WHERE name='Charles Mingus'), 5, '/static/images/The_Black_Saint_and_the_Sinner_Lady.png', '/static/audio/The_Black_Saint_and_the_Sinner_Lady.wav'),
('Giant Steps', (SELECT id FROM artists WHERE name='John Coltrane'), 5, '/static/images/Giant_Steps.png', '/static/audio/Giant_Steps.wav'),
('Sketches of Spain', (SELECT id FROM artists WHERE name='Miles Davis'), 5, '/static/images/Sketches_of_Spain.png', '/static/audio/Sketches_of_Spain.wav'),
('Empyrean Isles', (SELECT id FROM artists WHERE name='Herbie Hancock'), 5, '/static/images/Empyrean_Isles.png', '/static/audio/Empyrean_Isles.wav'),
('Ballads', (SELECT id FROM artists WHERE name='John Coltrane'), 5, '/static/images/Ballads.png', '/static/audio/Ballads.wav'),
('Out to Lunch!', (SELECT id FROM artists WHERE name='Eric Dolphy'), 5, '/static/images/Out_to_Lunch.png', '/static/audio/Out_to_Lunch.wav'),
('Ella Fitzgerald Sings the Cole Porter Song Book', (SELECT id FROM artists WHERE name='Ella Fitzgerald'), 5, '/static/images/Ella_Fitzgerald_Sings_the_Cole_Porter_Song_Book.png', '/static/audio/Ella_Fitzgerald_Sings_the_Cole_Porter_Song_Book.wav'),
('Ella in Berlin: Mack the Knife', (SELECT id FROM artists WHERE name='Ella Fitzgerald'), 5, '/static/images/Ella_in_Berlin_Mack_the_Knife.png', '/static/audio/Ella_in_Berlin_Mack_the_Knife.wav'),
('Maiden Voyage', (SELECT id FROM artists WHERE name='Herbie Hancock'), 5, '/static/images/Maiden_Voyage.png', '/static/audio/Maiden_Voyage.wav');

-- --- Classical Albums (Genre ID = 6) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('The Four Seasons', (SELECT id FROM artists WHERE name='Vivaldi'), 6, '/static/images/The_Four_Seasons.png', '/static/audio/The_Four_Seasons.wav'),
('Beethoven: Symphony No. 9', (SELECT id FROM artists WHERE name='Beethoven/Herbert von Karajan'), 6, '/static/images/Beethoven_Symphony_No_9.png', '/static/audio/Beethoven_Symphony_No_9.wav'),
('Mozart: Requiem', (SELECT id FROM artists WHERE name='Mozart'), 6, '/static/images/Mozart_Requiem.png', '/static/audio/Mozart_Requiem.wav'),
('Goldberg Variations', (SELECT id FROM artists WHERE name='Glenn Gould'), 6, '/static/images/Goldberg_Variations.png', '/static/audio/Goldberg_Variations.wav'),
('Messiah', (SELECT id FROM artists WHERE name='Handel/The King\'s College Choir'), 6, '/static/images/Messiah.png', '/static/audio/Messiah.wav'),
('Swan Lake', (SELECT id FROM artists WHERE name='Tchaikovsky/Mariinsky Orchestra'), 6, '/static/images/Swan_Lake.png', '/static/audio/Swan_Lake.wav'),
('Beethoven: Symphony No. 5', (SELECT id FROM artists WHERE name='Beethoven'), 6, '/static/images/Beethoven_Symphony_No_5.png', '/static/audio/Beethoven_Symphony_No_5.wav'),
('A German Requiem', (SELECT id FROM artists WHERE name='Brahms'), 6, '/static/images/A_German_Requiem.png', '/static/audio/A_German_Requiem.wav'),
('Symphony No. 9 From the New World', (SELECT id FROM artists WHERE name='Dvorak'), 6, '/static/images/Symphony_No_9_From_the_New_World.png', '/static/audio/Symphony_No_9_From_the_New_World.wav'),
('Piano Concerto No. 2', (SELECT id FROM artists WHERE name='Rachmaninoff'), 6, '/static/images/Piano_Concerto_No_2.png', '/static/audio/Piano_Concerto_No_2.wav'),
('The Rite of Spring', (SELECT id FROM artists WHERE name='Stravinsky'), 6, '/static/images/The_Rite_of_Spring.png', '/static/audio/The_Rite_of_Spring.wav'),
('Mahler: Symphony No. 5', (SELECT id FROM artists WHERE name='Mahler'), 6, '/static/images/Mahler_Symphony_No_5.png', '/static/audio/Mahler_Symphony_No_5.wav'),
('Shostakovich: Symphony No. 5', (SELECT id FROM artists WHERE name='Shostakovich'), 6, '/static/images/Shostakovich_Symphony_No_5.png', '/static/audio/Shostakovich_Symphony_No_5.wav'),
('Clair de Lune', (SELECT id FROM artists WHERE name='Debussy'), 6, '/static/images/Clair_de_Lune.png', '/static/audio/Clair_de_Lune.wav'),
('Boléro', (SELECT id FROM artists WHERE name='Ravel'), 6, '/static/images/Bolero.png', '/static/audio/Bolero.wav'),
('Winterreise', (SELECT id FROM artists WHERE name='Schubert'), 6, '/static/images/Winterreise.png', '/static/audio/Winterreise.wav'),
('La Bohème', (SELECT id FROM artists WHERE name='Puccini'), 6, '/static/images/La_Boheme.png', '/static/audio/La_Boheme.wav'),
('Aida', (SELECT id FROM artists WHERE name='Verdi'), 6, '/static/images/Aida.png', '/static/audio/Aida.wav'),
('Water Music', (SELECT id FROM artists WHERE name='Handel'), 6, '/static/images/Water_Music.png', '/static/audio/Water_Music.wav'),
('The Magic Flute', (SELECT id FROM artists WHERE name='Mozart'), 6, '/static/images/The_Magic_Flute.png', '/static/audio/The_Magic_Flute.wav');

-- --- Country Albums (Genre ID = 7) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Golden Hour', (SELECT id FROM artists WHERE name='Kacey Musgraves'), 7, '/static/images/Golden_Hour.png', '/static/audio/Golden_Hour.wav'),
('Traveller', (SELECT id FROM artists WHERE name='Chris Stapleton'), 7, '/static/images/Traveller.png', '/static/audio/Traveller.wav'),
('Fearless', (SELECT id FROM artists WHERE name='Taylor Swift'), 7, '/static/images/Fearless.png', '/static/audio/Fearless.wav'),
('No Fences', (SELECT id FROM artists WHERE name='Garth Brooks'), 7, '/static/images/No_Fences.png', '/static/audio/No_Fences.wav'),
('Come On Over', (SELECT id FROM artists WHERE name='Shania Twain'), 7, '/static/images/Come_On_Over.png', '/static/audio/Come_On_Over.wav'),
('Red', (SELECT id FROM artists WHERE name='Taylor Swift'), 7, '/static/images/Red.png', '/static/audio/Red.wav'),
('At Folsom Prison', (SELECT id FROM artists WHERE name='Johnny Cash'), 7, '/static/images/At_Folsom_Prison.png', '/static/audio/At_Folsom_Prison.wav'),
('American Recordings', (SELECT id FROM artists WHERE name='Johnny Cash'), 7, '/static/images/American_Recordings.png', '/static/audio/American_Recordings.wav'),
('Storms of Life', (SELECT id FROM artists WHERE name='Randy Travis'), 7, '/static/images/Storms_of_Life.png', '/static/audio/Storms_of_Life.wav'),
('Wide Open Spaces', (SELECT id FROM artists WHERE name='Dixie Chicks'), 7, '/static/images/Wide_Open_Spaces.png', '/static/audio/Wide_Open_Spaces.wav'),
('Fly', (SELECT id FROM artists WHERE name='Dixie Chicks'), 7, '/static/images/Fly.png', '/static/audio/Fly.wav'),
('This One''s for You', (SELECT id FROM artists WHERE name='Luke Combs'), 7, '/static/images/This_Ones_for_You.png', '/static/audio/This_Ones_for_You.wav'),
('My Kinda Party', (SELECT id FROM artists WHERE name='Jason Aldean'), 7, '/static/images/My_Kinda_Party.png', '/static/audio/My_Kinda_Party.wav'),
('Revolution', (SELECT id FROM artists WHERE name='Miranda Lambert'), 7, '/static/images/Revolution.png', '/static/audio/Revolution.wav'),
('Platinum', (SELECT id FROM artists WHERE name='Miranda Lambert'), 7, '/static/images/Platinum.png', '/static/audio/Platinum.wav'),
('Paper Airplane', (SELECT id FROM artists WHERE name='Alison Krauss & Union Station'), 7, '/static/images/Paper_Airplane.png', '/static/audio/Paper_Airplane.wav'),
('Ride', (SELECT id FROM artists WHERE name='Martina McBride'), 7, '/static/images/Ride.png', '/static/audio/Ride.wav'),
('Some Hearts', (SELECT id FROM artists WHERE name='Carrie Underwood'), 7, '/static/images/Some_Hearts.png', '/static/audio/Some_Hearts.wav'),
('The Outsiders', (SELECT id FROM artists WHERE name='Eric Church'), 7, '/static/images/The_Outsiders.png', '/static/audio/The_Outsiders.wav'),
('Chief', (SELECT id FROM artists WHERE name='Eric Church'), 7, '/static/images/Chief.png', '/static/audio/Chief.wav');

-- --- Reggae Albums (Genre ID = 8) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Exodus', (SELECT id FROM artists WHERE name='Bob Marley & The Wailers'), 8, '/static/images/Exodus.png', '/static/audio/Exodus.wav'),
('Legend', (SELECT id FROM artists WHERE name='Bob Marley & The Wailers'), 8, '/static/images/Legend.png', '/static/audio/Legend.wav'),
('Kaya', (SELECT id FROM artists WHERE name='Bob Marley & The Wailers'), 8, '/static/images/Kaya.png', '/static/audio/Kaya.wav'),
('Rastaman Vibration', (SELECT id FROM artists WHERE name='Bob Marley & The Wailers'), 8, '/static/images/Rastaman_Vibration.png', '/static/audio/Rastaman_Vibration.wav'),
('Natty Dread', (SELECT id FROM artists WHERE name='Bob Marley & The Wailers'), 8, '/static/images/Natty_Dread.png', '/static/audio/Natty_Dread.wav'),
('Survival', (SELECT id FROM artists WHERE name='Bob Marley & The Wailers'), 8, '/static/images/Survival.png', '/static/audio/Survival.wav'),
('Marcus Garvey', (SELECT id FROM artists WHERE name='Burning Spear'), 8, '/static/images/Marcus_Garvey.png', '/static/audio/Marcus_Garvey.wav'),
('Legalize It', (SELECT id FROM artists WHERE name='Peter Tosh'), 8, '/static/images/Legalize_It.png', '/static/audio/Legalize_It.wav'),
('Equal Rights', (SELECT id FROM artists WHERE name='Peter Tosh'), 8, '/static/images/Equal_Rights.png', '/static/audio/Equal_Rights.wav'),
('Rastaman Chant', (SELECT id FROM artists WHERE name='Toots & the Maytals'), 8, '/static/images/Rastaman_Chant.png', '/static/audio/Rastaman_Chant.wav'),
('Social Living', (SELECT id FROM artists WHERE name='Jimmy Cliff'), 8, '/static/images/Social_Living.png', '/static/audio/Social_Living.wav'),
('African Reggae', (SELECT id FROM artists WHERE name='Third World'), 8, '/static/images/African_Reggae.png', '/static/audio/African_Reggae.wav'),
('Red, Gold & Green', (SELECT id FROM artists WHERE name='Bunny Wailer'), 8, '/static/images/Red_Gold_Green.png', '/static/audio/Red_Gold_Green.wav'),
('Blackheart Man', (SELECT id FROM artists WHERE name='Bunny Wailer'), 8, '/static/images/Blackheart_Man.png', '/static/audio/Blackheart_Man.wav'),
('Love Is My Religion', (SELECT id FROM artists WHERE name='Ziggy Marley'), 8, '/static/images/Love_Is_My_Religion.png', '/static/audio/Love_Is_My_Religion.wav'),
('Fly High', (SELECT id FROM artists WHERE name='Ziggy Marley'), 8, '/static/images/Fly_High.png', '/static/audio/Fly_High.wav'),
('Hail H.I.M.', (SELECT id FROM artists WHERE name='Burning Spear'), 8, '/static/images/Hail_HIM.png', '/static/audio/Hail_HIM.wav'),
('Revolution Rock', (SELECT id FROM artists WHERE name='Sound Dimension'), 8, '/static/images/Revolution_Rock.png', '/static/audio/Revolution_Rock.wav'),
('Reggae Got Soul', (SELECT id FROM artists WHERE name='Toots & the Maytals'), 8, '/static/images/Reggae_Got_Soul.png', '/static/audio/Reggae_Got_Soul.wav'),
('Real Rock', (SELECT id FROM artists WHERE name='Sound Dimension'), 8, '/static/images/Real_Rock.png', '/static/audio/Real_Rock.wav');

-- --- Metal Albums (Genre ID = 9) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Master of Puppets', (SELECT id FROM artists WHERE name='Metallica'), 9, '/static/images/Master_of_Puppets.png', '/static/audio/Master_of_Puppets.wav'),
('Ride the Lightning', (SELECT id FROM artists WHERE name='Metallica'), 9, '/static/images/Ride_the_Lightning.png', '/static/audio/Ride_the_Lightning.wav'),
('Kill ''Em All', (SELECT id FROM artists WHERE name='Metallica'), 9, '/static/images/Kill_Em_All.png', '/static/audio/Kill_Em_All.wav'),
('And Justice for All', (SELECT id FROM artists WHERE name='Metallica'), 9, '/static/images/And_Justice_for_All.png', '/static/audio/And_Justice_for_All.wav'),
('The Black Album', (SELECT id FROM artists WHERE name='Metallica'), 9, '/static/images/The_Black_Album.png', '/static/audio/The_Black_Album.wav'),
('The Number of the Beast', (SELECT id FROM artists WHERE name='Iron Maiden'), 9, '/static/images/The_Number_of_the_Beast.png', '/static/audio/The_Number_of_the_Beast.wav'),
('Powerslave', (SELECT id FROM artists WHERE name='Iron Maiden'), 9, '/static/images/Powerslave.png', '/static/audio/Powerslave.wav'),
('Fear of the Dark', (SELECT id FROM artists WHERE name='Iron Maiden'), 9, '/static/images/Fear_of_the_Dark.png', '/static/audio/Fear_of_the_Dark.wav'),
('Paranoid', (SELECT id FROM artists WHERE name='Black Sabbath'), 9, '/static/images/Paranoid_Metal.png', '/static/audio/Paranoid_Metal.wav'),
('Black Sabbath', (SELECT id FROM artists WHERE name='Black Sabbath'), 9, '/static/images/Black_Sabbath.png', '/static/audio/Black_Sabbath.wav'),
('Reign in Blood', (SELECT id FROM artists WHERE name='Slayer'), 9, '/static/images/Reign_in_Blood.png', '/static/audio/Reign_in_Blood.wav'),
('South of Heaven', (SELECT id FROM artists WHERE name='Slayer'), 9, '/static/images/South_of_Heaven.png', '/static/audio/South_of_Heaven.wav'),
('Rust in Peace', (SELECT id FROM artists WHERE name='Megadeth'), 9, '/static/images/Rust_in_Peace.png', '/static/audio/Rust_in_Peace.wav'),
('Countdown to Extinction', (SELECT id FROM artists WHERE name='Megadeth'), 9, '/static/images/Countdown_to_Extinction.png', '/static/audio/Countdown_to_Extinction.wav'),
('Epicus Doomicus Metallicus', (SELECT id FROM artists WHERE name='Candlemass'), 9, '/static/images/Epicus_Doomicus_Metallicus.png', '/static/audio/Epicus_Doomicus_Metallicus.wav'),
('Blackwater Park', (SELECT id FROM artists WHERE name='Opeth'), 9, '/static/images/Blackwater_Park.png', '/static/audio/Blackwater_Park.wav'),
('Toxicity', (SELECT id FROM artists WHERE name='System of a Down'), 9, '/static/images/Toxicity.png', '/static/audio/Toxicity.wav'),
('Lateralus', (SELECT id FROM artists WHERE name='Tool'), 9, '/static/images/Lateralus.png', '/static/audio/Lateralus.wav'),
('Ace of Spades', (SELECT id FROM artists WHERE name='Motörhead'), 9, '/static/images/Ace_of_Spades.png', '/static/audio/Ace_of_Spades.wav'),
('Reign of Terror', (SELECT id FROM artists WHERE name='Overkill'), 9, '/static/images/Reign_of_Terror.png', '/static/audio/Reign_of_Terror.wav');

-- --- Electronic Albums (Genre ID = 10) ---
INSERT INTO albums (title, artist_id, genre_id, cover_image, audio_file) VALUES
('Discovery', (SELECT id FROM artists WHERE name='Daft Punk'), 10, '/static/images/Discovery.png', '/static/audio/Discovery.wav'),
('Homework', (SELECT id FROM artists WHERE name='Daft Punk'), 10, '/static/images/Homework.png', '/static/audio/Homework.wav'),
('Play', (SELECT id FROM artists WHERE name='Moby'), 10, '/static/images/Play.png', '/static/audio/Play.wav'),
('Random Access Memories', (SELECT id FROM artists WHERE name='Daft Punk'), 10, '/static/images/Random_Access_Memories.png', '/static/audio/Random_Access_Memories.wav'),
('In Return', (SELECT id FROM artists WHERE name='ODESZA'), 10, '/static/images/In_Return.png', '/static/audio/In_Return.wav'),
('Silent Shout', (SELECT id FROM artists WHERE name='The Knife'), 10, '/static/images/Silent_Shout.png', '/static/audio/Silent_Shout.wav'),
('Music Has the Right to Children', (SELECT id FROM artists WHERE name='Boards of Canada'), 10, '/static/images/Music_Has_the_Right_to_Children.png', '/static/audio/Music_Has_the_Right_to_Children.wav'),
('Untrue', (SELECT id FROM artists WHERE name='Burial'), 10, '/static/images/Untrue.png', '/static/audio/Untrue.wav'),
('Selected Ambient Works 85-92', (SELECT id FROM artists WHERE name='Aphex Twin'), 10, '/static/images/Selected_Ambient_Works_85-92.png', '/static/audio/Selected_Ambient_Works_85-92.wav'),
('Selected Ambient Works Volume II', (SELECT id FROM artists WHERE name='Aphex Twin'), 10, '/static/images/Selected_Ambient_Works_Volume_II.png', '/static/audio/Selected_Ambient_Works_Volume_II.wav'),
('Since I Left You', (SELECT id FROM artists WHERE name='The Avalanches'), 10, '/static/images/Since_I_Left_You.png', '/static/audio/Since_I_Left_You.wav'),
('Dig Your Own Hole', (SELECT id FROM artists WHERE name='The Chemical Brothers'), 10, '/static/images/Dig_Your_Own_Hole.png', '/static/audio/Dig_Your_Own_Hole.wav'),
('Exit Planet Dust', (SELECT id FROM artists WHERE name='The Chemical Brothers'), 10, '/static/images/Exit_Planet_Dust.png', '/static/audio/Exit_Planet_Dust.wav'),
('Human After All', (SELECT id FROM artists WHERE name='Daft Punk'), 10, '/static/images/Human_After_All.png', '/static/audio/Human_After_All.wav'),
('Cross', (SELECT id FROM artists WHERE name='Justice'), 10, '/static/images/Cross.png', '/static/audio/Cross.wav'),
('Alive 2007', (SELECT id FROM artists WHERE name='Daft Punk'), 10, '/static/images/Alive_2007.png', '/static/audio/Alive_2007.wav'),
('A Moment Apart', (SELECT id FROM artists WHERE name='ODESZA'), 10, '/static/images/A_Moment_Apart.png', '/static/audio/A_Moment_Apart.wav'),
('Go Plastic', (SELECT id FROM artists WHERE name='Squarepusher'), 10, '/static/images/Go_Plastic.png', '/static/audio/Go_Plastic.wav'),
('Black Sands', (SELECT id FROM artists WHERE name='Bonobo'), 10, '/static/images/Black_Sands.png', '/static/audio/Black_Sands.wav'),
('In Colour', (SELECT id FROM artists WHERE name='Jamie xx'), 10, '/static/images/In_Colour.png', '/static/audio/In_Colour.wav');

-- ======================================================
-- End Albums Insert
-- ======================================================


-- ======================================================
-- 3. Insert Tracks for Select Albums (Full Tracklists provided for key titles)
-- For the remaining albums, please insert the complete tracklists as needed.
-- ======================================================

-- Example: Full tracklist for "The Dark Side of the Moon" (Pink Floyd)
INSERT INTO tracks (album_id, track_number, title, duration) VALUES
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 1, 'Speak to Me', '1:30'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 2, 'Breathe (In the Air)', '2:43'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 3, 'On the Run', '3:30'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 4, 'Time', '6:53'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 5, 'The Great Gig in the Sky', '4:15'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 6, 'Money', '6:22'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 7, 'Us and Them', '7:49'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 8, 'Any Colour You Like', '3:26'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 9, 'Brain Damage', '3:50'),
((SELECT id FROM albums WHERE title='The Dark Side of the Moon'), 10, 'Eclipse', '2:03');

-- Example: Full tracklist for "Thriller" (Michael Jackson)
INSERT INTO tracks (album_id, track_number, title, duration) VALUES
((SELECT id FROM albums WHERE title='Thriller'), 1, 'Wanna Be Startin'' Somethin''', '6:03'),
((SELECT id FROM albums WHERE title='Thriller'), 2, 'Baby Be Mine', '4:20'),
((SELECT id FROM albums WHERE title='Thriller'), 3, 'The Girl Is Mine', '3:42'),
((SELECT id FROM albums WHERE title='Thriller'), 4, 'Thriller', '5:57'),
((SELECT id FROM albums WHERE title='Thriller'), 5, 'Beat It', '4:18'),
((SELECT id FROM albums WHERE title='Thriller'), 6, 'Billie Jean', '4:54'),
((SELECT id FROM albums WHERE title='Thriller'), 7, 'Human Nature', '4:06'),
((SELECT id FROM albums WHERE title='Thriller'), 8, 'P.Y.T. (Pretty Young Thing)', '3:59'),
((SELECT id FROM albums WHERE title='Thriller'), 9, 'The Lady in My Life', '4:59');

-- Example: Full tracklist for "The Marshall Mathers LP" (Eminem)
INSERT INTO tracks (album_id, track_number, title, duration) VALUES
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 1, 'Public Service Announcement 2000', '0:26'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 2, 'Kill You', '5:17'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 3, 'Stan', '6:44'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 4, 'Paul (Skit)', '0:38'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 5, 'Who Knew', '4:00'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 6, 'The Way I Am', '4:49'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 7, 'The Real Slim Shady', '4:44'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 8, 'Remember Me?', '4:28'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 9, 'I''m Back', '3:12'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 10, 'Marshall Mathers', '4:28'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 11, 'Ken Kaniff (Skit)', '0:43'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 12, 'Drug Ballad', '5:28'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 13, 'Amityville', '4:32'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 14, 'Kim', '6:21'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 15, 'Under the Influence', '5:03'),
((SELECT id FROM albums WHERE title='The Marshall Mathers LP'), 16, 'Criminal', '4:07');

-- (Additional full tracklists for select albums such as "Lemonade", "Kind of Blue", etc., would follow here.)

-- For all other albums, please insert the full tracklists accordingly.
-- ======================================================
-- End Tracks Insert
-- ======================================================
