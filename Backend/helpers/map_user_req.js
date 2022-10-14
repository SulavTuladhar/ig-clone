/**
 * maps request data with given obj
 * @params {object} user
 * @params {object} userData
 * @returns {object}
 */

module.exports = function(user,userData){
    if(userData.name)
        user.name = userData.name;
    if(userData.password)
        user.password = userData.password;
    if(userData.username)
        user.username = userData.username;
    if(userData.email)
        user.email = userData.email;
    if(userData.phoneNumber)
        user.phoneNumber = userData.phoneNumber;
    if(userData.gender)
        user.gender = userData.gender;
    if(userData.bio)
        user.bio = userData.bio;
    if(userData.dob)
        user.dob = userData.dob;
    if(userData.image)
        user.profilePicture = userData.image;
    if(userData.website)
        user.website = userData.website;
    
    return user; 
}