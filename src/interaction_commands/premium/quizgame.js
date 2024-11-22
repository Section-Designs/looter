const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const PremiumUser = require('../../models/premium'); // Import the premium model

const triviaQuestions = [
    {
        question: "What is the capital of France?",
        options: ["A) Berlin", "B) Madrid", "C) Paris", "D) Rome"],
        answer: "C",
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A) Earth", "B) Mars", "C) Jupiter", "D) Saturn"],
        answer: "B",
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["A) Elephant", "B) Blue Whale", "C) Great White Shark", "D) Giraffe"],
        answer: "B",
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["A) Charles Dickens", "B) William Shakespeare", "C) Mark Twain", "D) Jane Austen"],
        answer: "B",
    },
    {
        question: "What is the smallest prime number?",
        options: ["A) 0", "B) 1", "C) 2", "D) 3"],
        answer: "C",
    },
    {
        question: "What is the main ingredient in guacamole?",
        options: ["A) Tomato", "B) Avocado", "C) Pepper", "D) Onion"],
        answer: "B",
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["A) Gold", "B) Oxygen", "C) Silver", "D) Helium"],
        answer: "B",
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["A) 1905", "B) 1912", "C) 1915", "D) 1920"],
        answer: "B",
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["A) Gold", "B) Iron", "C) Diamond", "D) Sapphire"],
        answer: "C",
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["A) Vincent Van Gogh", "B) Pablo Picasso", "C) Leonardo da Vinci", "D) Claude Monet"],
        answer: "C",
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["A) China", "B) Japan", "C) Thailand", "D) Korea"],
        answer: "B",
    },
    {
        question: "What is the longest river in the world?",
        options: ["A) Nile", "B) Amazon", "C) Yangtze", "D) Mississippi"],
        answer: "A", // This can be debated based on measurements
    },
    {
        question: "Who discovered penicillin?",
        options: ["A) Marie Curie", "B) Alexander Fleming", "C) Louis Pasteur", "D) Thomas Edison"],
        answer: "B",
    },
    {
        question: "What is the capital city of Australia?",
        options: ["A) Sydney", "B) Canberra", "C) Melbourne", "D) Brisbane"],
        answer: "B",
    },
    {
        question: "Which organ is responsible for pumping blood throughout the body?",
        options: ["A) Brain", "B) Liver", "C) Heart", "D) Lungs"],
        answer: "C",
    },
    {
        question: "In what year did World War II end?",
        options: ["A) 1940", "B) 1945", "C) 1950", "D) 1960"],
        answer: "B",
    },
    {
        question: "Which planet is known for its rings?",
        options: ["A) Jupiter", "B) Saturn", "C) Neptune", "D) Uranus"],
        answer: "B",
    },
    {
        question: "What is the capital of Canada?",
        options: ["A) Toronto", "B) Ottawa", "C) Vancouver", "D) Montreal"],
        answer: "B",
    },
    {
        question: "Which famous scientist developed the theory of relativity?",
        options: ["A) Isaac Newton", "B) Albert Einstein", "C) Galileo Galilei", "D) Stephen Hawking"],
        answer: "B",
    },
    {
        question: "What is the currency of Japan?",
        options: ["A) Yen", "B) Won", "C) Yuan", "D) Dollar"],
        answer: "A",
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["A) Atlantic Ocean", "B) Indian Ocean", "C) Arctic Ocean", "D) Pacific Ocean"],
        answer: "D",
    },
    {
        question: "Who was the first person to walk on the moon?",
        options: ["A) Buzz Aldrin", "B) Yuri Gagarin", "C) Neil Armstrong", "D) John Glenn"],
        answer: "C",
    },
    {
        question: "What is the main language spoken in Brazil?",
        options: ["A) Spanish", "B) Portuguese", "C) French", "D) English"],
        answer: "B",
    },
    {
        question: "Which element is represented by the symbol 'Na'?",
        options: ["A) Nitrogen", "B) Sodium", "C) Nickel", "D) Neptunium"],
        answer: "B",
    },
    {
        question: "Which animal is known as the king of the jungle?",
        options: ["A) Tiger", "B) Elephant", "C) Lion", "D) Gorilla"],
        answer: "C",
    },
    {
        question: "What is the capital of Italy?",
        options: ["A) Florence", "B) Venice", "C) Rome", "D) Milan"],
        answer: "C",
    },
    {
        question: "Which vitamin is produced when a person is exposed to sunlight?",
        options: ["A) Vitamin A", "B) Vitamin B12", "C) Vitamin C", "D) Vitamin D"],
        answer: "D",
    },
    {
        question: "What is the largest desert in the world?",
        options: ["A) Sahara", "B) Arabian", "C) Gobi", "D) Antarctic"],
        answer: "D",
    },
    {
        question: "Who is known as the 'Father of Geometry'?",
        options: ["A) Euclid", "B) Pythagoras", "C) Archimedes", "D) Isaac Newton"],
        answer: "A",
    },
    {
        question: "Which city hosted the 2016 Summer Olympics?",
        options: ["A) London", "B) Rio de Janeiro", "C) Tokyo", "D) Beijing"],
        answer: "B",
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["A) K2", "B) Kangchenjunga", "C) Lhotse", "D) Mount Everest"],
        answer: "D",
    },
    {
        question: "Which planet is the closest to the sun?",
        options: ["A) Earth", "B) Mars", "C) Mercury", "D) Venus"],
        answer: "C",
    },
    {
        question: "What is the most widely spoken language in the world?",
        options: ["A) English", "B) Mandarin", "C) Spanish", "D) Hindi"],
        answer: "B",
    },
    {
        question: "In which country would you find the Great Pyramid of Giza?",
        options: ["A) Mexico", "B) China", "C) Egypt", "D) India"],
        answer: "C",
    },
    {
        question: "What is the name of the longest river in South America?",
        options: ["A) Mississippi", "B) Nile", "C) Amazon", "D) Yangtze"],
        answer: "C",
    },
    {
        question: "What is the chemical formula for water?",
        options: ["A) H2O", "B) CO2", "C) O2", "D) H2"],
        answer: "A",
    },
    {
        question: "Who was the first woman to fly solo across the Atlantic Ocean?",
        options: ["A) Amelia Earhart", "B) Harriet Quimby", "C) Bessie Coleman", "D) Jacqueline Cochran"],
        answer: "A",
    },
    {
        question: "What is the currency of the United Kingdom?",
        options: ["A) Dollar", "B) Euro", "C) Pound", "D) Yen"],
        answer: "C",
    },
    {
        question: "Which country is known as the Land of the Free?",
        options: ["A) Canada", "B) Australia", "C) USA", "D) Switzerland"],
        answer: "C",
    },
    {
        question: "Who wrote the 'Harry Potter' series?",
        options: ["A) J.R.R. Tolkien", "B) J.K. Rowling", "C) Suzanne Collins", "D) Stephen King"],
        answer: "B",
    },
    {
        question: "What is the largest internal organ in the human body?",
        options: ["A) Heart", "B) Liver", "C) Lungs", "D) Kidney"],
        answer: "B",
    },
    {
        question: "What is the capital of Egypt?",
        options: ["A) Cairo", "B) Alexandria", "C) Luxor", "D) Giza"],
        answer: "A",
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["A) Oxygen", "B) Carbon Dioxide", "C) Nitrogen", "D) Helium"],
        answer: "B",
    },
    {
        question: "What is the main language spoken in Argentina?",
        options: ["A) Spanish", "B) Portuguese", "C) English", "D) Italian"],
        answer: "A",
    },
    {
        question: "Which is the longest bone in the human body?",
        options: ["A) Humerus", "B) Femur", "C) Tibia", "D) Radius"],
        answer: "B",
    },
    {
        question: "What is the smallest continent in the world?",
        options: ["A) Asia", "B) Europe", "C) Australia", "D) Antarctica"],
        answer: "C",
    },
    {
        question: "Which planet is known as the 'Giant Planet'?",
        options: ["A) Mars", "B) Saturn", "C) Jupiter", "D) Neptune"],
        answer: "C",
    },
    {
        question: "What is the hardest natural mineral?",
        options: ["A) Quartz", "B) Diamond", "C) Sapphire", "D) Ruby"],
        answer: "B",
    },
    {
        question: "Which element has the atomic number 1?",
        options: ["A) Helium", "B) Hydrogen", "C) Lithium", "D) Oxygen"],
        answer: "B",
    },
    {
        question: "Who painted the ceiling of the Sistine Chapel?",
        options: ["A) Michelangelo", "B) Raphael", "C) Da Vinci", "D) Botticelli"],
        answer: "A",
    },
    {
        question: "What is the name of the longest river in Europe?",
        options: ["A) Danube", "B) Volga", "C) Rhine", "D) Seine"],
        answer: "B",
    },
    {
        question: "What is the most widely used programming language?",
        options: ["A) JavaScript", "B) Python", "C) Java", "D) C++"],
        answer: "A",
    },
    {
        question: "Which animal is known for its ability to change colors?",
        options: ["A) Chameleon", "B) Octopus", "C) Squid", "D) Cuttlefish"],
        answer: "A",
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["A) Au", "B) Ag", "C) Pb", "D) Fe"],
        answer: "A",
    },
    {
        question: "Which famous ship sank after hitting an iceberg in 1912?",
        options: ["A) Britannic", "B) Titanic", "C) Olympic", "D) Lusitania"],
        answer: "B",
    },
    {
        question: "What is the largest country in the world?",
        options: ["A) USA", "B) Canada", "C) China", "D) Russia"],
        answer: "D",
    },
    {
        question: "What is the primary ingredient in bread?",
        options: ["A) Flour", "B) Sugar", "C) Water", "D) Yeast"],
        answer: "A",
    },
    {
        question: "What type of animal is a frog?",
        options: ["A) Reptile", "B) Mammal", "C) Amphibian", "D) Fish"],
        answer: "C",
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["A) Saturn", "B) Earth", "C) Jupiter", "D) Neptune"],
        answer: "C",
    },
    {
        question: "What is the most spoken language in the world?",
        options: ["A) Spanish", "B) English", "C) Mandarin", "D) Hindi"],
        answer: "C",
    },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Start a trivia question!'),
        
    async execute(interaction) {
        // Check if the user has premium access
        const userId = interaction.user.id;
        const hasPremium = await PremiumUser.findOne({ userId });

        if (!hasPremium) {
            return interaction.reply('You must purchase premium to use this command! Run /premium for more info.');
        }

        // Select a random trivia question
        const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

        // Create the embed with the question
        const embed = new EmbedBuilder()
            .setTitle("Trivia Question!")
            .setDescription(`${question.question}\n\n${question.options.join('\n')}`)
            .setColor('#FF69B4');

        // Create buttons for each answer option
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('A')
                .setLabel('A')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('B')
                .setLabel('B')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('C')
                .setLabel('C')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('D')
                .setLabel('D')
                .setStyle(ButtonStyle.Primary)
        );

        // Send the question with buttons
        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        // Filter to ensure only the user who triggered the command can interact
        const filter = i => i.user.id === interaction.user.id;

        // Create a collector for button clicks
        const collector = message.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 15000, // 15 seconds for response
        });

        collector.on('collect', async i => {
            if (i.customId === question.answer) {
                await i.reply({ content: "✅ Correct!", ephemeral: false });
            } else {
                await i.reply({ content: "❌ Incorrect!", ephemeral: false });
            }
            collector.stop(); // Stop the collector after an answer is chosen
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: "⏰ Time's up! No answer was selected.", components: [] });
            } else {
                interaction.editReply({ components: [] }); // Remove buttons after answer
            }
        });
    },
};
