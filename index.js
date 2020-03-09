/* 

용도 : 프로필 서버 봇 
구매자 : MFR_Fave_-#9988 
초기 코드개발자 : WhiteKJ#1801
2차수정 : 가능
2차배포 : 불가능

** 해당 메세지를 지우지 마세요. ** 

*/

join_id = "685796363010703422"; //<- 입장 메세지를 보내는 채널 아이디입니다.
leave_id = "685796372359675914"; //<- 퇴장 메세지를 보내는 채널 아이디 입니다.
log_id = "677841054967398417"; //<- 메세지 삭제 및 수정 로그를 보내는 채널 아이디입니다.


const Discord = require('discord.js');
const Util = require('discord.js')
const { PREFIX, GOOGLE_API_KEY, Token } = require('./lib/config.js'); 
const client = new Discord.Client ();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();
client.on('warn', console.warn);
client.on('error', console.error);
client.on('disconnect', () => console.log('Reconnecting in few seconds.'));
client.on('reconnecting', () => console.log('Reconnecting....'));

client.on('ready', () => {
	(async function () {
		function sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms))
		};
		console.log(client.user.tag)
		console.log(client.user.id)
		console.log('I am ready!');
		var i = 0;
		while (i < 10) {
			client.user.setPresence({
				game: {
					name: 'MFR SCRIM 문의는'
				},
				status: 'online'
			})
			await sleep(5000)
			client.user.setPresence({
				game: {
					name: '오른쪽 리스트에 있는 관리자로 주세요 !'
				},
				status: 'online'
			})
			await sleep(5000)
		}
	})();
});

client.on('message', (message) => {
	if(message.author.bot) return;

	if (message.content.startsWith('-say')) {
		var id = message.author.id
		var sayMessage = message.content.substring(4)
			if (id == '662473984226492437') {
				message.delete()
				message.channel.send(sayMessage);
			} else {
				message.channel.send(`<@${message.author.id}>:\n` + sayMessage)
			}
	}

	if (message.content.startsWith('-kick')) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			return message.channel.send("명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
		};
		var args = message.mentions.members.first();
		if (!args) {
			return message.reply("`-kick [멘션]` 가 올바른 명령어입니다.")
		};
		var member = message.mentions.members.first();
		member.kick().then((member) => {
			message.channel.send(":wave: " + member.displayName + " 님이 서버에서 추방되었습니다. ");
		}).catch(() => {
			message.channel.send(member.displayName + " 의 권한이 봇보다 높아서 추방하는데 실패했습니다.");
		});
	}

	if (message.content.startsWith('-mute')) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			return message.channel.send("명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
		};
		var args = message.mentions.members.first();
		if (!args) {
			return message.reply("`-mute [멘션]` 가 올바른 명령어입니다.")
		};
		try {
			const role = message.guild.roles.find(role => role.name === 'Muted');
			args.addRole(role);
			message.channel.send(":mute: " + args + " 님을 채팅 금지 처리했습니다.")
		} catch (error) {
			message.channel.send("오류가 발생했습니다.\n혹시 대상이 이미 채팅금지 상태가 이거나 Muted 역할이 봇 권한보다 높이 있거나, `Muted` 역할이 없는것으로 추정됩니다.\n 자세한 오류 : \n" + error)
		}
	}

	if (message.content.startsWith('-unmute')) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			return message.channel.send("명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
		};
		var args = message.mentions.members.first();
		if (!args) {
			return message.reply("`-unmute [멘션]` 가 올바른 명령어입니다.")
		};
		try {
			const role = message.guild.roles.find(role => role.name === 'Muted');
			args.removeRole(role);
			message.channel.send(":loud_sound: " + args + " 님의 채팅 금지를 해제했습니다.")
		} catch (error) {
			message.channel.send("오류가 발생했습니다.\n혹시 대상이 이미 채팅금지 상태가 아니거나 `Muted` 역할이 없는것으로 추정됩니다.\n 자세한 오류 : \n" + error)
		}
	}

	if (message.content.startsWith('-ban')) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			return message.channel.send("명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
		};
		var args = message.mentions.members.first();
		if (!args) {
			return message.reply("`-ban [멘션]` 가 올바른 명령어입니다.")
		};
		var member = message.mentions.members.first();
		member.ban().then((member) => {
			message.channel.send(":wave: " + member.displayName + " 님이 서버에서 차단 되었습니다.");
		}).catch(() => {
			message.channel.send(member.displayName + " 의 권한이 봇보다 높아서 차단하는데 실패했습니다.")
		});
	}

	if (message.content.startsWith('-purge')) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) {
			return message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
		};
		var purge = message.content.substring(7)
			if (!purge) {
				return message.channel.send("숫자를 입력해주세요.")
			}
			if (purge > 100) {
				message.channel.send("1부터 100까지만 입력해주세요.")
				return;
			}
			if (purge < 1) {
				message.channel.send("1부터 100까지만 입력해주세요.")
				return;
			}
			if (isNaN(purge) == true) {
				message.channel.send("숫자만 입력해주세요.")
			} else {
				message.channel.bulkDelete(purge)
				.then(() => message.channel.send(`${purge}개의 메세지를 삭제했습니다.`))
				.catch(console.error)
			}
	}
});


client.on("messageDelete", async msg => {
	if(msg.author.bot) return;
	try {
		let embed = new Discord.RichEmbed()
			.setTitle("메세지가 삭제되었습니다.")
			.setColor("#fc3c3c")
			.addField("삭제한 유저 : ", msg.author.tag, true)
			.addField("채널 : ", msg.channel.name, true)
			.addField("메세지 : ", msg.content.substring(0))
			.setFooter(`삭제한 유저 아이디 : ${msg.author.id}`);
			msg.guild.channels.find(x => x.id === log_id).send(embed)
	} catch (error) {
		console.log("메세지 수정 로깅 중 오류가 발생함.\n" + error)
	}
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.author.id == client.user.id) return;
	try {
		let embed = new Discord.RichEmbed()
			.setTitle("메세지 수정 로그")
			.setColor("#fc3c3c")
			.addField("작성자 태그", oldMessage.author.tag, true)
			.addField("채널 이름", oldMessage.channel.name, true)
			.addField("수정 전", oldMessage, false)
			.addField("수정 후", newMessage, true)
			.setFooter(`메세지 아이디: ${oldMessage.id} | 작성자 아이디: ${oldMessage.author.id}`);
			msg.guild.channels.find(x => x.id === log_id).send(embed)
	} catch (error) {
		console.log("메세지 수정 로깅 중 오류가 발생함.\n" + error)
	}
});

client.on("guildMemberAdd", member => {
	const channel = client.channels.get(join_id)
	let wembed = new Discord.RichEmbed()
		.setColor("#15f153")
		.setTitle(member.displayName + "님이 서버에 입장하셨습니다.")
		.setDescription("MFR SCRIM 서버에 오신것을 환영합니다 !")
	member.send(wembed)
	channel.send(wembed)
});

client.on("guildMemberRemove", member => {
	let wembed = new Discord.RichEmbed()
		.setColor("#15f153")
		.setTitle(member.displayName + "님 안녕히가세요.")
		const channel = client.channels.get(leave_id)
	channel.send(wembed)
})

client.on('message', async msg => {
	function channel_error() {
		let ceEmbed = new Discord.RichEmbed()
			.setTitle("채널을 찾을 수 없습니다. 먼저 음성채널에 들어가고 명령어를 입력해주세요.")
			.setColor('#08f7ba')
		msg.channel.send(ceEmbed)
	}

	function not_playing_error() {
		let nopeEmbed = new Discord.RichEmbed()
			.setTitle("지금 아무것도 안틀고있습니다.")
			.setColor('#08f7ba')
		msg.channel.send(nopeEmbed)
	}

	function voice_error() {
		let veEmbed = new Discord.RichEmbed()
			.setTitle("음성채널에 먼저 들어가고 명령어를 입력해주세요.")
			.setColor('#08f7ba')
		msg.channel.send(veEmbed)
	}

	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return channel_error();
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			let connectEmbed1 = new Discord.RichEmbed()
				.setTitle("음성채널에 들어갈 수 없습니다. 봇의 권한을 확인해주세요.")
				.setColor('#08f7ba')
			return msg.channel.send(connectEmbed1)
		}
		if (!permissions.has('SPEAK')) {
			let speakEmbed1 = new Discord.RichEmbed()
				.setTitle("음악을 재생할 수 없습니다. 봇의 권한을 확인해주세요.")
				.setColor('#08f7ba')
			return msg.channel.send(speakEmbed1)
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}
			let playEmbed1 = new Discord.RichEmbed()
				.setTitle(`**${playlist.title}**가 목록에 추가됬었습니다.`)
				.setColor('#08f7ba')
			msg.channel.send(playEmbed1)
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					let selectionEmbed = new Discord.RichEmbed()
						.setColor('#08f7ba')
						.setTitle("**노래 목록 :**")
						.setDescription(`
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
10부터 1까지 숫자를 골라주세요.
					`)
					msg.channel.send(selectionEmbed);

					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						let errorEmbed1 = new Discord.RichEmbed()
							.setTitle('입력이 없어, 노래 선택을 취소하겠습니다.')
							.setColor('#08f7ba')
						return msg.channel.send(errorEmbed1)
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					let errorEmbed2 = new Discord.RichEmbed()
						.setTitle('검색결과를 찾을 수 없습니다.')
						.setColor('#08f7ba')
					return msg.channel.send(errorEmbed2)
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return voice_error();
		if (!serverQueue) return not_playing_error();
		serverQueue.connection.dispatcher.end('Skip used.');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return voice_error();
		if (!serverQueue) return not_playing_error();
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop used.');
		return undefined;
	} else if (command === 'np') {
		if (!serverQueue) return not_playing_error();
		let npEmbed1 = new Discord.RichEmbed()
			.setColor('#08f7ba')
			.setTitle(`현재 재생중 : **${serverQueue.songs[0].title}**`);
		return msg.channel.send(npEmbed1)
	} else if (command === 'queue') {
		if (!serverQueue) return not_playing_error();
		let queEmbed = new Discord.RichEmbed()
			.setColor('#08f7ba')
			.setDescription(`
**노래 목록:**
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**현재 재생 중:** ${serverQueue.songs[0].title}
		`);
		return msg.channel.send(queEmbed)
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			let paEmbed = new Discord.RichEmbed()
				.setColor('#08f7ba')
				.setTitle("음악을 일시정지 했습니다.")
			return msg.channel.send(paEmbed);
		}
		return not_playing_error();
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			let resEmbed = new Discord.RichEmbed()
				.setColor('#08f7ba')
				.setTitle("일시정지한 음악을 다시 재생시켰습니다.")
			return msg.channel.send(resEmbed);
		}
		return not_playing_error();
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Discord.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`음성채널에 들어갈 수 없습니다. : ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`음성채널에 들어갈 수 없습니다. : ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`**${song.title}** 가 목록에 추가되었습니다.`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 2);

	let playEmbed2 = new Discord.RichEmbed()
		.setColor('#08f7ba')
		.setTitle(`현재 재생중 : **${song.title}**`);

	serverQueue.textChannel.send(playEmbed2)
}


client.login(Token)