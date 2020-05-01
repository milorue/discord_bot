const Discord = require('discord.js')

const client = new Discord.Client();

const request = require('request')

const credentials = require('./discord_credentials')  // hides bot credentials
const bot_credentials = credentials.discord_bot_key

// universal variables

const leaguePatch ='10.8.1' // set up update cycle for this


// initializes application & client
client.on('ready', () =>{
    console.log('I am ready')
})

// ===================
// utility
// ===================

client.on('message', message=>{
    if(!message.guild) return;

    if(message.content.startsWith('+help')){
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Command Help')
            .setAuthor('Gronk')
            .setDescription('List of commands for Gronk')
            .setThumbnail('https://res.cloudinary.com/teepublic/image/private/s--SI57XYJv--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_6e2229,e_outline:48/co_6e2229,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1581086229/production/designs/7879036_1.jpg')
            .addFields(
                {name: 'Help', value: '+help'},
                {name: 'Generate Meme', value: '+meme'},
                {name: 'Generate Doggo', value: '+doggo'},
                {name: 'Generate Insult', value: '+insult'},
                {name: 'Generate Affirmation/Motivation', value: '+motivate'},
                {name: 'Rock Paper Scissors', value: '+rps <choice>'},
                {name: 'Daily Space Picture', value: '+spacedaily'},
            )
            .setTimestamp()

        message.channel.send(helpEmbed)
    }
})

client.on('message', message => {
    if(!message.guild) return;

    if (message.content.startsWith('+status')){
        message.channel.send('Time join: ' + message.guild.joinedAt)
    }
})

client.on('message', message => {
    if(!message.guild) return;

    if(message.content.startsWith('+whoami')){
        console.log(message.member.user.id)
        message.channel.send('You are: ' + message.member.user.username)
    }
})

// =======================
// league of legends tools
// =======================



client.on('message', message =>{
    if(!message.guild) return;

    if(message.content.startsWith('+champion')){
        var champion_string = message.content.substr("+champion ".length)

        var champion_url = 'https://ddragon.leagueoflegends.com/cdn/' + leaguePatch + '/data/en_US/champion/' + champion_string + '.json'
        var champion_image = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + champion_string + '_0.jpg'  
        

        request(champion_url, {json: true}, (err, res, body) =>{
            if(err) { message.channel.send('Internal server error')}
            
            else{
                
                champ_data = body
                if(champion_string === '' || champion_string === undefined){
                    champion = undefined
                }
                else{
                    if(champ_data.data === undefined){
                        champion = undefined
                    }
                    else{
                        champion = champ_data.data[champion_string]
                    }
                    
                }
                
                
                if(champion === undefined){
                    message.channel.send('Error invalid champion try capitalizing the name')
                }
                else{
                    message.channel.send('You searched for a champion named: ' + champion_string)
                    // console.log(champ_data.data[champion_string].name) // important solution to inputting string into json lookup
                    var championEmbed = new Discord.MessageEmbed()
                    .setColor('#000000')
                    .setTitle(champion.name + ' ' + champion.title)
                    .setDescription(champion.lore)
                    .setImage(champion_image)

                    message.channel.send(championEmbed)

                }  
            } 
        })
    }

    if(message.content.startsWith('+league')){
       //nothing yet     
    }
})

// ====================
// fun tools and games
// ====================




    client.on('message', message =>{
        if(!message.guild) return;

        
    })

    client.on('message', message =>{
        if(!message.guild) return;

// meme grabber - +meme to get a random meme
// input: none
// output: string
// description: returns a random url for a meme pulled from meme-api.herokuapp.com/gimme

        if(message.content.startsWith('+meme')){
            request('https://meme-api.herokuapp.com/gimme', {json: true}, (err, res, body) =>{
                if(err){
                    message.channel.send('Internal server error')
                }
                else{
                    meme_data = body

                    var memeEmbed = new Discord.MessageEmbed()
                    .setColor('#b04fa6')
                    .setTitle(meme_data.title)
                    .setAuthor('Gronk')
                    .setImage(meme_data.url)


                    message.channel.send(memeEmbed)
            
                }
            })
        }

// dog photo grabber - +doggo to get a random dog
// input: none
// output: string
// description: returns a random url for a dog picture

        if(message.content.startsWith('+doggo')){
            request('https://api.thedogapi.com/v1/images/search', {json: true}, (err, res, body) =>{
                if(err){
                    message.channel.send('Internal server error')
                }
                else{
                    dog_data = body[0]

                    if(dog_data.breeds.length > 0){
                        dog_name = dog_data.breeds[0].name
                    } else{
                        dog_name = 'Unknown'
                    }

                    var dogEmbed = new Discord.MessageEmbed()
                    .setColor('#b04fa6')
                    .setTitle(dog_name)
                    .setAuthor('Gronk')
                    .setImage(dog_data.url)
                    message.channel.send(dogEmbed)
                }
            })
        }

// rock paper scissors - +rps
// input: int (1 rock, 2 paper, 3 scissors)
// output: string

        if(message.content.startsWith('+rps')){
            var player = message.content.substr('+rps '.length)

            if(player === 'rock' || player === 'paper' || player === 'scissors'){
                var outcome = rockPaperScissor(player, message)
                message.channel.send(outcome)
            }
            else{
                message.channel.send('Invalid input please enter rock, paper, or scissors');
            }
        }

// insult generator - +insult
// input: none
// output: string
// description: generates a random insult directed at the user

        if(message.content.startsWith('+insult')){
            request('https://evilinsult.com/generate_insult.php?lang=en&type=json', {json: true}, (err, res, body) =>{
                if(err){
                    message.channel.send('Internal server error')
                }
                else{
                    insult_data = body
                    message.channel.send(insult_data.insult)
                    
                }
            })
        }

// motivation generator - +motivate
// input: none
// output: string
// description: generates a random motivational affirmation directed at the user

        if(message.content.startsWith('+motivate')){
            request('https://www.affirmations.dev/', {json: true}, (err, res, body) =>{
                if(err){
                    message.channel.send('Internal server error')
                }
                else{
                    motivate_data = body
                    message.channel.send(motivate_data.affirmation)
                }
            })
        }

// space picture generator - +spacedaily
// input none
// output: string
// description grabs the daily space picture

        if(message.content.startsWith('+spacedaily')){
            request('https://api.nasa.gov/planetary/apod?api_key=qRSs2dcqLUh8kOcWbhr3YhWak352fxmjAxlVcOZ5', {json: true}, (err, res, body) =>{
                if(err){
                    message.channel.send("NASA's servers are broken")
                }
                else{
                    space_data = body
                    const spaceDailyEmbed = new Discord.MessageEmbed()
                    .setColor('#b04fa6')
                    .setTitle(space_data.title)
                    .setDescription(space_data.explanation)
                    .setAuthor('Courtesy of NASA')
                    .setImage(space_data.hdurl)
                    .setFooter('copyright: ' + space_data.copyright + ' ' + space_data.date)

                    message.channel.send(spaceDailyEmbed)
                }
            })
        }

    })


        

    function convertGuess(guess){
        if(guess === 1){
            return ':mountain:'
        }
        if(guess === 2){
            return ':roll_of_paper:'
        }
        else{
            return ':scissors:'
        }
    }

    function convertPlayer(player){
        if(player === 'rock'){
            return 1
        }
        if(player === 'paper'){
            return 2
        }
        else{
            return 3
        }
    }

    function rockPaperScissor(player, message){
        computerGuess = ''
        computerRandom = Math.random()
        if(computerRandom <= .333333){
            computerGuess = 1 // rock
        }else if(computerRandom > .333333 && computerRandom <= .666666){
            computerGuess = 2 // paper
        }else{
            computerGuess = 3 // scissors
        }

        player = convertPlayer(player)

        // run game
        if(computerGuess === player){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription('Tie')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            return rpsEmbed
            // add some scoreboard logic possibly
        }
        // prob could use a switch statement for this but im too lazy to do good programming
        if(computerGuess === 1 && player === 2){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription(message.member.user.username + ' Wins')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            return rpsEmbed
        }
        if(computerGuess === 1 && player === 3){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription('Gronk Wins')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            .addField({
                value: '**Gronk Wins**'
            })
            return rpsEmbed
        }
        if(computerGuess === 2 && player === 1){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription('Gronk Wins')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            return rpsEmbed
        }
        if(computerGuess === 2 && player === 3){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription(message.member.user.username + ' Wins')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            return rpsEmbed
        }
        if(computerGuess === 3 && player === 1){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription(message.member.user.username + ' Wins')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            return rpsEmbed
        }
        if(computerGuess === 3 && player === 2){
            const rpsEmbed = new Discord.MessageEmbed()
            .setColor('#b04fa6')
            .setTitle('Rock Paper Scissors')
            .setDescription('Gronk Wins')
            .setAuthor('Gronk')
            .addFields(
                {name: 'Gronk chose:', value: convertGuess(computerGuess)},
                {name: message.member.user.username + ' chose:', value: convertGuess(player)}
            )
            return rpsEmbed
        }
    }

    client.on('message', message =>{
        if(message.content === 'brian'){
            message.channel.send('is gay')
        }
    })



// application auth    
client.login(bot_credentials)