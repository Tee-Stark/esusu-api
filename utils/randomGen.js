const logger = require("../config/logger")

//function to generate random numbers between 0 and members.length
getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

exports.shuffleMembers = (members) => {
  let i = members.length;
  let j = 0, temp;
  logger.info("Shuffle of group members initiated!");
    while(--i > 0) {
        j = getRandomInt(i+1);
       temp = members[j];
       members[j] = members[i];
       members[i] = temp;
    }
    logger.info(`Shuffle of group members successfully completed: ${members}`)
    return members;
}


// another method -not as optimized
// exports.shuffleMembers = (members) => {
//   let shuffledMembers = [];
//   while (members.length > 0) {
//     let randomIndex = getRandomInt(members.length);
//     shuffledMembers.push(members[randomIndex]);
//     members.splice(randomIndex, 1);
//   }
//   return shuffledMembers;
// }

// function to check if the number is already in the table
// checkIfInTable = (number) => {
//   for (let i = 0; i < receipientTable.length; i++) {
//     if (receipientTable[i] === number) {
//       return true;
//     }
//   }
//   return false;
// };
