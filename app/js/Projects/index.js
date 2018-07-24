var projects = {
	'wwdc' : {
		colorScheme : 0,
		title : 'WWDC - Generative identity',
		preview : require('./Wwdc'),
		info : require( './Wwdc/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'wwdc/wwdc1.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'wwdc/wwdc3.jpg',
				col : 1
			},
			
			{
				type : 'code',
				src : require('./Wwdc/Letters'),
				params : { letter : 'c' },
				col : 1
			},
			{
				type : 'image',
				src : 'wwdc/wwdc5.gif',
				col : 1
			},

			{
				type : 'image',
				src : 'wwdc/wwdc1a.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'wwdc/wwdc4.jpg',
				col : 2
			},
			{
				type : 'youtube',
				src : 'vs3LbC9R0Mg',
				col : 2,
				dims : [1080,1080]
			},
			{
				type : 'youtube',
				src : 'Y6Jr6VJi_-M',
				col : 2,
				dims : [1064,422]
			},
			{
				type : 'youtube',
				src : 'a8nn4Rj6LMM',
				col : 1,
				dims : [796,540]
			},
			{
				type : 'youtube',
				src : '7ag8MhecQNg',
				col : 2,
				dims : [1064,422]
			},
			{
				type : 'youtube',
				src : 'timVNKvxvFQ',
				col : 2,
				dims : [1064,422]
			}
		]
	},
	'megazero' : {
		colorScheme : 0,
		title : 'MEGAZERO - Bootleg of Trochut\'s font',
		preview : require('./Megazero'),
		info : require( './Megazero/copy.pug' ),
		assets : [
			{
				type : 'youtube',
				src : 'oq6VyuKrs7U',
				col : 1,
				dims : [1094,702]
			},
			{
				type : 'youtube',
				src : 'aGSSFTxO4Dk',
				col : 2,
				dims : [1094,702]
			},
			{
				type : 'image',
				src : 'megazero/b.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'megazero/c.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'megazero/f.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'megazero/g.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'megazero/i.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'megazero/k.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'megazero/m.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'megazero/u.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'megazero/x.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'megazero/z.gif',
				col : 2
			}
		]
	},
	'icebergs' : {
		colorScheme : 0,
		title : 'ICEBERGS - Data vizualisation',
		preview : require('./Icebergs'),
		info : require( './Icebergs/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'icebergs/2.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'icebergs/3.gif',
				col : 1
			},
			{
				type : 'youtube',
				src : '_MVgQw0AKfs',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'icebergs/1.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'icebergs/4.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'icebergs/5.gif',
				col : 2
			}
		]
	},
	'remolacha' : {
		colorScheme : 1,
		title : 'REMOLACHA HACKLAB - Generative data vizualisation',
		preview : require('./Remolacha'),
		info : require( './Remolacha/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'remolacha/remolacha1.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'remolacha/remolacha3.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'remolacha/remolacha5.jpg',
				col : 1
			},

			{
				type : 'youtube',
				src : 'vYzD9oucKD4',
				col : 1,
				dims : [1356,1284]
			},
			{
				type : 'youtube',
				src : 'l661hHkbOio',
				col : 1,
				dims : [1356,1284]
			},
			{
				type : 'image',
				src : 'remolacha/remolacha7.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'remolacha/remolacha9.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'remolacha/remolacha11.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'remolacha/remolacha2.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'remolacha/remolacha4.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'remolacha/remolacha6.jpg',
				col : 2
			},
			{
				type : 'youtube',
				src : '8GULYqg1ZKY',
				col : 2,
				dims : [1356,1284]
			},
			{
				type : 'youtube',
				src : 'ZDLa8ag_U1U',
				col : 2,
				dims : [1356,1284]
			},
			{
				type : 'image',
				src : 'remolacha/remolacha8.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'remolacha/remolacha10.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'remolacha/remolacha12.jpg',
				col : 2
			}
		]
	},
	'mugshots' : {
		colorScheme : 0,
		title : 'MUGSHOTS - Face recognition based political satire',
		preview : require('./Mugshots'),
		info : require( './Mugshots/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'mugshots/ms1.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'mugshots/ms3.gif',
				col : 1
			},
			{
				type : 'youtube',
				src : 'thnqOIa8ur4',
				col : 1,
				dims : [1920,1080],
				params : [10, 18]
			},
			{
				type : 'image',
				src : 'mugshots/ms5.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'mugshots/seq.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'mugshots/ms2.gif',
				col : 2
			},
			{
				type : 'youtube',
				src : 'thnqOIa8ur4',
				col : 2,
				dims : [1920,1080],
				params : [38, 48]
			},
			{
				type : 'image',
				src : 'mugshots/ms4.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'mugshots/ms6.gif',
				col : 2
			},
			{
				type : 'youtube',
				src : 'thnqOIa8ur4',
				col : 1,
				dims : [1920,1080]
			}
		]
	},
	'jansky' : {
		colorScheme : 0,
		title : 'JANSKY  - Generative A/V',
		preview : require('./Jansky'),
		info : require( './Jansky/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'jansky/download-1.jpg',
				col : 1
			},
			{
				type : 'youtube',
				src : 'miQAZ6caOVU',
				col : 1,
				dims : [3336,1884]
			},
			{
				type : 'image',
				src : 'jansky/t1.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'jansky/t2.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'jansky/ani.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'jansky/download-2.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'jansky/t3.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'jansky/t4.gif',
				col : 2
			}
		]
	},
	'maslo' : {
		colorScheme : 1,
		title : 'MASLO - An AI driven companion',
		preview : require('./Maslo'),
		info : require( './Maslo/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'maslo/maslo1.jpg',
				col : 1
			},
			{
				type : 'youtube',
				src : 'G7TJxwZ3qII',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'maslo/maslo2.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'maslo/maslo2a.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'maslo/maslo4.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'maslo/maslo5.jpg',
				col : 1
			},
			{
				type : 'youtube',
				src : 'G7TJxwZ3qII',
				col : 1,
				dims : [1920,1080],
				params : [11,20]
			},
			{
				type : 'youtube',
				src : 'G7TJxwZ3qII',
				col : 2,
				dims : [1920,1080],
				params : [48,50]
			},
			{
				type : 'image',
				src : 'maslo/maslo6.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'maslo/maslo3.jpg',
				col : 2
			}
		]
	},
	'jinmin' : {
		colorScheme : 0,
		title : 'JIN MIN - Corporate volumetric identity',
		preview : require('./Jinmin'),
		info : require( './Jinmin/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'jinmin/jincomp_03.png',
				col : 1
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_05.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_09.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_10.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_13.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_14.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_17.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_18.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_21.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'jinmin/jincomp_22.jpg',
				col : 2
			}
		]
	},
	'eina' : {
		colorScheme : 0,
		title : 'EINA 50 ANNIVERSARY - Commemorative procedural logo',
		preview : require('./Eina'),
		info : require( './Eina/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'eina/t1.gif',
				col : 1
			},
			{
				type : 'youtube',
				src : 'QH0jWrTQIGc',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'eina/t2.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'eina/t3.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'eina/t4.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'eina/t5.gif',
				col : 2
			},
			{
				type : 'youtube',
				src : 'QH0jWrTQIGc',
				col : 2,
				dims : [1920,1080],
				params : [5,8]
			},
			{
				type : 'image',
				src : 'eina/t6.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'eina/t7.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'eina/t8.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'eina/t9.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'eina/t10.gif',
				col : 1
			},
			{
				type : 'youtube',
				src : 'QH0jWrTQIGc',
				col : 1,
				dims : [1920,1080],
				params : [31,34]
			},
			{
				type : 'image',
				src : 'eina/t11.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'eina/t12.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'eina/t1.gif',
				col : 2
			}
		]
	},
	'quantum' : {
		colorScheme : 1,
		title : 'QUANTUM FONT - Experimental typeface',
		preview : require('./Quantum'),
		info : require( './Quantum/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'quantum/a.gif',
				col : 1
			},
			{
				type : 'youtube',
				src : 'vZBneD6tlbM',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'quantum/b.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'quantum/c.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'quantum/d.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'quantum/e.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'quantum/f.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'quantum/g.gif',
				col : 2
			},
			{
				type : 'image',
				src : 'quantum/h.gif',
				col : 2
			}
		]
	},
	'bulli' : {
		colorScheme : 1,
		title : 'EL BULLI - Procedural illustrations',
		preview : require('./Bulli'),
		info : require( './Bulli/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'bulli/0a.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/0b.jpg',
				col : 2
			},
			{
				type : 'code',
				src : require('./Bulli/Line'),
				params : { select : 0 },
				col : 1
			},
			{
				type : 'code',
				src : require('./Bulli/Line'),
				params : { select : 1 },
				col : 2
			},
			{
				type : 'image',
				src : 'bulli/1a.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/1b.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'bulli/2a.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/2b.jpg',
				col : 2
			},
			{
				type : 'code',
				src : require('./Bulli/Line'),
				params : { select : 2 },
				col : 2
			},
			{
				type : 'code',
				src : require('./Bulli/Line'),
				params : { select : 3 },
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/3a.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/3b.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'bulli/4a.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/4b.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'bulli/4_r.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/9.jpg',
				col : 2
			},
			{
				type : 'code',
				src : require('./Bulli/Line'),
				params : { select : 4 },
				col : 1
			},
			{
				type : 'image',
				src : 'bulli/7.jpg',
				col : 2
			}
		]
	},
	'sxsw' : {
		colorScheme : 0,
		title : 'PINTEREST@SXSW 2018 - Tastegraph visualizer',
		preview : require('./Sxsw'),
		info : require( './Sxsw/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'sxsw/sxsw1.jpg',
				col : 1
			},
			{
				type : 'youtube',
				src : 'XOHt1uUyOm0',
				col : 1,
				dims : [1920,1080]
			},
			{
				type : 'youtube',
				src : 'fITkgodJLY4',
				col : 1,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'sxsw/idea.jpg',
				col : 1
			},
			{
				type : 'youtube',
				src : 'D424b0I_orc',
				col : 1,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'sxsw/sxsw1a.jpg',
				col : 2
			},
			{
				type : 'youtube',
				src : '_p0mCEQmS80',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'youtube',
				src : 'X5Wnt1KAGrE',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'sxsw/container.jpg',
				col : 2
			},
			{
				type : 'image',
				src : 'sxsw/print.jpg',
				col : 2
			},
			{
				type : 'youtube',
				src : '3jryUsCqC-o',
				col : 2,
				dims : [1920,1080]
			},
			{
				type : 'image',
				src : 'sxsw/door.jpg',
				col : 2
			}
			
		]
	},
	'santamonica' : {
		colorScheme : 0,
		title : 'SANTAMONICA - font script for corporate identity',
		preview : require('./Santamonica'),
		info : require( './Santamonica/copy.pug' ),
		assets : [
			{
				type : 'image',
				src : 'santamonica/sm1.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'santamonica/sm2.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'santamonica/sm3.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'santamonica/sm4.gif',
				col : 1
			},
			{
				type : 'image',
				src : 'santamonica/sm5.jpg',
				col : 1
			},
			{
				type : 'image',
				src : 'santamonica/sm9.jpg',
				col : 1
			},
			{
				type : 'youtube',
				src : '9ZVmMrCrTnk',
				col : 2,
				dims : [2268,1276]
			},
			{
				type : 'image',
				src : 'santamonica/sm6.jpg',
				col : 2
			},
			{
				type : 'youtube',
				src : 'KjFbZGsutCY',
				col : 2,
				dims : [1116,712]
			},
			{
				type : 'image',
				src : 'santamonica/sm7.png',
				col : 2
			},
			{
				type : 'image',
				src : 'santamonica/sm8.jpg',
				col : 2
			},
			{
				type : 'youtube',
				src : 'M9IbFS5-ae4',
				col : 2,
				dims : [1600,1080]
			}
		]
	}
}

module.exports = projects;